import { logger } from "firebase-functions/v2";
import { CallableOptions, CallableRequest, HttpsError, onCall } from "firebase-functions/v2/https";
import { adminFirestore, getPublicFirestoreWithAdminCreds } from "../config/db-config";
import { MigrationCollectionPaths, SharedCollectionPaths } from "../../../shared-models/routes-and-paths/fb-collection-paths.model";
import { BlogIndexRef, OldPost, Post, PostKeys } from "../../../shared-models/posts/post.model";
import { convertMillisToTimestamp, convertPostToBlogIndexRef } from "../config/global-helpers";
import { AdminImagePaths } from "../../../shared-models/routes-and-paths/image-paths.model";
import { SecretsManagerKeyNames } from "../../../shared-models/environments/env-vars.model";

const convertAnchorPodcastUrlToSpotifyUrl = (anchorUrl: string): string => {
  // Regular expression to extract necessary parts from the Anchor URL
  const regex = /https:\/\/anchor\.fm\/(.+)\/episodes\/(.+)/;
  
  // Match the URL against the regular expression
  const matches = anchorUrl.match(regex);

  if (matches && matches.length === 3) {
    const showName = matches[1];
    const episodePart = matches[2];

    // Construct the Spotify URL
    return `https://podcasters.spotify.com/pod/show/${showName}/episodes/${episodePart}`;
  } else {
    // Handle cases where the URL does not match the expected format
    throw new Error("Invalid Anchor URL format");
  }
}

const convertOldPostToNewPost = (oldPost: OldPost): Post => {
  let podcastEpisodeUrl = oldPost.podcastEpisodeUrl;
  if (podcastEpisodeUrl && podcastEpisodeUrl.includes('anchor.fm')) {
    podcastEpisodeUrl = convertAnchorPodcastUrlToSpotifyUrl(podcastEpisodeUrl);
  }
  return {
    [PostKeys.AUTHOR_ID]: oldPost.authorId,
    [PostKeys.AUTHOR_NAME]: oldPost.author,
    [PostKeys.BLOG_DOMAIN]: oldPost.blogDomain,
    [PostKeys.CREATED_TIMESTAMP]: convertMillisToTimestamp(oldPost.modifiedDate) as any,
    [PostKeys.CONTENT]: oldPost.content,
    [PostKeys.DESCRIPTION]: oldPost.description,
    [PostKeys.FEATURED]: oldPost.featured ? oldPost.featured : null,
    [PostKeys.HERO_IMAGES]: {
      imageUrlLarge: oldPost.imageProps ? oldPost.imageProps.srcset.split(' ')[2] : AdminImagePaths.HERO_PLACEHOLDER,
      imageUrlSmall: oldPost.imageProps ? oldPost.imageProps.srcset.split(' ')[0] : AdminImagePaths.HERO_PLACEHOLDER,
    },
    [PostKeys.ID]: oldPost.id,
    [PostKeys.IMAGES_LAST_UPDATED_TIMESTAMP]: oldPost.imagesUpdated ? convertMillisToTimestamp(oldPost.imagesUpdated) : null as any,
    [PostKeys.KEYWORDS]: oldPost.keywords,
    [PostKeys.LAST_MODIFIED_TIMESTAMP]: convertMillisToTimestamp(oldPost.modifiedDate) as any,
    [PostKeys.LAST_MODIFIED_USER_ID]: oldPost.authorId,
    [PostKeys.LAST_MODIFIED_USER_NAME]: oldPost.author,
    [PostKeys.PODCAST_EPISODE_URL]: podcastEpisodeUrl ? podcastEpisodeUrl : null as any,
    [PostKeys.PUBLISHED]: oldPost.published,
    [PostKeys.PUBLISHED_TIMESTAMP]: convertMillisToTimestamp(oldPost.publishedDate) as any,
    [PostKeys.READY_TO_PUBLISH]: oldPost.readyToPublish ? oldPost.readyToPublish : false,
    [PostKeys.SCHEDULED_AUTOPUBLISH_TIMESTAMP]: oldPost.scheduledPublishTime ? convertMillisToTimestamp(oldPost.scheduledPublishTime) : null as any,
    [PostKeys.TITLE]: oldPost.title,
    [PostKeys.VIDEO_URL]: oldPost.videoUrl ? oldPost.videoUrl : null as any,
  };
}

const migratePostData = async () => {
  const adminPostsCollectionRef = adminFirestore.collection(SharedCollectionPaths.POSTS);
  const publicPostsCollectionRef = getPublicFirestoreWithAdminCreds().collection(SharedCollectionPaths.POSTS);

  const adminBlogIndexRefsCollectionRef = adminFirestore.collection(SharedCollectionPaths.BLOG_INDEX_REFS);
  const publicBlogIndexRefsCollectionRef = getPublicFirestoreWithAdminCreds().collection(SharedCollectionPaths.BLOG_INDEX_REFS);
  
  const backupPostsCollectionRef = adminFirestore.collection(MigrationCollectionPaths.BACKUP_POSTS);
  const backupPostCollectionSnapshot = await backupPostsCollectionRef.get()
    .catch(err => {logger.log(`Error fetching postCollection:`, err); throw new HttpsError('internal', err);});

  logger.log(`Found ${backupPostCollectionSnapshot.size} backupPosts to migrate`);
  
  let adminWriteBatch = adminFirestore.batch();
  let publicWriteBatch = getPublicFirestoreWithAdminCreds().batch();
  let adminOperationCount = 0;
  let publicOperationCount = 0;

  for (const doc of backupPostCollectionSnapshot.docs) {
    const oldPost: OldPost = doc.data() as OldPost;
    const newPost: Post = convertOldPostToNewPost(oldPost);
    
    const newAdminPostRef = adminPostsCollectionRef.doc(oldPost.id);
    const newPublicPostRef = publicPostsCollectionRef.doc(oldPost.id);

    adminWriteBatch.set(newAdminPostRef, newPost);
    adminOperationCount++;

    // Only push to public if published
    if (newPost[PostKeys.PUBLISHED]) {
      publicWriteBatch.set(newPublicPostRef, newPost);
      publicOperationCount++;
    }
    
    const newBlogIndexRef: BlogIndexRef = convertPostToBlogIndexRef(newPost);

    const newAdminBlogIndexRefRef = adminBlogIndexRefsCollectionRef.doc(newPost[PostKeys.ID]);
    const newPublicBlogIndexRefRef = publicBlogIndexRefsCollectionRef.doc(newPost[PostKeys.ID]);
    
    adminWriteBatch.set(newAdminBlogIndexRefRef, newBlogIndexRef);
    adminOperationCount++;

    // Only push to public if published
    if (newPost[PostKeys.PUBLISHED]) {
      publicWriteBatch.set(newPublicBlogIndexRefRef, newBlogIndexRef);
      publicOperationCount++;
    }

    // Firestore batch limit is 500 operations per batch
    // Commit the existing batch and create a new batch instance (the loop will continue with that new batch instance)
    if (adminOperationCount === 490) {
      await adminWriteBatch.commit()
        .catch(err => {logger.log(`Error writing batch to admin database:`, err); throw new HttpsError('internal', err);});

      adminWriteBatch = adminFirestore.batch();
      adminOperationCount = 0;
    }

    if (publicOperationCount === 490) {
      await publicWriteBatch.commit()
        .catch(err => {logger.log(`Error writing batch to public database:`, err); throw new HttpsError('internal', err);});

      publicWriteBatch = getPublicFirestoreWithAdminCreds().batch();
      publicOperationCount = 0;
    }
  }

  if (adminOperationCount > 0) {
    await adminWriteBatch.commit()
      .catch(err => {logger.log(`Error writing batch to admin database:`, err); throw new HttpsError('internal', err);});
  }

  if (publicOperationCount > 0) {
    await publicWriteBatch.commit()
      .catch(err => {logger.log(`Error writing batch to public database:`, err); throw new HttpsError('internal', err);});
  }
}


/////// DEPLOYABLE FUNCTIONS ///////
const callableOptions: CallableOptions = {
  enforceAppCheck: true,
  secrets: [SecretsManagerKeyNames.ALTERNATE_PROJECT_SERVICE_ACCOUNT_CREDS]
};

export const onCallMigratePostData = onCall(callableOptions, async (request: CallableRequest<void>): Promise<void> => {
  const exportParams = request.data;
  logger.log('onCallMigratePostData requested with this data:', exportParams);

  await migratePostData();
 
});
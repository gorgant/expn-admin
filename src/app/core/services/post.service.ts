import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { map, takeUntil, catchError, switchMap, take } from 'rxjs/operators';
import { Observable, throwError, from, of } from 'rxjs';
import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/storage';
import { now } from 'moment';
import { PublicService } from './public.service';
import { ImageService } from './image.service';
import { AuthService } from './auth.service';
import { UiService } from './ui.service';
import { Post } from 'shared-models/posts/post.model';
import { ImageType } from 'shared-models/images/image-type.model';
import { SharedCollectionPaths } from 'shared-models/routes-and-paths/fb-collection-paths';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(
    private afs: AngularFirestore,
    private storage: AngularFireStorage,
    private publicService: PublicService,
    private imageService: ImageService,
    private uiService: UiService,
    private authService: AuthService,
  ) { }

  fetchAllPosts(): Observable<Post[]> {
    const postCollection = this.getPostCollection();
    return postCollection.valueChanges()
      .pipe(
        takeUntil(this.authService.unsubTrigger$),
        map(posts => {
          console.log('Fetched all posts', posts);
          return posts;
        }),
        catchError(error => {
          console.log('Error getting posts', error);
          this.uiService.showSnackBar(error, null, 5000);
          return throwError(error);
        })
      );
  }

  fetchSinglePost(id: string): Observable<Post> {
    const postDoc = this.getPostDoc(id);
    return postDoc.valueChanges()
    .pipe(
      take(1), // Prevents load attempts after deletion
      // takeUntil(this.authService.unsubTrigger$),
      map(post => {
        console.log('Fetched this item', post);
        return post;
      }),
      catchError(error => {
        this.uiService.showSnackBar(error, null, 5000);
        return throwError(error);
      })
    );
  }

  createPost(post: Post): Observable<Post> {
    const fbResponse = this.getPostDoc(post.id).set(post)
      .then(empty => {
        console.log('Post created', post);
        return post;
      })
      .catch(error => {
        console.log('Error creating post', error);
        return error;
      });

    return from(fbResponse);
  }

  updatePost(post: Post): Observable<Post> {
    const fbResponse = this.getPostDoc(post.id).update(post)
      .then(empty => {
        console.log('Post updated', post);
        return post;
      })
      .catch(error => {
        console.log('Error updating post', error);
        return error;
      });

    return from(fbResponse);
  }

  deletePost(postId: string): Observable<string> {

    // Be sure to delete images before deleting the item doc
    const deleteImagePromise = this.imageService.deleteAllItemImages(postId, ImageType.BLOG_HERO)
      .catch(err => {
        console.log('Error deleting post images', err);
        return err;
      });

    return from(deleteImagePromise)
      .pipe(
        switchMap(res => {
          const fbResponse = this.getPostDoc(postId).delete()
          .then(empty => {
            console.log('Post deleted', postId);
            return postId;
          })
          .catch(error => {
            console.log('Error deleting post', error);
            return throwError(error).toPromise();
          });
          return from(fbResponse);
        })
      );
  }

  // Update post on server (local update happens in store effects)
  togglePublishPost(post: Post): Observable<Post> {
    let updatedPost: Post = {
      ...post
    };
    if (!post.published) {
      updatedPost = {
        ...updatedPost,
        published: true,
        publishedDate: post.publishedDate ? post.publishedDate : now(), // Only add publish date if doesn't already exist
        scheduledPublishTime: null // Clear the scheduled time when published so it doesn't trigger unwanted publish requests
      };
    } else {
      updatedPost = {
        ...updatedPost,
        published: false,
      };
    }

    const serverRes = this.publicService.updatePublicPost(updatedPost)
      .then(res => {
        console.log('Server call succeded', res);
        return updatedPost;
      })
      .catch(error => {
        console.log('Error updating post', error);
        return error;
      });

    // For instant UI updates, don't wait for server response
    return of(updatedPost);
  }

  togglePostFeatured(post: Post): Observable<Post> {
    let updatedPost: Post = {
      ...post
    };
    if (post.featured) {
      updatedPost = {
        ...updatedPost,
        featured: false
      };
    } else {
      updatedPost = {
        ...updatedPost,
        featured: true
      };
    }

    const serverRes = this.publicService.updatePublicPost(updatedPost)
      .then(res => {
        console.log('Server call succeded', res);
        return updatedPost;
      })
      .catch(error => {
        console.log('Error updating post', error);
        return error;
      });

    // For instant UI updates, don't wait for server response
    return of(updatedPost);
  }

  generateNewPostId(): string {
    return this.afs.createId();
  }

  fetchStorageRef(imagePath: string): AngularFireStorageReference {
    return this.storage.ref(imagePath);
  }

  getPostDoc(id: string): AngularFirestoreDocument<Post> {
    return this.getPostCollection().doc(id);
  }

  private getPostCollection(): AngularFirestoreCollection<Post> {
    return this.afs.collection<Post>(SharedCollectionPaths.POSTS);
  }
}

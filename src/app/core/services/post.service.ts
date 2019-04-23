import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { map, takeUntil, catchError } from 'rxjs/operators';
import { Observable, throwError, from } from 'rxjs';
import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/storage';
import { Post } from '../models/posts/post.model';
import { ImageType } from '../models/images/image-type.model';
import { now } from 'moment';
import { PublicService } from './public.service';
import { ImageService } from './image.service';
import { AuthService } from './auth.service';
import { UiService } from './ui.service';

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
      takeUntil(this.authService.unsubTrigger$),
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
    const fbResponse = this.getPostCollection().doc(post.id).set(post)
      .then(empty => {
        console.log('Post created', post);
        return post;
      })
      .catch(error => {
        return throwError(error).toPromise();
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
        return throwError(error).toPromise();
      });

    return from(fbResponse);
  }

  async deletePost(postId: string): Promise<string> {
    await this.imageService.deleteAllItemImages(postId, ImageType.BLOG_HERO); // Be sure to delete images before deleting the item doc
    const fbResponse = this.getPostDoc(postId).delete()
      .then(empty => {
        console.log('Post deleted', postId);
        return postId;
      })
      .catch(error => {
        console.log('Error deleting post', error);
        return throwError(error).toPromise();
      });

    return fbResponse;
  }

  publishPost(post: Post): void {
    const publishedPost: Post = {
      ...post,
      published: true,
      publishedDate: post.publishedDate ? post.publishedDate : now() // Only add publish date if doesn't already exist
    };

    this.getPostDoc(post.id).update(publishedPost)
      .then(res => {
        // If the local update is successful, update on other server
        this.publicService.updatePublicPost(publishedPost); // Will publish post on public server (because published = true)
      })
      .catch(error => {
        console.log('Error publishing post in admin', error);
      });

  }

  unPublishPost(post: Post): void {

    const unPublishedPost: Post = {
      ...post,
      published: false,
    };

    this.getPostDoc(post.id).update(unPublishedPost)
      .then(res => {
        // If the local update is successful, update on other server
        this.publicService.updatePublicPost(unPublishedPost); // Will delete post on public server (because published = false)
      })
      .catch(error => {
        console.log('Error updating post', error);
      });
  }

  togglePostFeatured(post: Post): void {
    const postDoc = this.getPostDoc(post.id);
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

    console.log('Toggling post featured', updatedPost);

    postDoc.update(updatedPost)
      .then(res => {
        // If the local update is successful, update on other server
        this.publicService.updatePublicPost(updatedPost);
      })
      .catch(error => {
        console.log('Error updating post', error);
      });
  }

  generateNewPostId(): string {
    return this.afs.createId();
  }

  fetchStorageRef(imagePath: string): AngularFireStorageReference {
    return this.storage.ref(imagePath);
  }

  getPostDoc(id: string): AngularFirestoreDocument<Post> {
    return this.afs.doc<Post>(`posts/${id}`);
  }

  private getPostCollection(): AngularFirestoreCollection<Post> {
    return this.afs.collection<Post>('posts');
  }
}

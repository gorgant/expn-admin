import { Injectable } from '@angular/core';
import { AngularfirestorePublicStoreService, AngularfirestorePublicAuthService } from './angular-firestore-extension.service';
import { AngularFirestoreDocument } from '@angular/fire/firestore';
import { Post } from '../models/posts/post.model';
import { UiService } from './ui.service';
import { throwError, from } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PublicService {

  constructor(
    private afsPublic: AngularfirestorePublicStoreService,
    private afAuthPublic: AngularfirestorePublicAuthService,
    private uiService: UiService
  ) { }

  publishPublicPost(post: Post) {
    this.authPublic()
      .pipe(take(1))
      .subscribe(fbUser => {
        const publicDoc = this.getPostDoc(post.id);
        publicDoc.set(post)
        .catch(error => {
          console.log('Error publishing post on public', error);
        });
        console.log('Set this public post', post);
      });
  }

  private getPostDoc(id: string): AngularFirestoreDocument<Post> {
    return this.afsPublic.doc<Post>(`posts/${id}`);
  }

  private authPublic() {
    const authResponse = this.afAuthPublic.auth.signInWithEmailAndPassword(
      'test@test.com',
      'testtest'
    ).then(creds => {
      console.log('Auth success', creds);
      return creds.user;
    })
    .catch(error => {
      this.uiService.showSnackBar(error, null, 5000);
      return throwError(error).toPromise();
    });

    return from(authResponse);
  }
}

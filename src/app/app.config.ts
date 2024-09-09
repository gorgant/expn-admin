import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { APP_ROUTES } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore } from '@ngrx/router-store';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { initializeAppCheck, ReCaptchaEnterpriseProvider, provideAppCheck } from '@angular/fire/app-check';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { environment } from '../environments/environment';
import { AuthStoreEffects } from './root-store/auth-store/effects';
import { PodcastEpisodeStoreEffects } from './root-store/podcast-episode-store/effects';
import { PostStoreEffects } from './root-store/post-store/effects';
import { UserStoreEffects } from './root-store/user-store/effects';
import { reducers } from './root-store/root-store.state';
import { BlogIndexRefStoreEffects } from './root-store/blog-index-ref-store/effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(APP_ROUTES), 

    // Angularfire Providers
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideFunctions(() => getFunctions()),
    provideStorage(() => getStorage()),
    provideAuth(() => getAuth()),
    provideAppCheck(() => {
      const provider = new ReCaptchaEnterpriseProvider(environment.reCaptchaEnterpriseProviderKey);
      return initializeAppCheck(undefined, { provider, isTokenAutoRefreshEnabled: true });
    }),

    // NGRX Providers
    provideStore(reducers, {
      runtimeChecks: {
          strictStateSerializability: true,
          strictActionSerializability: false, // Disabled to handle image file
          strictActionTypeUniqueness: true,
      }
    }),
    provideEffects(
      [
        AuthStoreEffects,
        BlogIndexRefStoreEffects,
        PodcastEpisodeStoreEffects,
        PostStoreEffects,
        UserStoreEffects
      ]
    ),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }), 
    provideRouterStore(),
    
    // Other providers
    provideAnimationsAsync(), 

  ]
};

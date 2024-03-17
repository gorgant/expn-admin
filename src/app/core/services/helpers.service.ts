import { Injectable, Signal, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { PublicUser, PublicUserKeys } from '../../../../shared-models/user/public-user.model';
import { EmailUserData } from '../../../../shared-models/email/email-user-data.model';
import { GoogleCloudFunctionsTimestamp } from '../../../../shared-models/firestore/google-cloud-functions-timestamp.model';
import { SanitizedFileData } from '../../../../shared-models/images/sanitized-file-data.model';
import { Timestamp } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  private $isProductionEvironment = signal(false);

  constructor() {
    this.setEnvironmentType();
   }

  private setEnvironmentType() {
    this.$isProductionEvironment.set(environment.production)
    console.log('isProductionEnvironment:', this.$isProductionEvironment());
  }

  get isProductionEnvironment(): Signal<boolean> {
    return this.$isProductionEvironment.asReadonly();
  }

  // Remove spaces from url string
  removeSpacesFromString(stringWithSpaces: string): string {
    return stringWithSpaces.replace(/\s/g, '');
  }

  // Replace spaces with dashes and set lower case
  convertToFriendlyUrlFormat(stringWithSpaces: string): string {
    return stringWithSpaces.split(' ').join('-').toLowerCase();
  }

  // Firebase can't handle back slashes
  createOrReverseFirebaseSafeUrl = (url: string, reverse?: boolean): string => {
    if (reverse) {
      const urlWithSlashes = url.replace(/~1/g, '/'); // Revert to normal url
      return urlWithSlashes;
    }
    const removedProtocol = url.split('//').pop() as string;
    const replacedSlashes = removedProtocol.replace(/\//g, '~1');
    return replacedSlashes;
  }

  /**
   * Rounds a number to the nearest digits desired
   * @param numb Number to round
   * @param digitsToRoundTo Number of digits desired
   */
  // Courtesy of: https://stackoverflow.com/questions/15762768/javascript-math-round-to-two-decimal-places
  generateRoundedNumber(numb: number, digitsToRoundTo: number) {
    let n = numb;
    let digits = digitsToRoundTo;
    let negative = false;
    if (digits === undefined) {
        digits = 0;
    }
    if ( n < 0) {
      negative = true;
      n = n * -1;
    }
    const multiplicator = Math.pow(10, digits);
    n = parseFloat((n * multiplicator).toFixed(11));
    n = parseFloat((Math.round(n) / multiplicator).toFixed(2));
    if ( negative ) {
        n = parseFloat((n * -1).toFixed(2));
    }
    return n;
  }

  sanitizeFileName(file: File): SanitizedFileData {
    // https://stackoverflow.com/a/4250408/6572208 and https://stackoverflow.com/a/5963202/6572208
    const fileNameNoExt = file.name.replace(/\.[^/.]+$/, '').replace(/\s+/g, '_');
    // https://stackoverflow.com/a/1203361/6572208
    const fileExt = file.name.split('.').pop() as string;
    const fullFileName = fileNameNoExt + '.' + fileExt;

    return {
      fileNameNoExt,
      fileExt,
      fullFileName
    };
  }

  convertPublicUserDataToEmailUserData(userData: PublicUser): EmailUserData {
    const emailUserData: EmailUserData = {
      [PublicUserKeys.CREATED_TIMESTAMP]: userData[PublicUserKeys.CREATED_TIMESTAMP],
      [PublicUserKeys.EMAIL]: userData[PublicUserKeys.EMAIL], 
      [PublicUserKeys.EMAIL_GROUP_UNSUBSCRIBES]: userData[PublicUserKeys.EMAIL_GROUP_UNSUBSCRIBES],
      [PublicUserKeys.EMAIL_GLOBAL_UNSUBSCRIBE]: userData[PublicUserKeys.EMAIL_GLOBAL_UNSUBSCRIBE],
      [PublicUserKeys.EMAIL_OPT_IN_SOURCE]: userData[PublicUserKeys.EMAIL_OPT_IN_SOURCE],
      [PublicUserKeys.EMAIL_OPT_IN_CONFIRMED]: userData[PublicUserKeys.EMAIL_OPT_IN_CONFIRMED],
      [PublicUserKeys.EMAIL_OPT_IN_TIMESTAMP]: userData[PublicUserKeys.EMAIL_OPT_IN_TIMESTAMP], 
      [PublicUserKeys.EMAIL_OPT_OUT_TIMESTAMP]: userData[PublicUserKeys.EMAIL_OPT_OUT_TIMESTAMP], 
      [PublicUserKeys.EMAIL_SENDGRID_CONTACT_CREATED_TIMESTAMP]: userData[PublicUserKeys.EMAIL_SENDGRID_CONTACT_CREATED_TIMESTAMP],
      [PublicUserKeys.EMAIL_SENDGRID_CONTACT_ID]: userData[PublicUserKeys.EMAIL_SENDGRID_CONTACT_ID],
      [PublicUserKeys.EMAIL_SENDGRID_CONTACT_LIST_ARRAY]: userData[PublicUserKeys.EMAIL_SENDGRID_CONTACT_LIST_ARRAY],
      [PublicUserKeys.EMAIL_VERIFIED]: userData[PublicUserKeys.EMAIL_VERIFIED],
      [PublicUserKeys.FIRST_NAME]: userData[PublicUserKeys.FIRST_NAME],
      [PublicUserKeys.ID]: userData[PublicUserKeys.ID],
      [PublicUserKeys.LAST_MODIFIED_TIMESTAMP]: userData[PublicUserKeys.LAST_MODIFIED_TIMESTAMP],
      [PublicUserKeys.ONBOARDING_WELCOME_EMAIL_SENT]: userData[PublicUserKeys.ONBOARDING_WELCOME_EMAIL_SENT],
    };
    return emailUserData;
  }

  convertMillisToTimestamp = (millis: number): Timestamp => {
    const seconds = Math.floor(millis / 1000);
    const nanoseconds = (millis % 1000) * 1000000;
    return new Timestamp(seconds, nanoseconds);
  }

  convertGoogleCloudTimestampToMs(timestamp: GoogleCloudFunctionsTimestamp): number {
    // Convert seconds to milliseconds
    const millisecondsFromSeconds = timestamp._seconds * 1000;

    // Convert nanoseconds to milliseconds
    const millisecondsFromNanoseconds = timestamp._nanoseconds / 1000000;

    // Sum both to get the total milliseconds
    return millisecondsFromSeconds + millisecondsFromNanoseconds;
  }

  // Currently handles these formats
  // Type 1: https://www.youtube.com/watch?v=FU6r3BmlgBM
  // Type 2: https://www.youtube.com/live/FU6r3BmlgBM?si=AldRFZ5RuU95KkQw
  // Type 3: https://youtu.be/UJeSWbR6W04?si=THyX9RYEJoeRsSgA
  extractYoutubeVideoIdFromUrl(url: string): string | undefined {
    let videoId: string | undefined;

    // Handle Type 1
    if (url.includes('watch')) {
      const parsedUrl = new URL(url);
      const params = new URLSearchParams(parsedUrl.search);
      videoId = params.get('v') as string | undefined;
    } else {
      // Handle Type 2 & 3
      videoId = url.split('/').pop();
      if (videoId?.includes('?')) {
        videoId = videoId.split('?')[0];
      }
    }
    console.log('Extracted this video ID', videoId);
    return videoId;
  }

  generateRandomCharacterNoCaps(length: number) {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  /**
   * Deeply compares two objects for equality, ignoring the order of properties.
   * 
   * @param a - The first object to compare.
   * @param b - The second object to compare.
   * @returns true if objects are deeply equal, false otherwise.
   *
   * @example
   * const obj1 = { a: 1, b: { c: 2 } };
   * const obj2 = { b: { c: 2 }, a: 1 };
   * console.log(isEquivalent(obj1, obj2)); // true
   *
   * @note This function is not optimized for large or complex objects and 
   * does not handle special object types (like Date) uniquely.
   */
  verifyObjectsAreEqual(a: any, b: any): boolean {
    if (a === b) return true;
  
    if (typeof a !== 'object' || typeof b !== 'object' || a == null || b == null) {
      return false;
    }
  
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
  
    if (keysA.length !== keysB.length) {
      return false;
    }
  
    for (const key of keysA) {
      if (!keysB.includes(key)) {
        return false;
      }
  
      if (typeof a[key] === 'object' && typeof b[key] === 'object') {
        if (!this.verifyObjectsAreEqual(a[key], b[key])) {
          return false;
        }
      } else if (a[key] !== b[key]) {
        return false;
      }
    }
  
    return true;
  }

}

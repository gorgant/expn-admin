import * as functions from 'firebase-functions';

// Firebase can't handle back slashes
export const createOrReverseFirebaseSafeUrl = (url: string, reverse?: boolean): string => {
  if (reverse) {
    const urlWithSlashes = url.replace(/~1/g,'/') // Revert to normal url
    return urlWithSlashes;
  }
  const removedProtocol = url.split('//').pop() as string;
  const replacedSlashes = removedProtocol.replace(/\//g,'~1');
  return replacedSlashes;
}

// Replace spaces with dashes and set lower case
export const convertToFriendlyUrlFormat = (stringWithSpaces: string): string => {
  return stringWithSpaces.split(' ').join('-').toLowerCase();
}

// Convert Hrs:Min:Sec string to milliseconds
export const convertHoursMinSecToMill = (hrsMinSecStamp: string): number => {
  
  const hrs: number = Number(hrsMinSecStamp.split(':')[0]);
  const min: number = Number(hrsMinSecStamp.split(':')[1]);
  const sec: number = Number(hrsMinSecStamp.split(':')[2]);

  return ((hrs*60*60 + min*60 + sec) * 1000);
}

/**
Sends a descriptive error response when running a callable function
*/
export const catchErrors = async (promise: Promise<any>) => {
  try {
    return await promise;
  } catch(err) {
    console.log('Unknown error', err);
    throw new functions.https.HttpsError('unknown', err)
  }
}

// These assertions provide error logging to console (rather than in Cloud Functions log)

/**
Validates data payload of a callable function
*/
export const assert = (data: any, key:string) => {
  if (!data || !data[key]) {
    console.log(`Error with assertion, the following data did not have ${key} property`, data);
    throw new functions.https.HttpsError('invalid-argument', `function called without ${key} data`);
  } else {
    return data[key];
  }
}

/**
Validates auth context for callable function 
*/
export const assertUID = (context: functions.https.CallableContext) => {
  if (!context.auth) {
    console.log(`Error with assertion, http function called without context.auth`);
    throw new functions.https.HttpsError('permission-denied', 'function called without context.auth');
  } else {
    return context.auth.uid;
  }
}

/**
 * Rounds a number to the nearest digits desired
 * @param number Number to round
 * @param digitsToRoundTo Number of digits desired
 */

// Courtesy of: https://stackoverflow.com/questions/15762768/javascript-math-round-to-two-decimal-places
export const generateRoundedNumber = (number: number, digitsToRoundTo: number) => {
  let n = number;
  let digits = digitsToRoundTo; 
  let negative = false;
    if (digits === undefined) {
        digits = 0;
    }
        if( n < 0) {
        negative = true;
      n = n * -1;
    }
    const multiplicator = Math.pow(10, digits);
    n = parseFloat((n * multiplicator).toFixed(11));
    n = parseFloat((Math.round(n) / multiplicator).toFixed(2));
    if( negative ) {    
        n = parseFloat((n * -1).toFixed(2));
    }
    return n;
}
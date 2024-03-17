import { getStorage } from "firebase-admin/storage";
import { adminAppFirebaseInstance, publicAppFirebaseInstance } from "./app-config";

export const publicStorage = getStorage(publicAppFirebaseInstance);
export const adminStorage = getStorage(adminAppFirebaseInstance);
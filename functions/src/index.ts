
// Structure courtesy of https://github.com/malikasinger1/firebase-functions-with-typescript

import { resizeImages } from './local/resize-images';
export { resizeImages };

import { createAdminUser } from './local/create-admin-user';
export { createAdminUser };

import { updatePublicBlogPost } from './public/update-public-blog-post';
export { updatePublicBlogPost };

import { updateGeographicData } from './public/update-geographic-data';
export { updateGeographicData };

import { updateProduct } from './public/update-product';
export { updateProduct };

import { saveOrderInFirestore } from './public/store-order';
export { saveOrderInFirestore };
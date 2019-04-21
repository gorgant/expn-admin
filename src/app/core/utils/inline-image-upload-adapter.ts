import { ImageType } from '../models/images/image-type.model';
import { ImageService } from '../services/image.service';

// Adapted from https://ckeditor.com/docs/ckeditor5/latest/framework/guides/deep-dive/upload-adapter.html
export class InlineImageUploadAdapter {

  constructor(
    private loader,
    private postId: string,
    private imageService: ImageService
  ) {
    console.log('Constructing inline image adapter with post id', postId);
  }

  // Starts the upload process.
  async upload() {
    const file = await this.loader.file;

    return new Promise( async (resolve, reject) => {
      const itemId = this.postId;
      const imageType = ImageType.BLOG_INLINE;

      const urlObject = await this.imageService.uploadImageAndFetchUrls(file, itemId, imageType);

      this.imageService.setImageProcessingComplete();

      if (!urlObject || urlObject as unknown === 'Only image files allowed') {
        reject('Error loading image');
      }
      console.log('About to resolve upload with url', urlObject);
      resolve(urlObject);
    });
  }

  // Aborts the upload process.
  abort() {
    console.log('Upload aborted');
  }
}

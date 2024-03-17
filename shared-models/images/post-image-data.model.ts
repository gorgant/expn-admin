import { PostImageMetadata } from "./image-metadata.model";

export interface PostImageResizeData {
  file: File,
  imageMetadata: PostImageMetadata
}
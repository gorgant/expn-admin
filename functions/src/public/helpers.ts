import { WebpageUrl } from "../../../shared-models/ssr/webpage-url.model";
import { Post } from "../../../shared-models/posts/post.model";
import { PublicAppRoutes } from "../../../shared-models/routes-and-paths/app-routes.model";
import { publicAppUrl } from "../config/environments-config";
import { convertToFriendlyUrlFormat } from "../config/global-helpers";

export const generateBlogUrlObject = (): WebpageUrl => {
  const blogSlugWithSlashPrefix = PublicAppRoutes.BLOG;
  const blogUrl: string = `https://${publicAppUrl}${blogSlugWithSlashPrefix}`;
  const urlObject: WebpageUrl = { url: blogUrl };
  return urlObject;
}

export const generatePostUrlObject = (post: Post): WebpageUrl => {
  const blogSlugWithSlashPrefix = PublicAppRoutes.BLOG;
  const postSlug: string = convertToFriendlyUrlFormat(post.title);
  const postUrl: string = `https://${publicAppUrl}${blogSlugWithSlashPrefix}/${post.id}/${postSlug}`;
  const urlObject: WebpageUrl = { url: postUrl };
  return urlObject;
}

export const generateHomeUrlObject = (): WebpageUrl => {
  const homeUrl: string = `https://${publicAppUrl}`;
  const urlObject: WebpageUrl = { url: homeUrl };
  return urlObject;
}
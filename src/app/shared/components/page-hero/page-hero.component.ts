import { Component } from '@angular/core';
import { PublicImagePaths } from '../../../../../shared-models/routes-and-paths/image-paths.model';

@Component({
  selector: 'app-page-hero',
  standalone: true,
  imports: [],
  templateUrl: './page-hero.component.html',
  styleUrl: './page-hero.component.scss'
})
export class PageHeroComponent {
  DEFAULT_POST_IMAGE_URL = PublicImagePaths.POST_HERO;
}

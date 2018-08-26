import { Injectable } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Injectable()
export class MetatagService {
  // default values
  config = {
    title: 'MachineLabs',
    description:
      'MachineLabs is a platform that makes machine learning available to everyone through experiments in the browser.',
    image: 'https://machinelabs.ai/assets/images/ml-app.png'
  };

  constructor(private meta: Meta) {}

  /**
   * Can be used to override default meta tags on a component basis
   * @param config: {title, description, image}
   */
  generateTags(config) {
    this.config = Object.assign({}, this.config, config);

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:site', content: '@machinelabs_ai' });
    this.meta.updateTag({ name: 'twitter:title', content: this.config.title });
    this.meta.updateTag({ name: 'twitter:description', content: this.config.description });
    this.meta.updateTag({ name: 'twitter:image', content: this.config.image });

    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: 'MachineLabs' });
    this.meta.updateTag({ property: 'og:title', content: this.config.title });
    this.meta.updateTag({ property: 'og:description', content: this.config.description });
    this.meta.updateTag({ property: 'og:image', content: this.config.image });
  }
}

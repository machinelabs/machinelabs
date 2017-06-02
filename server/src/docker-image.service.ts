import { DbRefBuilder } from './ml-firebase';
import { Observable } from '@reactivex/rxjs';

export function getDockerImages() {
  let db = new DbRefBuilder();
  return db.dockerImagesRef()
    .onceValue()
    .map(snapshot => this.dockerImages = snapshot.val());
}

export class DockerImageService {

  private dockerImages: any;

  constructor(private dockerImages$: Observable<any>) { }

  init(): Observable<any> {
    let dockerImages = this.dockerImages$.share();
    dockerImages.subscribe(images => this.dockerImages = images);
    return dockerImages;
  }

  getImageInfo(id: string) {
    if (!this.dockerImages) {
      throw new Error('No Docker Images available. Make sure to call `init()` first');
    }

    if (this.dockerImages.common[id]) {
      return {
        common: this.dockerImages.common[id],
        protected: this.dockerImages.protected[id]
      };
    }

    return null;
  }

  getImageDigest(id: string) {
    let imageInfo = this.getImageInfo(id);
    return imageInfo ? imageInfo.protected.image_digest : null;
  }

  getImageNameWithDigest(id: string) {
    let imageInfo = this.getImageInfo(id);
    return imageInfo ? `${imageInfo.protected.image_name}@${imageInfo.protected.image_digest}` : null;
  }
}
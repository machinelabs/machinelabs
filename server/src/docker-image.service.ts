import { dbRefBuilder } from './ml-firebase/db';
import { Observable, forkJoin } from 'rxjs';
import { map, share, mergeMap, tap } from 'rxjs/operators';
import { SpawnShellFn, ProcessStreamData } from '@machinelabs/core';

export function getDockerImages() {
  return dbRefBuilder
    .dockerImagesRef()
    .onceValue()
    .pipe(map(snapshot => snapshot.val()));
}

export interface DockerImages {
  common: {
    [index: string]: {
      id: string;
      name: string;
    };
  };

  protected: {
    [index: string]: {
      id: string;
      image_digest: string;
      image_name: string;
    };
  };
}

export class DockerImageService {
  private dockerImages$: Observable<DockerImages>;
  private dockerImages: DockerImages;

  constructor(dockerImages$: Observable<DockerImages>, private spawnShell: SpawnShellFn) {
    this.dockerImages$ = dockerImages$.pipe(share());
  }

  init(): Observable<any> {
    this.dockerImages$.subscribe(images => (this.dockerImages = images));
    return this.dockerImages$;
  }

  pullImages() {
    if (this.dockerImages) {
      return this.pull(this.dockerImages);
    } else {
      return this.dockerImages$.pipe(mergeMap(images => this.pull(images)));
    }
  }

  private pull(images: DockerImages) {
    return forkJoin(Object.values(images.protected).map(val => this.pullImage(val.id)));
  }

  private pullImage(id: string) {
    return this.spawnShell(`docker pull ${this.getImageNameWithDigest(id)}`).pipe(tap(msg => console.log(msg.str)));
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
    const imageInfo = this.getImageInfo(id);
    return imageInfo ? imageInfo.protected.image_digest : null;
  }

  getImageNameWithDigest(id: string) {
    const imageInfo = this.getImageInfo(id);
    return imageInfo ? `${imageInfo.protected.image_name}@${imageInfo.protected.image_digest}` : null;
  }
}

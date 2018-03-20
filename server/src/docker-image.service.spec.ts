import 'jest';

import { DockerImageService } from './docker-image.service';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';

const dockerImages = {
  common: {
    'keras_v2-4-x_python_2': {
      id: 'keras_v2-4-x_python_2',
      name: 'Keras 2.4.0 + Python 2'
    }
  },
  protected: {
    'keras_v2-4-x_python_2': {
      id: 'keras_v2-4-x_python_2',
      image_digest: 'sha256:d0bf867c1924b4448f3eec833013e1fdd1a22f28a478479094945cccee4fda46',
      image_name: 'floydhub/tensorflow:latest-py3'
    }
  }
};

describe('.getImageInfo()', () => {
  it('should raise exception if no image info available', () => {
    const svc = new DockerImageService(empty(), null);

    expect(() => {
      svc.getImageInfo('some-id');
    }).toThrowError();
  });

  it('should return null for non existent ids', () => {
    const svc = new DockerImageService(of(dockerImages), null);
    svc.init().subscribe();
    expect(svc.getImageInfo('some-id')).toBeNull();
  });
});

import { of } from 'rxjs';

export const DOCKER_IMAGE_SERVICE_STUB = {
  getDockerImages: () => {
    return of([
      {
        id: 'keras_v2-0-x_python_2-1',
        name: 'Keras 2.0.4 + Python 2.1',
        description: 'Keras 2.0.4 and Python 2.1'
      }
    ]);
  }
};

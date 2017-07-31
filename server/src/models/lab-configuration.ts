export class PublicLabConfiguration {
  dockerImageId: string;
}

export class PrivateLabConfiguration extends PublicLabConfiguration {
  dockerImageId = 'keras_v2-0-x_python_3-1';
  imageWithDigest = 'floydhub/tensorflow:latest-py3@sha256:d0bf867c1924b4448f3eec833013e1fdd1a22f28a478479094945cccee4fda46';
}

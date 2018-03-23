export const getCurlForUpload = (
  bucketName: string,
  file: string,
  storeFullPath: string,
  authToken: string,
  headers: Map<string, string> = new Map()
) => {
  const headerStr = Array.from(headers).reduce((prev, current) => prev + ` -H "${current[0]}:${current[1]}"`, '');

  // tslint:disable-next-line
  return `curl --silent --show-error ${headerStr} --upload-file "${file}" -H "Authorization: Bearer ${authToken}" "https://storage.googleapis.com/${bucketName}/${storeFullPath}"`;
};

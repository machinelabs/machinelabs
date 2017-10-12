import { Request, Response } from 'express';
import * as express from 'express';
import * as fs from 'fs';

import { environment } from './environments/environment';

const Storage = require('@google-cloud/storage');
const version = require('../package.json').version;
const app = express();

let storage: any, bucket: any;

const isDebug = !!environment['debug'];

if (isDebug) {
  console.log('REST API running in Debug mode. Serving files from ./mock-bucket');
} else {
  storage = Storage();
  bucket = storage.bucket(environment.firebaseConfig.storageBucket);
}

const getFileFromBucket = (path: string) => bucket.file(path).createReadStream();

const getFileFromFs = (path: string) => fs.createReadStream(`./mock-bucket/${path}`);

const getFileStream = isDebug ? getFileFromFs : getFileFromBucket;


app.get('/version', (req: Request, res: Response) => {
  res.status(200).send(`MachineLabs REST API v${version}`).end();
});

app.get('/404', (req: Request, res: Response) => {
  res.status(404).send(`The requested file does not exist`).end();
});

app.get('/executions/:eid/outputs/:oid', (req, res) => {

  const eid = req.params.eid;
  const oid = req.params.oid;

  res.setHeader('Content-Disposition', `attachment; filename=${oid}`);

  let fileStream =  getFileStream(`/executions/${eid}/outputs/${oid}`);

  // Theoretically we could return 404 directly instead of redirecting to 404.
  // However, it turns out that Chrome doesn't like it if we start responding
  // as if we return a file and then change our mind to return a 404.
  // That isn't a problem with Firefox or curl though.
  // By redirecting before we send the 404, we make sure that Chrome not only recognizes the
  // status code correctly as 404 but also shows the 404 page that we return.
  fileStream.on('error', (err: any) => res.redirect('/404'));

  fileStream.pipe(res);
});

app.get('*', (req: Request, res: Response) => res.redirect('/404'));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

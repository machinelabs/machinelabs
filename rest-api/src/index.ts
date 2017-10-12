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

app.get('/executions/:eid/outputs/:oid', (req, res) => {

  const eid = req.params.eid;
  const oid = req.params.oid;

  res.setHeader('Content-Disposition', `attachment; filename=${oid}`);

  let fileStream =  getFileStream(`/executions/${eid}/outputs/${oid}`)
                      .pipe(res);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

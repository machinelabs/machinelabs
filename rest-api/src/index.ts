import { Request, Response } from 'express';
import * as express from 'express';
import { environment } from './environments/environment';

const Storage = require('@google-cloud/storage');
const version = require('../package.json').version;
const app = express();

const storage = Storage();

let bucket = storage.bucket(environment.firebaseConfig.storageBucket);

app.get('/version', (req: Request, res: Response) => {
  res.status(200).send(`MachineLabs REST API v${version}`).end();
});

app.get('/executions/:eid/outputs/:oid', (req, res) => {

  const eid = req.params.eid;
  const oid = req.params.oid;

  res.setHeader('Content-Disposition', `attachment; filename=${oid}`);

  let fileStream =  bucket
          .file(`/executions/${eid}/outputs/${oid}`)
          .createReadStream()
          .pipe(res);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

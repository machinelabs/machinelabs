To get downloads from the browser to work for storage buckets, one
needs to enable CORS

`gsutil cors set cors.json gs://<your-cloud-storage-bucket>`

See: https://firebase.google.com/docs/storage/web/download-files#cors_configuration
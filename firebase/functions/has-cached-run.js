const admin = require('firebase-admin');
const functions = require('firebase-functions');
const crypto = require('crypto');

function hashFiles(files) {
  const hasher = crypto.createHash('sha256');
  return hasher.update(JSON.stringify(files)).digest('hex');
}

module.exports = functions.database.ref('/labs/{id}/files')
  .onWrite(event => {
    const data = event.data.val();

    console.log(`stringify files: 
                 ${JSON.stringify(data)}`);

    const hash = hashFiles(data);
    console.log(`Looking for hash: ${hash}`);

    return admin.database().ref('executions')
                    .orderByChild('file_set_hash')
                    .equalTo(hash)
                    .once('value')
                    .then(snapshot => snapshot.val())
                    .then(val => {
                      console.log(`Found hash: ${val}`);
                      return event.data.ref.parent.update({
                        'has_cached_run': val ? true : false,
                        'file_set_hash': hash
                      });
                    });
  });

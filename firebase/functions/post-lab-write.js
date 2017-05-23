const admin = require('firebase-admin');
const functions = require('firebase-functions');
const crypto = require('crypto');


module.exports = functions.database.ref('/labs/{id}/common')
  .onWrite(event => Promise.all([saveUserLabId(event), setHasCachedRun(event)]));

function hashFiles(files) {
  const hasher = crypto.createHash('sha256');
  return hasher.update(JSON.stringify(files)).digest('hex');
}

function saveUserLabId(event) {
  const data = event.data.val();
  return admin.database()
              .ref(`user_labs/${data.user_id}/${data.id}`)
              .set(true);
}

function setHasCachedRun(event) {
  const data = event.data.val();

  console.log(`stringify files: 
                ${JSON.stringify(data.files)}`);

  const hash = hashFiles(data.files);
  console.log(`Looking for hash: ${hash} of lab ${event.params.id}`);


  return admin.database().ref('executions')
                          .orderByChild('common/file_set_hash')
                          .equalTo(hash)
                          .once('value')
                          .then(snapshot => snapshot.val())
                          .then(val => {
                            console.log(`Found hash: ${val}`);
                            return admin.database()
                              .ref(`/labs/${event.params.id}/common`)
                              .update({
                                'has_cached_run': val ? true : false,
                                'file_set_hash': hash
                              });
                          });
}

const chalk = require("chalk");

module.exports = function(db, argv) {
  const delta = {};

  if (argv["dry-run"]) {
    console.log(chalk.blue("INFO: Performing migration as dry-run"));
  }

  console.log(
    chalk.blue(
      "Updating /idx/user_labs and /idx_labs. Abort when no new entries are written"
    )
  );

  db.ref("/labs").on("child_added", snapshot => {
    let lab = snapshot.val();

    let delta = {};

    if (lab) {
      delta[`/idx/user_labs/${lab.common.user_id}/${lab.common.id}`] = true;
      // Labs that don't have a `hidden` property at all will be set to `true`
      delta[`/idx/user_visible_labs/${lab.common.user_id}/${lab.common.id}`] =
        lab.common.hidden === true ? null : true;
    }

    if (argv["dry-run"]) {
      console.log(chalk.blue(`This is a dry run. Would otherwise write:`));
      console.log(delta);
    } else {
      console.log(chalk.blue(`Writing:`));
      console.log(delta);
      db.ref().update(delta);
    }
  });

  // The `migrate` command expects us to tell when the operation is done but this
  // script isn't expected to complete on its own.
  return new Promise((resolve, reject) => {});
};

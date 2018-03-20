const chalk = require("chalk");

module.exports = function(db, argv) {
  const delta = {};

  if (argv["dry-run"]) {
    console.log(chalk.blue("INFO: Performing migration as dry-run"));
  }

  console.log(chalk.blue("Fetching labs without `hidden` field..."));

  return db
    .ref("/labs")
    .orderByChild("common/hidden")
    .equalTo(null)
    .once("value")
    .then(snapshot => snapshot.val())
    .then(labs => Object.entries(labs || {}))
    .then(entries => {
      if (entries.length === 0) {
        console.log(
          chalk.blue("No labs without `hidden` field found. Migration done.")
        );
      } else {
        console.log(chalk.blue(`Found ${entries.length} labs`));
      }
      return entries.map(entry => entry[1]);
    })
    .then(labs => {
      labs.forEach(lab => {
        console.log(
          chalk.blue(
            `Setting \`hidden\` field to \`false\` for lab: ${lab.common.id}`
          )
        );
        delta[`/labs/${lab.common.id}/common/hidden`] = false;

        console.log(
          chalk.blue(
            `Adding lab: ${lab.common.id} to visible labs for user: ${
              lab.common.user_id
            }`
          )
        );
        delta[
          `/idx/user_visible_labs/${lab.common.user_id}/${lab.common.id}`
        ] = true;
      });
    })
    .then(_ => {
      if (!argv["dry-run"]) {
        console.log(chalk.blue("Updating database..."));
        return db.ref().update(delta);
      }
      console.log(
        chalk.blue(
          "Migration was done as dry-run. No database updates have been performed."
        )
      );
    });
};

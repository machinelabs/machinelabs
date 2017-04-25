if [ ! -d "./server" ]; then
  echo "This command needs to invoked on the root level"
  exit
fi

# run the build
echo "Running build"
(cd ./firebase; firebase use machinelabs-staging && firebase deploy)


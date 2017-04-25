if [ ! -d "./server" ]; then
  echo "This command needs to invoked on the root level"
  exit
fi

echo "Starting deployment for staging system"
./scripts/deploy_staging_server.sh
./scripts/deploy_staging_firebase.sh
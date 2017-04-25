if [ ! -d "./server" ]; then
  echo "This command needs to invoked on the root level"
  exit
fi

# run the build
echo "Running build"
(cd ./server; gulp build --staging)

# With our current setup transferring the ./dist isn't enough
# We have to zip the entire directory (takes ages otherwise)
# Send it over, and then unzip it on the other end

# zip the server directory
echo "Zipping files for better performance"
tar -zcvf machinelabs-server.tar.gz ./server

# copy over
echo "Transferring files to server"
gcloud compute copy-files ./machinelabs-server.tar.gz root@machinelabs-staging:/var/machinelabs-server.tar.gz --project "machinelabs-a73cd" --zone "asia-east1-a"

# unzip and run
echo "Unzipping and restarting services"
gcloud compute --project "machinelabs-a73cd" ssh --zone "asia-east1-a" "root@machinelabs-staging" --command "cd /var && tar -zxvf machinelabs-server.tar.gz && pm2 restart all"

echo "Cleaning up"
# Cleanup
rm -rf ./machinelabs-server.tar.gz

echo "Live..."



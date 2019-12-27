#!/bin/sh

# run this using Docker:
# docker run -it -v$PWD:/mnt node bash /mnt/getInfoForAppId.sh com.company1.wallet com.company2.wallet

echo "installing missing stuff"
npm install google-play-scraper dateformat js-yaml sleep
cd /mnt

echo "adding wallets from command line parameters"
for appId in "$@"; do
  echo getting info for app $appId

  node getInfoForAppId.js $appId
done

echo "Cleaning up"

node getInfoSanitize.js

echo "Done! I'm just a stupid bot! Please carefully review my changes before committing or publishing!"

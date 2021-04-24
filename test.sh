#!/bin/bash

downloadedApp="$1"
# make sure path is absolute
if ! [[ $downloadedApp =~ ^/.* ]]; then
  downloadedApp="$PWD/$downloadedApp"
fi
wsContainer="walletscrutiny/android:5"

set -x

containerApktool() {
  targetFolder=$1
  app=$2
  targetFolderParent=$(dirname "$targetFolder")
  targetFolderBase=$(basename "$targetFolder")
  appFolder=$(dirname "$app")
  appFile=$(basename "$app")
  # Run apktool in a container so apktool doesn't need to be installed.
  # The folder with the apk file is mounted read only and only the output folder
  # is mounted with write permission.
  podman run \
    --rm \
    --volume $targetFolderParent:/tfp \
    --volume $appFolder:/af:ro \
    $wsContainer \
    sh -c "apktool d -o \"/tfp/$targetFolderBase\" \"/af/$appFile\""
  return $?
}

getSigner() {
  DIR=$(dirname "$1")
  BASE=$(basename "$1")
  s=$(
    podman run \
      --rm \
      --volume $DIR:/mnt:ro \
      --workdir /mnt \
      $wsContainer \
      apksigner verify --print-certs "$BASE" | grep "Signer #1 certificate SHA-256"  | awk '{print $6}' )
  echo $s
}

usage() {
  echo 'NAME
       test.sh - test if apk can be built from source

SYNOPSIS
       test.sh downloadedApp

DESCRIPTION
       This command tries to verify builds of apps that we verified before.
       
       downloadedApp  The apk file we want to test.'
}

if [ ! -f "$downloadedApp" ]; then
  echo "APK file not found!"
  echo
  usage
  exit 1
fi

apkHash=$(sha256sum "$downloadedApp" | awk '{print $1;}')
fromPlayFolder=/tmp/fromPlay$apkHash
sudo rm -rf $fromPlayFolder
signer=$( getSigner "$downloadedApp" )
echo "Extracting APK content ..."
containerApktool $fromPlayFolder "$downloadedApp" || exit 1
sudo chown $(id -u):$(id -g) -R $fromPlayFolder
appId=$( cat $fromPlayFolder/AndroidManifest.xml | head -n 1 | sed 's/.*package=\"//g' | sed 's/\".*//g' )
versionName=$( cat $fromPlayFolder/apktool.yml | grep versionName | sed 's/.*\: //g' | sed "s/'//g" )
versionCode=$( cat $fromPlayFolder/apktool.yml | grep versionCode | sed 's/.*\: //g' | sed "s/'//g" )
fromPlayUnpacked=/tmp/fromPlay_"$appId"_"$versionCode"
workDir="/tmp/test$appId"
sudo rm -rf $fromPlayUnpacked
mv $fromPlayFolder $fromPlayUnpacked

if [ -z $appId ]; then
  echo "appId could not be tetermined"
  exit 1
fi

if [ -z $versionName ]; then
  echo "versionName could not be determined"
  exit 1
fi

if [ -z $versionCode ]; then
  echo "versionCode could not be determined"
  exit 1
fi

echo
echo "Testing \"$downloadedApp\" ($appId version $versionName)"
echo

prepare() {
  echo "Testing $appId from $repo revision $tag ..."
  # cleanup
  sudo rm -rf /tmp/test$appId || exit 1
  # get uinque folder
  mkdir $workDir
  cd $workDir
  # clone
  echo "Trying to clone version $tag ..."
  git clone --quiet --branch "$tag" --depth 1 $repo app || exit 1
  cd app
}

result() {
  # collect results
  fromBuildUnpacked="/tmp/fromBuild_${appId}_$versionCode"
  sudo rm -rf $fromBuildUnpacked
  containerApktool $fromBuildUnpacked "$builtApk" || exit 1
  sudo chown $(id -u):$(id -g) -R $fromBuildUnpacked
  echo "Results:
appId:          $appId
signer:         $signer
apkVersionName: $versionName
apkVersionCode: $versionCode
apkHash:        $apkHash

Diff:
$( diff --brief --recursive $fromPlayUnpacked $fromBuildUnpacked )

Revision, tag (and its signature):
$( git tag -v "$tag" )

Run a full
diff --recursive $fromPlayUnpacked $fromBuildUnpacked
meld $fromPlayUnpacked $fromBuildUnpacked
or
diffoscope $downloadedApp $builtApk
for more details."
}

case "$appId" in
  "com.mycelium.wallet")
    source scripts/testMycelium.sh
    test ":mbw:assembleProdnetRelease"
    ;;
  "com.mycelium.testnetwallet")
    source scripts/testMycelium.sh
    test ":mbw:assembleBtctestnetRelease"
    ;;
  "com.greenaddress.greenbits_android_wallet")
    source scripts/testGreen.sh
    test
    ;;
  "de.schildbach.wallet")
    source scripts/testSchildbach.sh
    test
    ;;
  "it.airgap.vault")
    source scripts/testAirgapVault.sh
    test
    ;;
  "io.horizontalsystems.bankwallet")
    source scripts/testUnstoppable.sh
    test
    ;;
  "piuk.blockchain.android")
    source scripts/testBlockchain.sh
    test
    ;;
  "fr.acinq.phoenix.mainnet")
    source scripts/testPhoenix.sh
    test
    ;;
  "zapsolutions.zap")
    source scripts/testZap.sh
    test
    ;;
  *)
    echo "Unknown appId $appId"
    ;;
esac

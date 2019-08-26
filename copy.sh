#!/bin/bash
set -e

DIR="$2"
if ! [ -d $DIR/node_modules/react-native-mo-safearea ]; then
  echo "$DIR/node_modules/react-native-mo-safearea not there" 1>&2
  exit 1
fi

if [ "$1" == "from" ]; then
  cp -r $DIR/node_modules/react-native-mo-safearea/ios/ReactNativeMoSafeArea ./ios/
  cp -r $DIR/node_modules/react-native-mo-safearea/{readme.md,src} .
  cp -r $DIR/node_modules/react-native-mo-safearea/android/{src,build.gradle} ./android/
fi

if [ "$1" == "to" ]; then
  rsync -a --exclude node_modules --exclude example --exclude .git . $DIR/node_modules/react-native-mo-safearea/
fi

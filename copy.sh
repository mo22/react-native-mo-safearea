#!/bin/bash
set -e

DIR="$2"
if ! [ -d $DIR/node_modules/react-native-mo-safearea ]; then
  echo "$DIR/node_modules/react-native-mo-safearea not there" 1>&2
  exit 1
fi

if [ "$1" == "from" ]; then
  cp $DIR/node_modules/react-native-mo-safearea/ios/ReactNativeMoSafeArea/* ./ios/ReactNativeMoSafeArea/
  cp -r $DIR/node_modules/react-native-mo-safearea/src/* ./src/
  cp $DIR/node_modules/react-native-mo-safearea/android/build.gradle ./android/
  cp -a $DIR/node_modules/react-native-mo-safearea/android/src ./android/
fi

if [ "$1" == "to" ]; then
  rsync -a --exclude node_modules --exclude .git . $DIR/node_modules/react-native-mo-safearea/
fi

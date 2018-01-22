#!/bin/bash
git rev-list HEAD | sort > config.git-hash
LOCALVER=`wc -l config.git-hash | awk '{print $1}'`
if [ $LOCALVER \> 1 ] ; then
    VER=`git rev-list origin/master | sort | join config.git-hash - | wc -l | awk '{print $1}'`
    if [ $VER != $LOCALVER ] ; then
        VER="$VER+$(($LOCALVER-$VER))"
    fi
    VER="$(git rev-list HEAD -n 1 | cut -c 1-16)_$VER"
    GIT_VERSION="$VER"
else
    GIT_VERSION="0"
fi
rm -f config.git-hash

TIME=`git log -1 --pretty=fuller | grep CommitDate: | sed s/CommitDate:[[:space:]]*//g`
REVISED_BY=`git log -1 --pretty=fuller | grep Commit: | sed s/Commit:[[:space:]]*//g`

sed -i "s/VERSION: .*$/VERSION: \'$GIT_VERSION\',/g" src/version.js
sed -i "s/TIME: .*$/TIME: \'$TIME\',/g" src/version.js
sed -i "s/REVISED_BY: .*$/REVISED_BY: \'$REVISED_BY\',/g" src/version.js


#!/usr/bin/env bash

docPath='doc/_book/*'

rm -rf $docPath

node node_modules/gitbook-cli/bin/gitbook.js  build ./doc/

pubIp=`cat .devrc | grep bookip | grep -v '#' | awk -F '=' '{print $2}'`
pubPort=`cat .devrc | grep bookport | grep -v '#' | awk -F '=' '{print $2}'`
pubPassword=`cat .devrc | grep bookpassword | grep -v '#' | awk -F '=' '{print $2}'`
pubPath=`cat .devrc | grep bookpath | grep -v '#' | awk -F '=' '{print $2}'`

echo 'copy files to server'
from=$docPath
to='root@'$pubIp':'$pubPath
sshpass -p $pubPassword scp -r -P $pubPort $from $to
echo 'done'

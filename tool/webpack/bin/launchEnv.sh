#!/usr/bin/env bash

pubIp=`cat .devrc | grep '\<server_ip\>' | grep -v '#' | awk -F '=' '{print $2}'`
pubPort=`cat .devrc | grep '\<server_port\>' | grep -v '#' | awk -F '=' '{print $2}'`
pubPassword=`cat .devrc | grep '\<server_password\>' | grep -v '#' | awk -F '=' '{print $2}'`
pubPath=`cat .devrc | grep '\<server_path\>' | grep -v '#' | awk -F '=' '{print $2}'`

platforms=('t1' 'p2' 'a3' 'e4')
portsRaw=(3 8 1 2)
sedStr=''

for (( i=0; i<${#platforms[@]}; i++ )); do
  port=`cat .devrc | grep ${platforms[$i]}'_port' | grep -v '#' | awk -F '=' '{print $2}'`
  if [ "$port" == "" ]; then
    port=${portsRaw[$i]}
  fi
  upper="$(echo ${platforms[$i]} | tr '[:lower:]' '[:upper:]')"
  str='SERVER_'$upper'=http:\/\/127.0.0.1:'
  sedStr=$sedStr's/\<'$str'.*\>/'$str$port'/g; '
done

if [ "$sedStr" != "" ]; then
  envFile='/var/www/'$pubPath'/.env'
  sshpass -p $pubPassword ssh -o StrictHostKeyChecking=no -p $pubPort root@$pubIp "sed -i \"$sedStr\" $envFile"
fi

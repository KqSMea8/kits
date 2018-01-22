#!/usr/bin/env bash

port=`cat .devrc | grep doc_server_port | grep -v '#' | awk -F '=' '{print $2}'`
node node_modules/gitbook-cli/bin/gitbook.js  serve ./doc/ --port $port --watch


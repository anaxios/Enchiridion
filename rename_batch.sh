#!/bin/bash

INPUT_FOLDER="output/meadow"
OUTPUT_FOLDER="output/meadow_fixed"


i="1"
for file in "$INPUT_FOLDER"/*; do
    filename="${file##*/}"
    number="${filename%%[^0-9]*}"
    filename="${filename:3}"

    if [ -f "$file" ] && [ ! -e "$OUTPUT_FOLDER/$filename" ]; then
        filename="$(printf '%03d' $number) $filename"
        filename=$(printf "${filename}" | sed -E 's/[[:punct:]]//g')
        filename=$(printf "${filename}" | sed -E 's/  / /g')
        filename=$(printf "${filename}" | sed -E 's/ /_/g')
        filename=$(printf "${filename}" | sed -E 's/md$/\.md/g')

        cp "$file" "$OUTPUT_FOLDER/$(echo "$filename" | tr '[:upper:]' '[:lower:]')"
        i=$((1+$i))
        continue
    fi
    echo "Skipping $file"
done 
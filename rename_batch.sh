#!/bin/bash

INPUT_FOLDER="output/Prologue_of_Ochrid"
OUTPUT_FOLDER="output/prologue_name_change"


i="1"
for file in "$INPUT_FOLDER"/*; do
    filename="${file##*/}"
    filename="${filename:3}"

    if [ -f "$file" ] && [ ! -e "$OUTPUT_FOLDER/$filename" ]; then
        # let paddedI=$(printf "%03d" $i)
        cp "$file" "$OUTPUT_FOLDER/$(printf "%03d" $i)${filename}"
        i=$((1+$i))
        continue
    fi
    echo "Skipping $file"
done 
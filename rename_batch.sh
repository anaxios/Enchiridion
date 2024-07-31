#!/bin/bash

INPUT_FOLDER="output/Prologue_of_Ochrid"
OUTPUT_FOLDER="output/prologue_name_change"

spin() {
    while true; do
        spinner=( '-' '\' '|' '/' )
        for i in "${spinner[@]}"; do
            echo -ne "\r${i} $@"
            sleep .05
        done
    done
}

i="1"
for file in "$INPUT_FOLDER"/*; do
    filename="${file##*/}"
    filename="${filename:3}"

    # if [ -e "$OUTPUT_FOLDER/$filename" ] && [ ! -s "$OUTPUT_FOLDER/$filename" ]; then
    #     echo "Checking if empty: $filename"
    #     rm "$OUTPUT_FOLDER/$filename"
    # fi

    if [ -f "$file" ] && [ ! -e "$OUTPUT_FOLDER/$filename" ]; then
        # let paddedI=$(printf "%03d" $i)
        cp "$file" "$OUTPUT_FOLDER/$(printf "%03d" $i)${filename}"
        i=$((1+$i))
        continue
    fi
    echo "Skipping $file"
done 
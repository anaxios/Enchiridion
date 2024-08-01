#!/bin/bash

OUTPUT_FOLDER="output/Prologue_of_Ochrid"
INPUT_FOLDER='Prologue Of Ochrid'

spin() {
    echo "${@}"
    while true; do
        spinner=( '-' '\' '|' '/' )
        for i in "${spinner[@]}"; do
            echo -ne "\r${i}"
            sleep .05
        done
    done
    echo ""
}

for file in "$INPUT_FOLDER"/*; do
    filename="${file##*/}"

    if [ -e "$OUTPUT_FOLDER/$filename" ] && [ ! -s "$OUTPUT_FOLDER/$filename" ]; then
        echo "Checking if empty: $filename"
        rm "$OUTPUT_FOLDER/$filename"
    fi

    if [ -f "$file" ] && [ ! -e "$OUTPUT_FOLDER/$filename" ]; then
        # echo "Working on $filename"
        spin "Working on $INPUT_FOLDER/$filename" &
        PID="$!"
        cat "$file" | bun ai-format.js > "$OUTPUT_FOLDER"/"$filename"
        kill $PID
        continue
    fi
    echo "Skipping $file"
done 
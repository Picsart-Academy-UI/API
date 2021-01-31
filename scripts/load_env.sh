#!/bin/bash

SECRET_DIR="/run/secrets/" 
for FILE in $(ls $SECRET_DIR); do export "$FILE"=$(cat "$SECRET_DIR/$FILE"); done


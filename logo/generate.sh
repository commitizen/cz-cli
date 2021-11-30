#!/bin/bash
set -o nounset
set -o errexit

#####################################################
# Script to create PNG files from SVG source files. #
# Dependencies: cairosvg (https://cairosvg.org/)    #
#                                                   #
# Rationale: Generating from SVG instead of storing #
#   image files decreases size of repo and avoids   #
#   security vulnerabilites associated with binary  #
#   image files.                                    #
#####################################################

convert () {
  COLOR=$1
  # echo "converting file $COLOR..."
  FILE=logo/commitizen-logo-${COLOR}.svg
  if [ ! -f ${FILE} ]; then
    # echo "file $FILE missing!"
    exit 1
  fi
  # echo "conversion in progress..."
  for SIZE in 16 48 96 256 512 1024; do
    cairosvg ${FILE} -f png -W ${SIZE} -H ${SIZE} -d 300 -o logo/commitizen_logo_${COLOR}_${SIZE}x${SIZE}.png
  done
  # echo "done"
  return 0
}

if [[ $(which cairosvg) == "" ]]; then
  # We're not going to mess with installation on OSX or Windows in our build pipelines.
  if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "cairosvg not found in PATH.  Please see https://cairosvg.org/documentation/#installation"
    exit 0
  elif [[ "$OSTYPE" == "msys"* ]]; then
    echo "cairosvg not found in PATH.  Please see https://cairosvg.org/documentation/#installation"
    exit 0
  fi
  pip3 install cairosvg
fi

for COLOR in black blue white color; do
  FILE=logo/commitizen-logo-${COLOR}.svg
  if [ ! -f ${FILE} ]; then
    # echo "generating file $FILE..."
    sed 's|fill=\".*\"|fill=\"'${COLOR}'\"|g' <logo/commitizen-logo-mono.svg >${FILE}
    convert ${COLOR}
    # echo "removing generated file $FILE..."
    rm $FILE
    # echo "success!"
  else
    # echo "file found: $FILE"
    convert ${COLOR}
  fi
done

exit 0
#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

PYTHONENV=${DIR}/env

${PYTHONENV}/bin/python ${DIR}/maybe_download_mags.py
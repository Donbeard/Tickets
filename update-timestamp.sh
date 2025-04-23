#!/bin/bash

# Crear o actualizar el archivo build-info.json con la fecha y hora actual
echo "{
  \"timestamp\": \"$(date '+%Y-%m-%d %H:%M:%S')\",
  \"version\": \"1.0.0\"
}" > ./public/build-info.json

echo "Timestamp actualizado: $(date '+%Y-%m-%d %H:%M:%S')" 
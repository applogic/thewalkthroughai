#!/bin/bash
set -e
echo "Deploying thewalkthroughai.com/v2..."

cd /home/sites/thewalkthroughai.com/web2

git pull origin main

npm ci

npm run build

echo "Deployment complete!"

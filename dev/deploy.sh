#!/bin/bash
set -e

git switch dev
git add .
git commit -m "${1:-Update}"
git push

read -r -p "Ready to deploy to prod? (y/n): " confirm

if [[ "$confirm" != "y" ]]; then
    echo "Deployment cancelled."
    exit 0
fi

git switch main
git pull
git merge dev
git push

git switch dev

echo "Successfully deployed to production!"
#!/bin/bash

# run prisma migrations
echo "Running Prisma migrations..."
#npx prisma migrate dev --name init
npx prisma generate
#npx prisma db seed

# then run the app
echo "Starting the app..."
npm run start


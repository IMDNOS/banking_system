FROM node:24

WORKDIR /usr/src/app

COPY . .

RUN npm install

RUN echo 'DATABASE_URL="postgresql://myuser:mypassword@postgres_sql:5432/bank"' > .env && \
    echo 'TOKEN_SECRET="token_secret"' >> .env



#RUN npm run build

EXPOSE 3000

#RUN npx prisma generate

COPY docker-entrypoint.sh ./

RUN chmod +x docker-entrypoint.sh


# Use the entrypoint script
ENTRYPOINT ["./docker-entrypoint.sh"]




#CMD ["npm","run","start:prod"]
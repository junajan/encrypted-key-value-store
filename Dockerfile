FROM mhart/alpine-node:10

# Create app directory
WORKDIR /app

COPY . /app/

RUN npm install
RUN npm run build

ENV PORT=3000

EXPOSE 3000

CMD [ "npm", "start" ]


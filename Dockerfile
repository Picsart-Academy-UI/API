FROM node:14

WORKDIR /root/API

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001

ENTRYPOINT [ "./scripts/load_env.sh" ]

CMD ["npm", "start"]

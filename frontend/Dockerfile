FROM node:20

RUN npm install -g vite

WORKDIR /frontend

COPY package.json .

RUN npm install --production=false

COPY . .

EXPOSE 5173

CMD ["vite", "--host", "0.0.0.0"]
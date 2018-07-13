FROM node:8.11.3-alpine
RUN mkdir /proxy
COPY . /proxy
WORKDIR /proxy
RUN npm install

EXPOSE 3000
CMD ["npm", "start"]





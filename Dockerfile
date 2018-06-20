FROM node:9
RUN mkdir /proxy
ADD /proxy /proxy
WORKDIR /proxy
RUN npm install

EXPOSE 3003
CMD ["npm", "start"]
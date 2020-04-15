FROM node:alpine as build

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

# base image
FROM nginx:alpine

# copy artifact build from the 'build environment'
COPY --from=build /usr/src/app/dist/frontend-v2 /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# expose port 80
EXPOSE 80

# run nginx
CMD ["nginx", "-g", "daemon off;"]
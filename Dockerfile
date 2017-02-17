FROM node:6.9-onbuild

RUN npm install pm2 -g

ENV TRIFID_CONFIG config.travertin.json

ADD config.travertin.dev.json /usr/src/app/
ADD config.travertin.json /usr/src/app/
ADD data /usr/src/app/data

CMD ["pm2-docker", "pm2-config.yml"]
EXPOSE 8080

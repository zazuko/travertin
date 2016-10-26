FROM node:6.9.1-onbuild
RUN  npm run build
EXPOSE 8080

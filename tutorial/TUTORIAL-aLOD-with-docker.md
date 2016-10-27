# Zazuko aLOD tutorial

This tutorial describes how to deply an instance of aLOD using with 
[docker](https://www.docker.com/)

## Requirements

This tutorial requires that you have docker installed on your system. If you 
haven't, please follow the [installation instructions](https://docs.docker.com/engine/installation/)
for your platform.

## Docker image

Zazuko alod is available from the docker default repository (hub.docker.com) as
`zauko/alod` image.

Pull the latest version with

    docker pull zazuko/alod

You can start that image by running

    docker run -p 8080:8080 --rm zazuko/alod

This will start aLOD with the default configuration. While you can access
`http://localhost:8080/` to verify that things are working,

Of course, running aLOD with the default configuration is of little use, let's
create our own deployment with our own configuration.

## Creating a deployment

TBD
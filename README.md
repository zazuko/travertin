# Zazuko aLOD

Zazuko aLOD is a software to manage archival finding aids using Linked Data
technologies

## Requirements

You need to have [docker](https://docker.com/) installed.

## Running image from docker hub

    docker run --rm -p 80:80 zazuko/alod

Typically this docker image is used as base image, the inheriting docker image 
will overwrite the configuration, static files such as images and CSS files 
and customize the rendering by overwriting the RDF2h matchers.

## Building

    docker build -t alod .
    
## Running your build

    docker run --rm -p 80:80 alod
    
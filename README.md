# Zazuko aLOD

Zazuko aLOD is a software to manage archival finding aids using Linked Data
technologies

# Requirements

A SPARQL Enpoint with your Archival Documents. Currently the software points to the swiss archival instituts endpoint.

# Installation
## NPM
### Requirements
You need to have a recent version of Nodejs.

### Installation
1. Clone this repositiory.
2. Install the dependencies

    `npm install`

3. Adapt the configuration `config.js` to your needs.

4. Run the server

    `npm start`


## Docker
### Requirements

You need to have [docker](https://docker.com/) installed.

### Running image from docker hub

    docker run --rm -p 80:80 zazuko/alod

Typically this docker image is used as base image, the inheriting docker image 
will overwrite the configuration, static files such as images and CSS files 
and customize the rendering by overwriting the RDF2h matchers.

### Building

    docker build -t alod .
    
### Running your build

    docker run --rm -p 80:80 alod
    

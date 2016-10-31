# Zazuko aLOD

Zazuko aLOD is a software to manage archival finding aids using Linked Data
technologies. You can find an example installation with data from Swiss archives at [data.alod.ch](http://data.alod.ch/zack/).


# Requirements

A SPARQL endpoint with your archival documents. By default the software points to the Swiss archival institutions endpoint.

# Installation

This just covers getting the server up on your system. If you want to know more 
check out one of the tutorials:
- [Tutorial for deploying aLOD with the Node Package Manager (npm)](tutorial/TUTORIAL-aLOD-with-npm.md)
- [Tutorial for deploying aLOD with Docker](tutorial/TUTORIAL-aLOD-with-docker.md)

By default both tutorials access data of our example installation and SPARQL endpoint with data from Swiss archives at [data.alod.ch](http://data.alod.ch/zack/).

## NPM
### Requirements
You need to have a recent version of Nodejs.

### Installation
1. Clone this repository.
2. Install the dependencies

    `npm install`

3. Adapt the installation to your needs:

  Configure the installation through __`config.js`__

  * `handlerOptions.endpointUrl`:
     
     URL of the SPARQL endpoint containing the data.
  * `sparqlProxy.path`:
      
     The path where your SPARQL endpoint is exposed (defaults to `/sparql` for the search interface)
  * `sparqlProxy.handlerOptions.endpointUrl`:
     
     URL of the SPARQL endpoint which is exposed the data.    
  
  Static file hosting __`/data/public`__:
  
  The server searches first in the folder `/data/public` of the aLOD installation. If the requested file wasn't found it will search in the Trifid module folder `/node_modules/trifid-ld/`.
  To adapt the file content copy the version from the Trifid module to your aLOD installation.

4. Run the server

    `npm start`


## Docker
### Requirements

You need to have [docker](https://docker.com/) installed.

### Running image from docker hub

    docker run --rm -p 8080:8080 zazuko/alod

Typically this docker image is used as base image, the inheriting docker image 
will overwrite the configuration, static files such as images and CSS files 
and customize the rendering by overwriting the RDF2h matchers.

### Building

    docker build -t alod .
    
### Running your build

    docker run --rm -p 8080:8080 alod
    

# Zazuko aLOD

Zazuko aLOD is a software to manage archival finding aids using Linked Data
technologies

# Requirements

A SPARQL endpoint with your archival documents. By default the software points to the Swiss archival institutions endpoint.

# Installation
## NPM
### Requirements
You need to have a recent version of Nodejs.

### Installation
1. Clone this repository.
2. Install the dependencies

    `npm install`

3. Adapt the installation to your needs:

  Change the `endpointUrl` of `handlerOptions` and `sparqlProxy` in the `config.js` file to the URL of your SPARQL endpoint.    
  
  The folder `/data/public` is used for static file hosting.
  The server searches first in the folder of the aLOD installation.
  If the requested file wasn't found it will search in the Trifid module folder `/node_modules/trifid-ld/`.
  You can adapt the file content by copying it to your aLOD installation.
  There you can make your changes.
  Don't change the files in the Trifid module!

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
    

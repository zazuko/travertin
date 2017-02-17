# Zazuko Travertin

Zazuko Travertin is a software to manage archival finding aids using Linked Data
technologies. You can find an example installation with data from Swiss archives at [data.alod.ch](http://data.alod.ch/zack/).


# Requirements

A SPARQL endpoint with your archival documents. By default the software points to the Swiss archival institutions endpoint.

# Installation

This just covers getting the server up on your system. If you want to know more 
check out one of the tutorials:
- [Tutorial for deploying Travertin with the Node Package Manager (npm)](tutorial/TUTORIAL-Travertin-with-npm.md)
- [Tutorial for deploying Travertin with Docker](tutorial/TUTORIAL-Travertin-with-docker.md)

By default both tutorials access data of our example installation and SPARQL endpoint with data from Swiss archives at [data.alod.ch](http://data.alod.ch/zack/).

## NPM
### Requirements
You need to have a recent version of Nodejs.

### Installation
1. Clone this repository.

2. Install the dependencies

    `npm install`

3. Adapt the installation to your needs:

  Configure the installation through __`config.travertin.json`__

  * `sparqlEndpointUrl`:
     
     URL of the SPARQL endpoint containing the data.

4. Run the server

    `npm run start-local`

5. Test

    In case you did not adjust the SPARQL endpoint you can open an example resource like: http://localhost:8080/bar/id/archivalresource/29478797e7

## Docker
### Requirements

You need to have [docker](https://docker.com/) installed.

### Building

    docker build -t travertin .
    
### Running your build

    docker run --rm -i -p 8080:8080 travertin
    

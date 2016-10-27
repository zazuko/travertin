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
`http://localhost:8080/` to verify that things are working, running aLOD with 
the default configuration is of little use: let's
create our own deployment with our own configuration.

## Creating a deployment

The following assumes we have an instance of Fuseki serving our dataset providing
a SPARQL endpoint at `http://fusekihost:3030/alod/sparql`, see the 
[Fuseki Setup Tutorial](TUTORIAL-fuseki-setup.md) to learn how to setup a Fuseki 
endpoint.

A deployment is a docker image that inherits from `zazuko/alod` and adds its own
configuration and potentially customization.

To start let's a create an empty directory for the new project and create a
`Dockerfile` with the following content

```
FROM zazuko/alod
ADD config.js /usr/src/app/config.js
```

and a `config.js` file with the following to point to the Fuseki SPARQL Enpoint:

```
var baseConfig = require('trifid-ld/config.fuseki');
var defaultsDeep = require('lodash/defaultsDeep');

var config = {
  listener: {
    port: 8080
  },
  handlerOptions: {
    endpointUrl: 'http://fusekihost:3030/alod/sparql',
  },
  sparqlProxy: {
    path: '/sparql',
    options: {
      endpointUrl:'http://fusekihost:3030/alod/sparql',
    }
  }
}

module.exports = defaultsDeep(config, baseConfig)
```

Once we've created these two files we can build the image with

    docker build -t my-alod-deployment .

And run it with

    docker run --rm -p 80:80 my-alod-deployment

If you started Fuseki on your local machine and haven't configured fusekihost
to point to it, you may instead start it as follows for the name `fusekihost` 
to pint to the hostmachine:

    docker run --add-host=fusekihost:$( ifconfig docker0 | grep "inet addr" | sed -r "s/.*inet addr:([0-9.]*).*$/\1/") --rm -p 80:80 my-alod-deployment

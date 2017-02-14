# Zazuko Travertin tutorial

This tutorial describes how to install an instance of aLOD using the example dataset.
After reading this document you should be able to install your own instance with your own dataset.

## Prepare the dataset

Follow the steps describe in the [Fuseki Setup Tutorial](TUTORIAL-fuseki-setup.md)
to set up a SPARQL Endpoint serving an example dataset that we can use with aLOD.

## Adapt the Travertin installation

You should fork the aLOD project to store your changes in git, but for this tutorial we will skip that step.
Clone the aLOD project:

    git clone git@github.com:zazuko/travertin.git

Install the dependencies with npm:

    npm install 

Now change the `config.js` file.
Port 8080 is already the default port, but we need to change the SPARQL endpoint.
Change the `endpointUrl` property in `handlerOptions` and `sparqlProxy` to <http://localhost:3030/alod/sparql>.
Now you can start aLOD:

    npm start

That's it!
Open <http://localhost:8080/> in your browser and have fun with aLOD!

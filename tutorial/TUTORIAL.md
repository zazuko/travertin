# Zazuko aLOD tutorial

This tutorial describes how to install an instance of aLOD using the example dataset.
After reading this document you should be able to install your own instance with your own dataset.

## Prepare the dataset

We will use the dataset from <https://github.com/zazuko/alod-example>.
You can fetch a copy with git clone:

    git clone git@github.com:zazuko/alod-example.git
    cd alod-example

The data uses the namespace `http://data.ge.alod.ch`, but we want to host it on `http://localhost:8080`.
Let's use sed to replace it:

    sed 's/http:\/\/data.ge.alod.ch/http:\/\/localhost:8080/g' input/sample.nt > input/localhost.nt

## Put the dataset on the SPARQL server

We will use the [Fuseki](https://jena.apache.org/documentation/fuseki2/) SPARQL server.
Of course you can choose another SPARQL server if you want.
Go to <https://jena.apache.org/download/> download the latest version of the `Apache Jena Fuseki` archive and unzip it.
You can start the server in a terminal with the bundled script:

    ./fuseki

It will create a `run` folder that contains your configuration including the dataset which we will upload. Immediately stop the server again and copy the file `tutorial/fuseki-config/alod.ttl` to `run/databases/`. Restart the server again, it will now create the `alod` dataset.

By default the server runs on <http://localhost:3030/> Open that URL in your browser and go to `manage datasets`. Now you can upload the dataset.
Press `upload data`.
You can choose our `localhost.nt` using the `select files...` button.
And finally press `upload now` to import the dataset.

## Adapt the aLOD installation

You should fork the aLOD project to store your changes in git, but for this tutorial we will skip that step.
Clone the aLOD project:

    git clone git@github.com:zazuko/alod.git

Install the dependencies with npm:

    npm install 

Now change the `config.js` file.
Port 8080 is already the default port, but we need to change the SPARQL endpoint.
Change the `endpointUrl` property in `handlerOptions` and `sparqlProxy` to <http://localhost:3030/alod/sparql>.
Now you can start aLOD:

    npm start

That's it!
Open <http://localhost:8080/> in your browser and have fun with aLOD!

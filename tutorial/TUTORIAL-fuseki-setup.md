# Preparing Apache Fuseki for Zazuko aLOD tutorial

This tutorial describes how to install and configure an instance of Apache Fuseki
for use with Zazuko aLOD. We will setup Apache Fuseki and load an example dataset.

## Install and Configure Apache Fuseki

Go to <https://jena.apache.org/download/> download the latest version of the `Apache Jena Fuseki` archive and unzip it.
You can start the server in a terminal with the bundled script:

    ./fuseki start

It will create a `run` folder that contains your configuration including the 
dataset which we will upload. Immediately stop the server again (using `./fuseki stop` and copy the 
file 
`[tutorial/fuseki-config/alod.ttl](https://raw.githubusercontent.com/zazuko/alod/master/tutorial/fuseki-config/alod.ttl?token=AAGwpD1ON_oVumfnQ_utMvHPpMbZh2srks5YGkWwwA%3D%3D)`
 to `run/configuration/`. Restart the server again, it will now create the `alod` dataset.


## Prepare the example data

We will use the dataset from <https://github.com/zazuko/alod-example>.
You can fetch a copy with git clone:

    git clone git@github.com:zazuko/alod-example.git
    cd alod-example

The data uses the namespace `http://data.ge.alod.ch`, but we want to host it on `http://localhost:8080`.
Let's use sed to replace it:

    sed 's/http:\/\/data.ge.alod.ch/http:\/\/localhost:8080/g' input/sample.nq > input/localhost.nq

## Put the dataset on the SPARQL server

By default the server runs on <http://localhost:3030/> Open that URL in your 
browser and go to `manage datasets`. Now you can upload the dataset.
Press `upload data`.
You can choose our `localhost.nq` using the `select files...` button.
And finally press `upload now` to import the dataset.

That's it, we now have a running Fuseki instance with test data for Zazuko aLOD.
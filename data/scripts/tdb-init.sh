#!/bin/sh
export FUSEKI_HOME=/data/bin/jena-fuseki-1.1.1
tdbloader --graph=http://data.alod.ch/graph/bs --loc=/data/fusekidb/alod/DB ../graphs/bs_all.nt
tdbloader --graph=http://data.alod.ch/graph/ne --loc=/data/fusekidb/alod/DB ../graphs/ne_2014_12_21.ttl
tdbloader --graph=http://data.alod.ch/graph/ge --loc=/data/fusekidb/alod/DB ../graphs/ge_all.nt
tdbloader --graph=http://data.alod.ch/graph/bar --loc=/data/fusekidb/alod/DB ../graphs/bar_2015_01_06.ttl
tdbloader --graph=http://data.alod.ch/graph/generic --loc=/data/fusekidb/alod/DB ../graphs/tectonics.ttl
java -cp $FUSEKI_HOME/fuseki-server.jar jena.textindexer --desc=/data/etc/fuseki.ttl
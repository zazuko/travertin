#!/bin/sh
export FUSEKI_HOME=/data/bin/jena-fuseki-1.1.1
export DB_HOME=$DB_HOME/
export JENA_ROOT=/data/bin/apache-jena-2.12.1
$JENA_ROOT/bin/tdbloader --graph=http://data.alod.ch/graph/bs --loc=$DB_HOME/DB ../graphs/bs_all.nt
$JENA_ROOT/bin/tdbloader --graph=http://data.alod.ch/graph/ne --loc=$DB_HOME/DB ../graphs/ne_2014_12_21.ttl
$JENA_ROOT/bin/tdbloader --graph=http://data.alod.ch/graph/ge --loc=$DB_HOME/DB ../graphs/ge_all.nt
$JENA_ROOT/bin/tdbloader --graph=http://data.alod.ch/graph/bar --loc=$DB_HOME/DB ../graphs/bar_2015_01_06.ttl
$JENA_ROOT/bin/tdbloader --graph=http://data.alod.ch/graph/generic --loc=$DB_HOME/DB ../graphs/tectonics.ttl
java -cp $FUSEKI_HOME/fuseki-server.jar jena.textindexer --desc=/data/etc/fuseki.ttl

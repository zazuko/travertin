#!/bin/sh
if [ -z $FUSEKI_HOME ]; then export FUSEKI_HOME=/data/bin/jena-fuseki-1.1.1; fi
if [ -z $DB_HOME ]; then export DB_HOME=/data/fusekidb/alod; fi
if [ -z $JENA_ROOT ]; then export JENA_ROOT=/data/bin/apache-jena-2.12.1; fi
$JENA_ROOT/bin/tdbloader --graph=http://data.alod.ch/graph/bs --loc=$DB_HOME/DB ../graphs/bs_all.nt
sleep 2
$JENA_ROOT/bin/tdbloader --graph=http://data.alod.ch/graph/ne --loc=$DB_HOME/DB ../graphs/ne_2015_02_08.ttl
sleep 2
$JENA_ROOT/bin/tdbloader --graph=http://data.alod.ch/graph/ge --loc=$DB_HOME/DB ../graphs/ge_all.nt
sleep 2
$JENA_ROOT/bin/tdbloader --graph=http://data.alod.ch/graph/bar --loc=$DB_HOME/DB ../graphs/bar_2015_02_08.ttl
sleep 2
$JENA_ROOT/bin/tdbloader --graph=http://data.alod.ch/graph/generic --loc=$DB_HOME/DB ../graphs/tectonics.ttl
sleep 2
$JENA_ROOT/bin/tdbloader --graph=http://data.alod.ch/graph/vs --loc=$DB_HOME/DB ../graphs/vs.ttl
sleep 2
java -cp $FUSEKI_HOME/fuseki-server.jar jena.textindexer --desc=/data/etc/fuseki.ttl

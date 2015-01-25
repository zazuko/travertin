#!/bin/sh
cat ../graphs/ge_2014_12_21_*  | rapper -i turtle -o ntriples - http://example.org/ > ../graphs/ge_all.nt
cat ../graphs/bs_2015_01_06_*  | rapper -i turtle -o ntriples - http://example.org/ > ../graphs/bs_all.nt

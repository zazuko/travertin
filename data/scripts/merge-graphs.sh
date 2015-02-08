#!/bin/sh
cat ../graphs/ge_2015_02_08_*  | rapper -i turtle -o ntriples - http://example.org/ > ../graphs/ge_all.nt
cat ../graphs/bs_2015_02_08_*  | rapper -i turtle -o ntriples - http://example.org/ > ../graphs/bs_all.nt

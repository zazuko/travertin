FROM zazukoians/trifid-ld:0.8.0
RUN cd /tmp && \
    npm install -g git://github.com/zazuko/zack-search.git && \
    mkdir -p /usr/src/app/data/public/zack && \
    cp -r /usr/local/lib/node_modules/zack-search/dist/* /usr/src/app/data/public/zack && \
    rm -r /usr/local/lib/node_modules/zack-search 
ADD config.js /usr/src/app/config.js
ADD data /usr/src/app/data

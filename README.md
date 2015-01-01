# A-LOD Linked Data Proxy

## Folder Structure

### data/graphs

This folder contains the named graphs per canton.

### data/public

Static files (JavaScript, CSS, images) for HTML rendering. `js/render-ld.js` contains the JSON-LD graph render code.


### data/scripts

Scripts for external applications (Fuseki), dynamic graph creation, etc.

### data/templates

HTML templates per canton.

## Configuration

`config.js` contains two configurations. The default configuration uses the SPARQL endpoint. The second configuration
uses the LDP module with an in memory store which might be useful during development. The in memory store does the graph
splitting in the init process, which takes some time. All configurations require a proxy which sets the
`X-Forwarded-Host` and `X-Forwarded-Port` header fields.
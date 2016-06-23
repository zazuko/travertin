require('shelljs/global')

mkdir('-p','dist')

exec('browserify -d lib/search-result-list.js -o dist/search-result-list.js')
cp('node_modules/clusterize.js/clusterize.css', 'dist/')
cp('-r', 'public/*', 'dist/')

cp('-r', 'dist/*', '../../data/public')

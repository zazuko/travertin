require('shelljs/global')

mkdir('-p','dist')

exec('browserify -d lib/zack.js -o dist/zack.js')
//cp('node_modules/clusterize.js/clusterize.css', 'dist/')
cp('-r', 'public/*', 'dist/')

mkdir('-p','../../data/public/zack')
cp('-r', 'dist/*', '../../data/public/zack')

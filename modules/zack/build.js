require('shelljs/global')

mkdir('-p', '.build')

exec('js-string-escape --commonjs queries/zack.count.sparql .build/zack-count-sparql.js')
exec('js-string-escape --commonjs queries/zack.sparql .build/zack-sparql.js')
exec('js-string-escape --commonjs queries/zack.histogram.sparql .build/zack-histogram-sparql.js')

mkdir('-p','dist')

exec('browserify -d lib/app.js -o dist/zack.js')
//exec('browserify -d lib/app.js -p [minifyify --map zack.js.map --output dist/zack.js.map] > dist/zack.js')
cp('-r', 'public/*', 'dist/')

mkdir('-p','../../data/public/zack')
cp('-r', 'dist/*', '../../data/public/zack')

require('shelljs/global')

mkdir('-p','dist')

exec('browserify -d lib/app.js -o dist/zack.js')
cp('-r', 'public/*', 'dist/')

mkdir('-p','../../data/public/zack')
cp('-r', 'dist/*', '../../data/public/zack')

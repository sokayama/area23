/* webpackのすべてを司る人 */

let path = require("path");

module.exports = {
    entry : {
        "main" : path.join(__dirname, "src/main.js"),
    },
    output : { // entryのプロパティの数だけバンドルを吐く
        filename : "[name].bundle.js", // [name]はentryのプロパティ名。ディレクトリ構造も書けちゃう
        path : path.join(__dirname, "public")
    },
    module : { // loaderを使って、jsじゃないファイルも無理やりjsにバンドルしてしまう
        rules : [
            {test : /\.css$/, use: [ 'style-loader', 'css-loader' ] }, // cssをjsにload
            {test: /\.(glsl|frag|vert)$/, use: [ 'raw-loader'] }
        ]
    }
}
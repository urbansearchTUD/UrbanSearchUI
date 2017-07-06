const BabiliPlugin = require("babili-webpack-plugin");

module.exports = {
  entry: {
        'classifier': './src/classifier/classifier.js',
        'classify': './src/classify/classify.js',
        'index': './src/index/index.js',
        'settings': './src/settings/settings.js'
    },
    output: {
        filename: './dist/js/[name].bundle.js'
    },
    // plugins: [
    //     new BabiliPlugin()
    // ]
}

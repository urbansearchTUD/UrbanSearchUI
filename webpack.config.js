module.exports = {
  entry: {
        'classify': './src/classify/classify.js',
        'index': './src/index/index.js',
        'settings': './src/settings/settings.js',
    },
    output: {
        filename: './dist/js/[name].bundle.js'
    }
}

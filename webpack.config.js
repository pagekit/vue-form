/* eslint-env node */

module.exports = (env, argv) => ({

    entry: {
        'examples/form': './examples/form',
    },

    output: {
        filename: './[name].min.js'
    },

    externals: {
        vue: 'Vue'
    },

    resolve: {
        alias: {
            'vue-form': __dirname + '/src'
        }
    },

    module: {

        rules: [
            {
                test: /\.vue$/,
                use: 'vue-loader'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'buble-loader'
            },
            {
                test: /\.html$/,
                use: 'html-loader'
            }
        ]
    }

});

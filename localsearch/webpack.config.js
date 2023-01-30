module.exports = {
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
          },
        },
        {
          test: /\.md$/,
          use: { loader: "raw-loader" },
        },
        
        {
          test: /\.css$/,
          use: [
            // style-loader
            { loader: "style-loader" },
            // css-loader
            {
              loader: "css-loader",
              options: {
                modules: true,
              },
            },
            // sass-loader
            { loader: "sass-loader" },
          ],
          // test: /\.css$/, loader: "style-loader!css-loader" ,
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            // Creates `style` nodes from JS strings
            "style-loader",
            // Translates CSS into CommonJS
            "css-loader",
            // Compiles Sass to CSS
            "sass-loader",
          ],
        },
        {
          test: /\.(png|jpg|gif|JPG)$/i,
          use: [
            {
              loader: "url-loader",
              options: {
                limit: 9000000,
              },
            },
          ],
        },
        {
          test: /\.txt$/i,
          use: [
            {
              loader: 'raw-loader',
              options: {
                esModule: false,
              },
            },
          ],
        },
        {
          test: /\.(svg|pdf)$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[name].[ext]",
              },
            },
          ],
        },
      ],
    },
  };
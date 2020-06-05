(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('laravel-mix')) :
  typeof define === 'function' && define.amd ? define(['laravel-mix'], factory) :
  (global = global || self, factory(global.mix));
}(this, (function (mix) {
  mix = mix && Object.prototype.hasOwnProperty.call(mix, 'default') ? mix['default'] : mix;

  const MiniCssExtractPlugin = require('mini-css-extract-plugin');

  class ReactCSSModules {
    constructor() {
      this.scopedName = this.defaultScopedName();
    }

    name() {
      return "reactCSSModules";
    }

    defaultScopedName() {
      return "[name]__[local]___[hash:base64:5]";
    }

    dependencies() {
      return ["babel-plugin-react-css-modules", "postcss-scss", "postcss-nested", "mini-css-extract-plugin"];
    }

    register(scopedName) {
      if (scopedName) {
        this.scopedName = scopedName;
      }
    }

    webpackConfig(config) {
      config.module.rules = config.module.rules.map(rule => {
        if (!rule.loaders) {
          return rule;
        }

        rule.loaders = rule.loaders.map(loader => {
          if (loader.loader === "css-loader" || loader === "css-loader") {
            let options = {
              modules: {
                mode: "local",
                localIdentName: this.scopedName
              }
            };
            loader = typeof loader === "string" ? {
              loader
            } : loader;
            loader.options = loader.options ? Object.assign({}, loader.options, options) : options;
          }

          return loader;
        });
        return rule;
      });
      return config;
    }

    babelConfig() {
      return {
        plugins: [[new MiniCssExtractPlugin({
          filename: devMode ? '[name].css' : '[name].[hash].css',
          chunkFilename: devMode ? '[id].css' : '[id].[hash].css'
        })], ["react-css-modules", {
          filetypes: {
            ".scss": {
              syntax: "postcss-scss",
              plugins: ["postcss-nested"]
            }
          },
          exclude: "node_modules",
          handleMissingStyleName: "warn",
          generateScopedName: this.scopedName
        }]]
      };
    }

  }

  mix.extend("reactCSSModules", new ReactCSSModules());

})));

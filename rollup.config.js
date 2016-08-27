import rollup from "rollup";
import babel from "rollup-plugin-babel";
import uglify from 'rollup-plugin-uglify';

module.exports = {
  entry: "src/main.js",
  plugins: [
    babel({
        exclude: 'node_modules/**',
        presets: 'es2015-rollup'
    }),
    uglify()
  ]
};

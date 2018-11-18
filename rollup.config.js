import resolve from "rollup-plugin-node-resolve"
import babel from "rollup-plugin-babel"

export default {
  input: "src/main.js",
  output: {
    file: "build/d3Table.js",
    format: "umd",
    name: "d3Table"
  },
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**'
    })
  ]
}

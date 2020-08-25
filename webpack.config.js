const HTMLWebpackPlugin = require('html-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');

module.exports = {
	mode: 'development',
	devtool: 'inline-source-map',

	devServer: {
		hot: true,
	},

	resolve: {
		extensions: ['.ts', '.tsx', '.js', 'jsx'],
		mainFields: ['esnext', 'browser', 'module', 'main'],
		alias: {
			'react-dom': '@hot-loader/react-dom',
		},
	},

	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: ['react-hot-loader/webpack', 'ts-loader'],
				exclude: /node_modules/,
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.scss$/,
				use: ['style-loader', 'css-loader', 'sass-loader'],
			},
		],
	},

	plugins: [
		new HTMLWebpackPlugin({ template: 'src/index.html' }),
		new CircularDependencyPlugin({
			exclude: /node_modules/,
		}),
	],
};

const HTMLWebpackPlugin = require('html-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');

module.exports = {
	mode: 'development',
	devtool: 'inline-source-map',

	resolve: {
		extensions: ['.ts', '.tsx', '.js', 'jsx'],
		mainFields: ['esnext', 'browser', 'module', 'main'],
	},

	module: {
		rules: [
			{
				test: /\.tsx?$/,
				// use: ['awesome-typescript-loader'],
				use: ['ts-loader'],
				exclude: /node_modules/,
			},
			{
				test: /\.css$/,
				loaders: ['style-loader', 'css-loader'],
			},
			{
				test: /\.scss$/,
				loaders: ['style-loader', 'css-loader', 'sass-loader'],
			},
		],
	},

	plugins: [
		new HTMLWebpackPlugin({ template: 'src/index.html' }),
		new WebpackNotifierPlugin({ skipFirstNotification: true }),
	],
};

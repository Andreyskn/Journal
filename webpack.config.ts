import HTMLWebpackPlugin from 'html-webpack-plugin';
import CircularDependencyPlugin from 'circular-dependency-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

import { Configuration, ConfigurationFactory } from 'webpack';

type Mode = 'development' | 'production';

const configure: ConfigurationFactory = (env) => {
	const mode = env as Mode;
	const isDev = mode === 'development';
	const finalCssLoader = isDev ? 'style-loader' : MiniCssExtractPlugin.loader;

	const config: Configuration = {
		mode,
		devtool: isDev ? 'inline-source-map' : 'eval',

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
					use: [finalCssLoader, 'css-loader'],
				},
				{
					test: /\.scss$/,
					use: [finalCssLoader, 'css-loader', 'sass-loader'],
				},
			],
		},

		plugins: [
			new HTMLWebpackPlugin({
				template: 'src/index.html',
				favicon: 'favicon.png',
			}),
			new CircularDependencyPlugin({
				exclude: /node_modules/,
			}),
		],
	};

	if (!isDev) {
		config.plugins!.push(
			new CleanWebpackPlugin(),
			new MiniCssExtractPlugin(),
			new OptimizeCssAssetsPlugin()
		);
	}

	return config;
};

export default configure;
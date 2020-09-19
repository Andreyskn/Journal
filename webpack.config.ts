import { Configuration, ConfigurationFactory } from 'webpack';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import CircularDependencyPlugin from 'circular-dependency-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const configure: ConfigurationFactory = (env) => {
	const mode = env as Configuration['mode'];
	const isDev = mode === 'development';
	const finalCssLoader = isDev ? 'style-loader' : MiniCssExtractPlugin.loader;

	const config: Configuration = {
		mode,
		devtool: isDev ? 'inline-source-map' : false,

		devServer: {
			hot: true,
		},

		resolve: {
			extensions: ['.ts', '.tsx', '.js', 'jsx'],
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
			// new BundleAnalyzerPlugin(),
			new CleanWebpackPlugin(),
			new OptimizeCssAssetsPlugin(),
			new MiniCssExtractPlugin()
		);
	}

	return config;
};

export default configure;

import express from 'express';
import webpack from 'webpack';
import bundler from '../@bin';
import pipeline from '../@bin/pipeline';

const webpackConfig = bundler({});
const multiCompiler = webpack(webpackConfig);
const app = express();

app.use(pipeline(multiCompiler, {}));

export default app;

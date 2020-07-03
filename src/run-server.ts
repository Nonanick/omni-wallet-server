import express from 'express';
import { ExpressAdapter } from './http/ExpressAdapter.js';

const expressApp = express();
const adaptadorExpress = new ExpressAdapter(expressApp);

adaptadorExpress.boot().then((_) => {
  adaptadorExpress.start();
});

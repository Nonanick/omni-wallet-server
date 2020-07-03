import express from 'express';
import { ExpressAdapter } from './http/express/ExpressAdapter.js';

const expressApp = express();
const adaptadorExpress = new ExpressAdapter(expressApp);

adaptadorExpress.boot()
  .then(() => {
    adaptadorExpress.start();
  });

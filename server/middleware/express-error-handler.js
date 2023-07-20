import logger from '../../logger.js';
import { pgPromise } from '../db/index.js';

export default function expressErrorHandler(err, req, res, next) {
  logger.error(err.toString());

  if (err instanceof pgPromise.errors.QueryResultError) {
    res.status(404).json({ error: err.message, treeexists: false });
    return;
  }

  res.status(err.statusCode || 500).json({ error: err.message });
  next();
}

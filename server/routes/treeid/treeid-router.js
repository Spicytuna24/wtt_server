import express from 'express';
import AppError from '../../errors/AppError.js';

import validateGetTreeId from './treeid-validations.js';
import { createIdForTree } from '@waterthetrees/tree-id';

const treeidRouter = express.Router();

treeidRouter.get('/', async (req, res) => {
  if (!validateGetTreeId(req)) {
    throw new AppError(400, 'TreeId missing required parameter');
  }

  const id = createIdForTree(req.body);
  res.status(200).json(id);
});

export default treeidRouter;

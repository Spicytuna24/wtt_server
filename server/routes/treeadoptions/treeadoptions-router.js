import express from 'express';
import AppError from '../../errors/AppError.js';
import {
  findTreeAdoptionsByTreeId,
  adoptTree,
  unadoptTree,
} from './treeadoptions-queries.js';
import validatePostTreeAdoptions from './treeadoptions-validations.js';

const treeadoptionsRouter = express.Router();

treeadoptionsRouter.get('/', async (req, res) => {
  const { id, email } = req.query;

  if (!id || !email) {
    throw new AppError(
      400,
      `treeadoptionsRouter.get Missing required parameter(s) id: ${id} or email: ${email}.`,
    );
  }

  const treeAdoptions = await findTreeAdoptionsByTreeId(id);

  const data = {
    adopted: treeAdoptions.some((treeAdoption) => treeAdoption.email === email),
    adoptedCount: treeAdoptions.length,
  };

  res.status(200).json(data);
});

/**
 * TODO: make POST and DELETE separate requests
 */
treeadoptionsRouter.post('/', async (req, res) => {
  const isValidated = validatePostTreeAdoptions(req);

  if (!isValidated) {
    throw new AppError(
      400,
      `TreeAdoption post Missing required parameter(s) ${req.body}.`,
    );
  }
  const { request, ...body } = req.body;
  if (request.type === 'DELETE') {
    const { rowCount } = await unadoptTree(body);

    if (rowCount !== 1) {
      throw new AppError(404, 'Failed to unadopt tree.');
    }

    res.status(200).json({ success: true });
  } else {
    const data = await adoptTree(body);

    res.status(200).json(data);
  }
});

export default treeadoptionsRouter;

import express from 'express';
import AppError from '../../errors/AppError.js';
import {
  findTreeLikesByTreeId,
  likeTree,
  unlikeTree,
} from './treelikes-queries.js';
import validatePostTreeLikes from './treelikes-validations.js';

const treelikesRouter = express.Router();

treelikesRouter.get('/', async (req, res) => {
  const { id, email } = req.query;

  if (!id || !email) {
    throw new AppError(
      400,
      `TreeLikes get Missing required parameter(s) id: ${id} or email: ${email}.`,
    );
  }

  const treeLikes = await findTreeLikesByTreeId(id);

  const data = {
    liked: treeLikes.some((treeLike) => treeLike.email === email),
    likedCount: treeLikes.length,
  };

  res.status(200).json(data);
});

/**
 * TODO: make POST and DELETE separate requests
 */
treelikesRouter.post('/', async (req, res) => {
  const isValidated = validatePostTreeLikes(req);

  if (!isValidated) {
    throw new AppError(
      400,
      `TreeLikes post Missing required parameter(s) ${req.body}.`,
    );
  }

  const { request, ...body } = req.body;

  if (request.type === 'DELETE') {
    const { rowCount } = await unlikeTree(body);

    if (rowCount !== 1) {
      throw new AppError(404, 'Failed to unlike tree.');
    }

    res.status(200).json({ success: true });
  } else {
    const data = await likeTree(body);

    res.status(200).json(data);
  }
});

export default treelikesRouter;

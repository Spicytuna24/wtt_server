import express from 'express';
import AppError from '../../errors/AppError.js';
import {
  findUserAdoptedTrees,
  findUserLikedTrees,
  findUserPlantedTrees,
} from './usercounts-queries.js';

const usercountsRouter = express.Router();

usercountsRouter.get('/', async (req, res) => {
  const { email, request } = req.query;

  if (!email || !request) {
    throw new AppError(400, 'Missing required parameter(s): email or request.');
  }

  let userCounts = null;

  switch (request) {
    case 'adopted':
      userCounts = await findUserAdoptedTrees(email);
      break;
    case 'liked':
      userCounts = await findUserLikedTrees(email);
      break;
    case 'planted':
      userCounts = await findUserPlantedTrees(email);
      break;
    default:
      break;
  }

  res.status(200).json(userCounts);
});

export default usercountsRouter;

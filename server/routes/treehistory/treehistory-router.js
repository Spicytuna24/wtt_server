import express from 'express';
import AppError from '../../errors/AppError.js';

import {
  createTreeHistory,
  findTodaysTreeHistoryByTreeIdAndVolunteerName,
  findTreeHistoryByTreeId,
  updateTreeHistory,
} from './treehistory-queries.js';

const treehistoryRouter = express.Router();

treehistoryRouter.get('/', async (req, res) => {
  const { id } = req.query;

  if (!id) {
    throw new AppError(
      400,
      'treehistoryRouter missing required parameter: id.',
    );
  }

  const foundTreeHistory = await findTreeHistoryByTreeId(id);
  if (!foundTreeHistory) {
    throw new AppError(404, 'treehistoryRouter tree history not found.');
  }
  res.status(200).json(foundTreeHistory);
});

treehistoryRouter.post('/', async (req, res) => {
  const { id, volunteer } = req.body;

  if (!id || !volunteer) {
    throw new AppError(
      400,
      'treehistoryRouter Missing required parameter(s): id or volunteer.',
    );
  }

  const todaysTreeHistory = await findTodaysTreeHistoryByTreeIdAndVolunteerName(
    id,
    volunteer,
  );

  if (!todaysTreeHistory) {
    const newTreeHistory = await createTreeHistory(req.body);

    if (!newTreeHistory) {
      throw new AppError(400, 'Failed to create new tree history.');
    }

    res.status(201).json({ newTreeHistory });
  } else {
    const updatedTreeHistory = await updateTreeHistory(req.body);

    if (!updatedTreeHistory) {
      throw new AppError(400, 'Failed to update tree history.');
    }

    res.status(200).json(updatedTreeHistory);
  }
});

export default treehistoryRouter;

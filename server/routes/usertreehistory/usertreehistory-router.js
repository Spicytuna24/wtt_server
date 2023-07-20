/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
import express from 'express';
import AppError from '../../errors/AppError.js';
import findUserTreeHistoryByVolunteerName from './usertreehistory-queries.js';

const usertreehistoryRouter = express.Router();

usertreehistoryRouter.get('/', async (req, res) => {
  const { volunteer } = req.query;

  if (!volunteer) {
    throw new AppError(400, 'Missing required parameter: volunteer.');
  }

  const userTreeHistory = await findUserTreeHistoryByVolunteerName(volunteer);

  const formattedUserTreeHistory = userTreeHistory.map((history) => {
    for (const key in history) {
      if (!['dateVisit', 'common', 'scientific'].includes(key)) {
        if (history[key] === null) {
          history[key] = false;
        } else {
          history[key] = true;
        }
      }
    }

    return history;
  });

  res.status(200).json(formattedUserTreeHistory);
});

export default usertreehistoryRouter;

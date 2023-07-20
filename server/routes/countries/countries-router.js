import express from 'express';
import getCountries from './countries-queries.js';

const countriesRouter = express.Router();

countriesRouter.get('/', async (req, res) => {
  const rows = await getCountries();

  if (!rows?.length) {
    return res.status(404).json({ error: 'Failed to get countries.' });
  }

  // otherwise return data
  return res.status(200).json(rows);
});

export default countriesRouter;

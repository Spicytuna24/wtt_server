import express from 'express';
import AppError from '../../errors/AppError.js';
import { findAllCities, findCityByName } from './cities-queries.js';

const citiesRouter = express.Router();

citiesRouter.get('/', async (req, res) => {
  const { city } = req.query;

  let cities = city ? await findCityByName(city) : await findAllCities();

  if (!cities) {
    throw new AppError(404, 'Failed to find any cities.');
  }

  res.status(200).json(cities);
});

export default citiesRouter;

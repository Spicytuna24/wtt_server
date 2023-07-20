import express from 'express';
import AppError from '../../errors/AppError.js';
import findGeoJSONByCityName from './treemap-queries.js';

const treemapRouter = express.Router();

export default treemapRouter.get('/', async (req, res) => {
  const { city } = req.query;

  if (!city) {
    throw new AppError(400, 'Missing required parameter: city.');
  }

  const geoJSON = await findGeoJSONByCityName(city);
  res.status(200).json(geoJSON);
});

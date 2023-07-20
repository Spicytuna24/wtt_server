import fastcsv from 'fast-csv';
import fs from 'fs';
import express from 'express';
import AppError from '../../errors/AppError.js';
import { getAllTreeDataByCity, getAllTreeDataCities } from './csv-queries.js';

const csvRouter = express.Router();

csvRouter.get('/', async (req, res) => {
  const { city } = req.query;
  const data = city
    ? await getAllTreeDataByCity(city)
    : await getAllTreeDataCities();

  if (!data || data === undefined || data.length === 0) {
    throw new AppError(404, 'Failed to find any data.');
  }

  const jsonData = JSON.parse(JSON.stringify(data));
  const cityName = city
    ? city.toLowerCase().replaceAll(' ', '-')
    : 'all-cities';
  const csvPath = `server/csv-downloads/${cityName}.csv`;
  const ws = fs.createWriteStream(csvPath);

  fastcsv
    .write(jsonData, { headers: true })
    .on('finish', () => {
      res.statusCode = 200;
      res.download(csvPath);
    })
    .pipe(ws);
});

export default csvRouter;

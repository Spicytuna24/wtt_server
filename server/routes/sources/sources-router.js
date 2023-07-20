import express from 'express';
import AppError from '../../errors/AppError.js';
import {
  getSourceByIdSourceName,
  getCrosswalkByIdSourceName,
  updateSourceByIdSourceName,
  createSource,
  createCrosswalk,
  getAllSources,
  updateCrosswalkByIdSourceName,
} from './sources-queries.js';
import validateSource from './sources-validations.js';

const sourcesRouter = express.Router();

sourcesRouter.get('/', async (req, res) => {
  const { idSourceName, sources } = req.query;

  if (!idSourceName && sources === 'All') {
    let foundSources = await getAllSources();
    if (!foundSources || foundSources.length === 0)
      throw new AppError(400, 'Error getting source');
    res.status(200).json(foundSources);
  }

  if (idSourceName) {
    const responseSource = await getSourceByIdSourceName(idSourceName);
    const responseCrosswalk = await getCrosswalkByIdSourceName(idSourceName);
    if (!responseSource) throw new AppError(400, 'Error getting source');
    res
      .status(200)
      .json({ source: responseSource, crosswalk: responseCrosswalk });
  }
});

sourcesRouter.post('/', async (req, res) => {
  // eslint-disable-next-line no-unused-vars
  const validated = await validateSource(req);
  if (!validated) throw new AppError(400, 'Error validating source');

  const { crosswalk = null, source = null } = req.body;
  let responseSource, responseCrosswalk;
  if (source) {
    responseSource = await createSource(source);
    if (!responseSource) throw new AppError(400, 'Error creating source');
  }

  if (crosswalk) {
    responseCrosswalk = await createCrosswalk(crosswalk);
    if (!responseCrosswalk) throw new AppError(400, 'Error creating Crosswalk');
  }
  const response = { source: responseSource, crosswalk: responseCrosswalk };
  res.status(200).json(response);
});

sourcesRouter.put('/', async (req, res) => {
  // eslint-disable-next-line no-unused-vars
  const validated = await validateSource(req);
  if (!validated) throw new AppError(400, 'Error validating source');

  const { crosswalk = null, source = null } = req.body;
  let responseSource, responseCrosswalk;
  if (source) {
    responseSource = await updateSourceByIdSourceName(source);
    if (!responseSource) throw new AppError(400, 'Error creating source');
  }

  if (crosswalk) {
    responseCrosswalk = await updateCrosswalkByIdSourceName(crosswalk);
    if (!responseCrosswalk) throw new AppError(400, 'Error creating Crosswalk');
  }
  const response = { source: responseSource, crosswalk: responseCrosswalk };
  res.status(200).json(response);
});

export default sourcesRouter;

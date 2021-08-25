const treelikesRouter = require('express').Router();
const AppError = require('../../errors/AppError');
const sharedRoutesUtils = require('../sharedRoutesUtils');
const treelikesQueries = require('./treelikesQueries');

treelikesRouter.get('/', async (req, res) => {
  const { idTree, email } = req.query;

  if (!idTree || !email) {
    throw new AppError(400, 'Missing required parameter(s): idTree or email.');
  }

  const rows = await treelikesQueries.findTreeLikesById(idTree);

  const data = {
    liked: rows.some((row) => row.email === email),
    likedCount: rows.length,
  };

  res.status(200).json(data);
});

treelikesRouter.post('/', async (req, res) => {
  const { request, ...body } = req.body;

  if (request.type === 'DELETE') {
    const { rowCount } = await treelikesQueries.deleteTreeLikesModel(body);

    if (rowCount !== 1) {
      throw new AppError(404, 'Failed to find tree.');
    }

    res.status(200).json({ success: true });
  } else {
    const formattedBody = sharedRoutesUtils.convertObjectToSnakeCase(body);
    const data = await treelikesQueries.insertTreeLikesModel(formattedBody);

    res.status(200).json(data);
  }
});

module.exports = treelikesRouter;

import express from 'express';
import AppError from '../../errors/AppError.js';
import { createUser, findUserByEmail } from './users-queries.js';
import validatePostUser from './users-validations.js';

const userRouter = express.Router();

userRouter.get('/', async (req, res) => {
  const { email } = req.query;

  if (!email) {
    throw new AppError(400, 'Missing required parameter: email.');
  }

  const user = await findUserByEmail(email);

  if (user) {
    res.status(200).json(user);
  } else {
    throw new AppError(404, 'Failed to find user.');
  }
});

userRouter.post('/', async (req, res) => {
  const validated = validatePostUser(req);

  if (!validated) {
    throw new AppError(400, 'Missing required parameter(s).');
  }

  const user = await findUserByEmail(req.body.email);

  if (user) {
    res.status(200).json(user);
  } else {
    const newUser = await createUser(req.body);

    res.status(201).json(newUser);
  }
});

export default userRouter;

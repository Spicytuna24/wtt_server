import { db, pgPromise } from '../../db/index.js';

const usersTable = new pgPromise.helpers.ColumnSet(
  ['nickname', 'name', 'picture', 'email'],
  { table: 'users' },
);

export async function createUser(newUserData) {
  const query = pgPromise.helpers.insert(newUserData, usersTable);
  const returningClause = 'RETURNING name, nickname, email, id_user';
  const newUser = await db.oneOrNone(query + returningClause, newUserData);

  return newUser;
}

export async function findUserByEmail(email) {
  const query = `
    SELECT id_user, email, name, nickname
    FROM users
    WHERE email = $1
  `;
  const values = [email];
  const user = await db.oneOrNone(query, values);

  return user;
}

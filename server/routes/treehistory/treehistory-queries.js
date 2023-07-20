import { db, pgPromise } from '../../db/index.js';
import { convertObjectKeysToSnakeCase } from '../shared-routes-utils.js';

export async function createTreeHistory(newTreeHistoryData) {
  const newTreeHistoryDataInSnakeCase =
    convertObjectKeysToSnakeCase(newTreeHistoryData);

  const queryString = `
    INSERT INTO treehistory(\${this:name})
    VALUES(\${this:csv})
    RETURNING *
  `;

  const treeHistory = await db
    .oneOrNone(queryString, newTreeHistoryDataInSnakeCase)
    .then((data) => data)
    .catch((error) => error);

  return treeHistory;
}

export async function findTodaysTreeHistoryByTreeIdAndVolunteerName(
  id,
  volunteer,
) {
  const query = `
    SELECT id
    FROM treehistory
    WHERE created::date = CURRENT_DATE AND id = $1 AND volunteer = $2
  `;
  const values = [id, volunteer];

  const todaysTreeHistory = await db
    .oneOrNone(query, values)
    .then((data) => data)
    .catch((error) => error);

  return todaysTreeHistory;
}

export async function findTreeHistoryByTreeId(id) {
  const query = `
    SELECT id_treehistory, id, watered, mulched, weeded, staked, braced,
           pruned, liked, adopted, date_visit, comment, volunteer
    FROM treehistory
    WHERE id = $1
    ORDER BY date_visit DESC
    LIMIT 20
  `;
  const values = [id];
  const treeHistory = await db
    .manyOrNone(query, values)
    .then((data) => data)
    .catch((error) => error);

  return treeHistory;
}

export async function updateTreeHistory(updatedTreeHistoryData) {
  const updatedTreeHistoryDataInSnakeCase = convertObjectKeysToSnakeCase(
    updatedTreeHistoryData,
  );

  const condition = pgPromise.as.format(
    `WHERE created::date = CURRENT_DATE
            AND id = $\{id}
            AND volunteer = $\{volunteer}
      RETURNING id_treehistory, id, watered, mulched, pruned, staked,
                weeded, braced, adopted, liked, volunteer, date_visit`,
    updatedTreeHistoryDataInSnakeCase,
  );

  const queryString =
    pgPromise.helpers.update(
      updatedTreeHistoryDataInSnakeCase,
      Object.keys(updatedTreeHistoryDataInSnakeCase),
      'treehistory',
    ) + condition;

  const updatedTreeHistory = await db
    .oneOrNone(queryString, updatedTreeHistoryDataInSnakeCase)
    .then((data) => data)
    .catch((error) => error);

  return updatedTreeHistory;
}

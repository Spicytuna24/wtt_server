import { db, pgPromise } from '../../db/index.js';
import convertObjectKeysToSnakeCase from '../shared-routes-utils.js';

import convertHealthToNumber from './trees-utils.js';

export async function createTree(newTreeData) {
  const newTreeDataInSnakeCase =
    convertObjectKeysToSnakeCase(newTreeData);

  // TODO: check if 'date_planted as "dateVisit"' is needed
  const query = `
    INSERT INTO treedata(\${this:name})
    VALUES(\${this:csv})
    RETURNING *, date_planted as "dateVisit"
  `;
  const newTree = db.one(query, newTreeDataInSnakeCase);

  return newTree;
}

export async function findTreeById(id) {
  const query = `SELECT * 
    FROM treedata
    WHERE id = $1;`;
  const values = [id];
  const tree = await db.one(query, values);

  tree.healthNum = convertHealthToNumber(tree.health);

  return tree;
}

export async function updateTreeById(updatedTreeData, id) {
  const updatedTreeDataInSnakeCase =
    convertObjectKeysToSnakeCase(updatedTreeData);

  const condition = pgPromise.as.format(
    `WHERE id = ${id} RETURNING *`
  );
  const query =
    pgPromise.helpers.update(
      updatedTreeDataInSnakeCase,
      Object.keys(updatedTreeDataInSnakeCase),
      'treedata'
    ) + condition;
  const updatedTree = await db.one(query, updatedTreeDataInSnakeCase);

  return updatedTree;
}

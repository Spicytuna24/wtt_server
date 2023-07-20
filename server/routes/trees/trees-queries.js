import { db, pgPromise } from '../../db/index.js';
import AppError from '../../errors/AppError.js';
import { convertObjectKeysToSnakeCase } from '../shared-routes-utils.js';

export async function createTree(newTreeData) {
  const newTreeDataInSnakeCase = convertObjectKeysToSnakeCase(newTreeData);

  const query = `
    INSERT INTO treedata(\${this:name})
    VALUES(\${this:csv})
    RETURNING *;
  `;
  const newTree = db.one(query, newTreeDataInSnakeCase);

  return newTree;
}

export async function findTreeById(id) {
  const query = `SELECT
    id, id_reference,
    common, scientific, genus,
    address, city, state, zip, country, neighborhood, side_type
    source_id, lng,lat,
    dbh, height, health, water_freq, notes,
    date_planted, planted,
    who, email, owner, location_tree_count,
    planting_opt1, planting_opt2, planting_opt3,
    created, modified
    FROM treedata
    WHERE id = $1;`;
  const values = [id];
  const [tree, secondTree] = await db.any(query, values);

  if (secondTree) {
    throw new AppError(
      400,
      `Collision detected! Multiple trees found with the same id, ${id}.`,
    );
  }

  return tree;
}

export async function updateTreeById(updatedTreeData, id) {
  const updatedTreeDataInSnakeCase =
    convertObjectKeysToSnakeCase(updatedTreeData);
  const condition = pgPromise.as.format(` WHERE id = ${id} RETURNING *`);
  const query =
    pgPromise.helpers.update(
      updatedTreeDataInSnakeCase,
      Object.keys(updatedTreeDataInSnakeCase),
      'treedata',
    ) + condition;
  const updatedTree = await db.one(query, updatedTreeDataInSnakeCase);
  return await updatedTree;
}

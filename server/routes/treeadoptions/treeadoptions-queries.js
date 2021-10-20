const { db } = require('../../db');
const sharedRoutesUtils = require('../shared-routes-utils');

async function findTreeAdoptionsByTreeId(idTree) {
  const query = `
    SELECT id_adopted, id_tree, email
    FROM treeadoption
    WHERE id_tree = $1;
  `;
  const values = [idTree];
  const treeAdoptions = db.manyOrNone(query, values);

  return treeAdoptions;
}

async function adoptTree(adoptedTreeData) {
  const adoptedTreeDataInSnakeCase =
    sharedRoutesUtils.convertObjectKeysToSnakeCase(adoptedTreeData);

  const query = `
    INSERT INTO treeadoption(\${this:name})
    VALUES(\${this:csv})
    RETURNING *
  `;
  const newTreeAdoption = db.one(query, adoptedTreeDataInSnakeCase);

  return newTreeAdoption;
}

async function unadoptTree({ idTree, email }) {
  const query = `
    DELETE FROM treeadoption
    WHERE id_tree = $1 AND email = $2;
  `;
  const values = [idTree, email];
  const results = db.result(query, values);

  return results;
}

module.exports = {
  findTreeAdoptionsByTreeId,
  adoptTree,
  unadoptTree,
};
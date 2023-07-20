/* eslint-disable camelcase */
import { db } from '../../db/index.js';
import { createIdForTree } from '@waterthetrees/tree-id';

async function findAllTreeIds() {
  const query = `SELECT id_tree AS id_tree, common, scientific, city, state, lat, lng, id_reference FROM treedata;`;
  //  where id_reference = '9287504'`;
  const treeIds = await db.manyOrNone(query);
  return treeIds;
}

async function updateTreeId(id, id_tree) {
  if (!id_tree || !id) {
    return;
  }
  const query = `update treedata set id = ${id} WHERE id_tree = ${id_tree}`;
  const updatedTree = await db.manyOrNone(query);
  return updatedTree;
}

async function findAndReplaceTreeIds() {
  const treeIdRows = await findAllTreeIds();
  for (let i = 0; i < treeIdRows.length; i++) {
    const id = createIdForTree(treeIdRows[i]);
    const { idTree } = treeIdRows[i];
    updateTreeId(id, idTree);
  }
}

findAndReplaceTreeIds();

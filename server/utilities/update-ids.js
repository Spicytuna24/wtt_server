import { db } from '../db/index.js';
import { createIdForTree } from '@waterthetrees/tree-id';

async function findAllTreeIds() {
  const query = `SELECT id_tree AS id_tree, common, scientific, city, lat, lng FROM treedata`;
  const treeIds = await db.manyOrNone(query);
  return treeIds;
}

async function updateTreeId(id, id_tree) {
  const query = `update treedata set id = ${id} WHERE id_tree = ${id_tree}`;
  const updatedTree = await db.manyOrNone(query);
  return updatedTree;
}

async function findAndReplaceTreeIds() {
  const treeIdRows = await findAllTreeIds();
  for (let i = 0; i < treeIdRows.length; i++) {
    const id = createIdForTree(treeIdRows[i]);
    const { id_tree } = treeIdRows[i];
    updateTreeId(id, id_tree);
  }
  return treeIdRows;
}

findAndReplaceTreeIds();

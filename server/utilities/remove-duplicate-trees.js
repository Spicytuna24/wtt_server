import { db } from '../db/index.js';

const featureFlags = { deleteDups: false };

async function findDuplicateTreeCounts() {
  const query = `select id, count(1) AS counted from treedata group by id having count(1) > 1;`;
  // select count(id) from treedata group by id having count(id) > 1;
  const result = await db.manyOrNone(query);
  return result;
}

async function updateDuplicates(id) {
  const query = `update treedata set 
 location_tree_count = (select count(id) from treedata where id = ${id} and location_tree_count is null group by id having count(id) > 1), 
 notes = (select string_agg(id_reference, ', ' order by id_reference) from treedata where id = ${id}) 
 where id = '${id}';`;
  const result = await db.manyOrNone(query);
  return result;
}

async function deleteDuplicates() {
  const query = `DELETE FROM treedata a USING treedata b WHERE a.id_tree < b.id_tree AND a.id = b.id;`;
  const result = await db.manyOrNone(query);
  return result;
}

async function findAndRemoveDuplicateTrees() {
  const treeIdRows = await findDuplicateTreeCounts();
  for await (const row of treeIdRows) {
    await updateDuplicates(row.id);
  }
  if (featureFlags.deleteDups) {
    await deleteDuplicates();
  }
}

findAndRemoveDuplicateTrees();

const { db } = require('../../db');

async function findUserTreeHistoryByVolunteerName(volunteer) {
  const query = `
    SELECT treehistory.date_visit as "dateVisit", treedata.common, treedata.scientific,
           treehistory.liked, treehistory.adopted, treehistory.watered, treehistory.mulched,
           treehistory.weeded, treehistory.staked, treehistory.braced, treehistory.pruned
    FROM treehistory
    JOIN treedata USING (id_tree)
    WHERE treehistory.volunteer = $1;
  `;
  const values = [volunteer];
  const userTreeHistory = await db.manyOrNone(query, values);

  return userTreeHistory;
}

module.exports = {
  findUserTreeHistoryByVolunteerName,
};
import { db } from '../../db/index.js';

export async function getAllTreeDataByCity(cityName) {
  const query = 'SELECT * FROM treedata WHERE city = $1';
  const values = [cityName];
  const cityTreeData = await db.manyOrNone(query, values);
  return cityTreeData;
}

export async function getAllTreeDataCities() {
  const query = `SELECT * FROM treedata WHERE city NOT IN ('Alameda', 'San Francisco', 'Oakland')`;
  const cityTreeData = await db.manyOrNone(query);
  return cityTreeData;
}

import { db } from '../../db/index.js';

export async function createCity(newCityData) {
  const query = `
    INSERT INTO cities(\${this:name})
    VALUES(\${this:csv})
  `;

  await db.none(query, newCityData);
}

export async function findAllCities() {
  const query = 'SELECT * FROM cities';
  const allCities = await db.many(query);
  return allCities;
}

export async function findCityByName(cityName) {
  const query = `SELECT * FROM cities WHERE city = '${cityName}'`;
  const city = await db.oneOrNone(query);
  return city;
}

export async function updateCityTreeCount(city) {
  const query = `
    UPDATE cities
    SET city_count_trees = (SELECT count(id_tree)
                            FROM treedata
                            WHERE city = $1)
    WHERE city = $1;
  `;
  const values = [city];

  await db.none(query, values);
}

import { db } from '../../db/index.js';

async function getCountries() {
  const query = `SELECT country, country_code as "countryCode",
  lng, lat, country_count_trees AS "countryCountTrees" 
  FROM countries;`;
  const countries = await db.many(query);
  return countries;
}
export default getCountries;

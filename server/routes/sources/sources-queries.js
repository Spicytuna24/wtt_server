import { db, pgPromise } from '../../db/index.js';

import {
  convertObjectKeysToSnakeCase,
  convertObjectKeysToCamelCase,
} from '../shared-routes-utils.js';

const SOURCE_FIELDS = `id_source_name as "idSourceName", 
    iso_alpha_3 as "isoAlpha3", 
    country,
    state, 
    city, 
    email, 
    contact, 
    phone, 
    info, 
    download, 
    notes, 
    filename,
    format,
    longitude,
    latitude,
    license,
    broken`;

const CROSSWALK_FIELDS = `id_source_name as "idSourceName", 
  common,
  species, 
  genus, 
  scientific, 
  family, 
  variety, 
  class, 
  dbh, 
  height, 
  structure, 
  trunks, 
  age, 
  health, 
  crown, 
  spread, 
  planted, 
  updated, 
  location, 
  note, 
  address, 
  id_reference as "idReference", 
  owner, 
  ule, 
  ule_min as "uleMin", 
  ule_max as "uleMax", 
  cost,
  audited, 
  longitude, 
  latitude, 
  city, 
  state, 
  zip, 
  country, 
  neighborhood, 
  url, 
  urlimage, 
  status, 
  email, 
  volunteer, 
  notes, 
  legal_status as legalStatus, 
  irrigation, 
  count, 
  dbh_min as "dbhMin", 
  dbh_max as "dbhMax", 
  height_min as "heightMin", 
  height_max as "heightMax",
  crown_min as "crownMin", 
  crown_max as "crownMax"`;

export async function createSource(data) {
  // eslint-disable-next-line no-unused-vars
  const { crosswalk, destinations, ...source } = data;

  const dataInSnakeCase = convertObjectKeysToSnakeCase(source);

  const query = `
      INSERT INTO sources(\${this:name})
      VALUES(\${this:csv})
      RETURNING id_source_name as "idSourceName"
    `;

  const response = await db.one(query, dataInSnakeCase);
  return response;
}

export async function createCrosswalk(data) {
  const dataInSnakeCase = convertObjectKeysToSnakeCase(data);
  const query = `
      INSERT INTO crosswalk(\${this:name})
      VALUES(\${this:csv})
      RETURNING id_source_name as "idSourceName"
    `;

  const response = await db.one(query, dataInSnakeCase);
  return response;
}

export async function getAllSources() {
  const query = {
    name: 'find-sources',
    text: `SELECT ${SOURCE_FIELDS} FROM sources;`,
  };
  const source = await db.any(query);
  return source;
}

export async function getSourceByIdSourceName(idSourceName) {
  const query = {
    name: 'find-source',
    text: `SELECT ${SOURCE_FIELDS} 
      FROM sources 
      WHERE id_source_name =  $1`,
    values: idSourceName,
  };

  const source = await db.one(query);
  return source;
}

export async function getCrosswalkByIdSourceName(idSourceName) {
  const query = {
    name: 'find-crosswalk',
    text: `SELECT ${CROSSWALK_FIELDS}
    FROM crosswalk where id_source_name = $1`,
    values: idSourceName,
  };
  const source = await db.one(query);
  return source;
}

export async function updateSourceByIdSourceName(data) {
  const dataInSnakeCase = convertObjectKeysToSnakeCase(data);
  const keys = Object.keys(dataInSnakeCase);
  const keysString = keys.join(', ');

  const condition = pgPromise.as.format(
    ` WHERE id_source_name = '${data.idSourceName}' 
      RETURNING ${keysString};`,
  );
  const query =
    pgPromise.helpers.update(dataInSnakeCase, keys, 'sources') + condition;
  const updatedResponse = await db.one(query, dataInSnakeCase);
  const camelCaseResponse = convertObjectKeysToCamelCase(await updatedResponse);
  return camelCaseResponse;
}

export async function updateCrosswalkByIdSourceName(data) {
  const { id_source_name, ...dataInSnakeCase } =
    convertObjectKeysToSnakeCase(data);
  const keys = Object.keys(dataInSnakeCase);
  const keysString = keys.join(', ');

  const condition = pgPromise.as.format(
    ` WHERE id_source_name = '${id_source_name}' RETURNING ${keysString};`,
  );
  const query =
    pgPromise.helpers.update(dataInSnakeCase, keys, 'crosswalk') + condition;
  const updatedResponse = await db.one(query, dataInSnakeCase);
  const camelCaseSource = convertObjectKeysToCamelCase(await updatedResponse);
  return { idSourceName: data.idSourceName, ...camelCaseSource };
}

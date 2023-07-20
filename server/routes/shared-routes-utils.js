// function camelToSnakeCase(camelIn) {
//   return camelIn.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
// }

function snakeToCamelCase(snakeIn) {
  return snakeIn.replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace('-', '').replace('_', ''),
  );
}

export const convertObjectKeysToCamelCase = (obj) => {
  const newObj = {};
  for (const key in obj) {
    newObj[snakeToCamelCase(key)] = obj[key];
  }
  return newObj;
};

function camelToSnakeCase(camelIn) {
  return camelIn.replace(/[A-Z0-9]/g, (letter) => {
    if (/[A-Z]/.test(letter)) {
      return `_${letter.toLowerCase()}`;
    } else if (/[0-9]/.test(letter)) {
      return `_${letter}`;
    } else {
      return letter;
    }
  });
}

export const convertObjectKeysToSnakeCase = (obj) => {
  const newObj = {};

  // eslint-disable-next-line no-restricted-syntax
  for (const key in obj) {
    if (key === key.toLowerCase()) {
      newObj[key] = obj[key];
    } else {
      newObj[camelToSnakeCase(key)] = obj[key];
    }
  }
  return newObj;
};

export const startAndEnd = str => {
  if (typeof str !== 'string') return '';

  return str.substr(0, 6) + '...' + str.substr(str.length - 4, str.length);
};

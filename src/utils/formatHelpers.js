export const startAndEnd = str => {
  if (typeof str !== 'string') return '';

  return str.substr(0, 6) + '...' + str.substr(str.length - 4, str.length);
};

export const numberWithCommas = str => {
  const parts = str.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};

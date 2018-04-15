export default (keys, start = 0) => (...values) => {
  values = values.slice(start);
  const result = {};
  keys.forEach((key, i) => {
    result[key] = values[i];
  });
  return result;
};

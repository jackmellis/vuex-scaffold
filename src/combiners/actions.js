export default (...args) => {
  const result = {};

  args.filter(Boolean).forEach((arg) => {
    Object.keys(arg).forEach((key) => {
      result[key] = (result[key] || []).concat(arg[key]);
    });
  });

  Object.keys(result).forEach((key) => {
    const actions = result[key];
    result[key] = (context, payload) => {
      return Promise.all(
        actions.map((action) => action(context, payload)),
      );
    };
  });

  return result;
};

export default (type, payloadCreator, metaCreator) => (...args) => {
  const payload = payloadCreator ? payloadCreator.apply(null, args) : args.length ? args[0] : void 0;
  const meta = metaCreator ? metaCreator.apply(null, args) : void 0;
  const error = payload instanceof Error;

  return {
    type,
    payload,
    meta,
    error,
  };
};

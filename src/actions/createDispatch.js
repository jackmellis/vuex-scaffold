import createAction from './createAction';

const createDispatch = (type, payloadCreator, metaCreator, store) => {
  if (store == null) {
    if (typeof payloadCreator === 'object') {
      store = payloadCreator;
      payloadCreator = null;
    } else if (typeof metaCreator === 'object') {
      store = metaCreator;
      metaCreator = null;
    } else {
      return (store) => createDispatch(type, payloadCreator, metaCreator, store);
    }
  }

  const actionCreator = createAction(type, payloadCreator, metaCreator);

  return (...args) => {
    const action = actionCreator.apply(null, args);
    return store.dispatch(action);
  };
};

export default createDispatch;

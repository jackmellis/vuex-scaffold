import createAction from './createAction';

const createCommit = (type, payloadCreator, metaCreator, store) => {
  if (store == null) {
    if (typeof payloadCreator === 'object') {
      store = payloadCreator;
      payloadCreator = null;
    } else if (typeof metaCreator === 'object') {
      store = metaCreator;
      metaCreator = null;
    } else {
      return (store) => createCommit(type, payloadCreator, metaCreator, store);
    }
  }

  const actionCreator = createAction(type, payloadCreator, metaCreator);

  return (...args) => {
    const action = actionCreator.apply(null, args);
    return store.commit(action);
  };
};

export default createCommit;

import curry from 'curry';

export default curry((pred, fn) => function (...args) {
  if (pred.apply(this, args)) {
    return fn.apply(this, args);
  }
});

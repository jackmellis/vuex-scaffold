import { deepAssign } from '../utils';

export default (args) => {
  args.unshift({});
  return deepAssign.apply(null, args);
};

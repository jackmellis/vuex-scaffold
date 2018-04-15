import { isBoolean } from '../utils';
import combineActions from './actions';
import combineMutations from './mutations';
import combineArray from './array';

const combineModules = (...args) => {
  let deep = false;
  if (isBoolean(args[args.length - 1])) {
    deep = args[args.length - 1];
    args.pop();
  }
  args = args.filter(Boolean);

  const result = Object.assign.apply(Object, [{}].concat(args));
  const states = args.map((arg) => arg.state);
  const getters = args.map((arg) => arg.getters);
  const mutations = args.map((arg) => arg.mutations);
  const actions = args.map((arg) => arg.actions);
  const modules = args.map((arg) => arg.modules);

  result.state = combineArray(states);
  result.getters = combineArray(getters);
  result.mutations = combineMutations.apply(null, mutations);
  result.actions = combineActions.apply(null, actions);

  if (deep) {
    result.modules = {};
    modules.filter(Boolean).forEach((arg) => {
      Object.keys(arg).forEach((key) => {
        result.modules[key] = (result.modules[key] || []).concat(arg[key]);
      });
    });
    Object.keys(result.modules).forEach((key) => {
      const value = result.modules[key];
      if (value.length === 0) {
        result.modules[key] = {};
      } else if (value.length === 1) {
        result.modules[key] = value[0];
      } else {
        result.modules[key] = combineModules.apply(null, value.concat(true));
      }
    });
    // result.modules = combineModules.apply(null, modules.concat(true));
  }

  return result;
};

export default combineModules;

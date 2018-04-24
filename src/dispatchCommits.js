import mapToCommit from './maps/toCommit';
import { combineActions } from './combiners/actions';

export default (module) => {
  const actions = {};
  Object.keys(module.mutations).forEach((key) => {
    actions[key] = mapToCommit(key);
  });

  return Object.assign(
    {},
    module,
    {
      actions: combineActions(module.actions, actions),
    },
  );
};

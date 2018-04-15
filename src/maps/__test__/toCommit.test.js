import test from 'ava';
import sinon from 'sinon';
import Vue from 'vue';
import vuex from 'vuex';

import mapToCommit from '../toCommit';

Vue.use(vuex);

test('maps an action to a commit', async t => {
  const store = new vuex.Store({
    state: {
      value: null,
    },
    mutations: {
      SET_VALUE: (state, value) => state.value = value,
    },
    actions: {
      setValue: mapToCommit('SET_VALUE'),
    },
  });

  await store.dispatch('setValue', 'foo');

  t.is(store.state.value, 'foo');
});

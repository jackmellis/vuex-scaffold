import test from 'ava';
import sinon from 'sinon';
import Vue from 'vue';
import vuex from 'vuex';

import dispatchCommits from '../dispatchCommits';

Vue.use(vuex);

test('triggers a mutations from a dispatch', async t => {
  const spy1 = sinon.stub().callsFake((state) => state.tada = true);
  const spy2 = sinon.spy();

  const store = new vuex.Store(
    dispatchCommits(
      {
        state: {
          tada: false,
        },
        mutations: {
          tada: spy1,
        },
        actions: {
          tada: spy2,
          submit: ({ dispatch }) => dispatch('tada'),
        },
      }
    )
  );

  await store.dispatch('submit');

  t.true(spy1.called);
  t.true(spy2.called);
  t.is(store.state.tada, true);
});

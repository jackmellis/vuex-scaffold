import test from 'ava';
import sinon from 'sinon';
import Vue from 'vue';
import vuex from 'vuex';

import createCommit from '../createCommit';

Vue.use(vuex);

test.beforeEach(t => {
  const spy1 = sinon.spy();
  const store = new vuex.Store({
    mutations: {
      test: spy1,
    },
  });

  t.context = { spy1, store };
});

test('returns a function', t => {
  const action = createCommit('test', t.context.store);

  t.is(typeof action, 'function');
});

test('commits a mutation', async t => {
  const { spy1, store } = t.context;

  const action = createCommit('test', (x) => ({ x }), store);

  await action('foo');

  t.true(spy1.called);

  const args = spy1.lastCall.args[1];

  t.is(args.payload.x, 'foo');
});

test('curries if store is not provided', t => {
  const { store } = t.context;

  const action = createCommit('test');

  t.is(typeof action, 'function');

  const dispatcher = action(store);

  t.is(typeof dispatcher, 'function');
});

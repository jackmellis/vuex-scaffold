import test from 'ava';
import sinon from 'sinon';
import Vue from 'vue';
import vuex from 'vuex';

import combineModules from '../modules';

Vue.use(vuex);

test.beforeEach(t => {
  t.context.module3 = {
    namespaced: true,
    actions: {
      common: sinon.spy(),
    },
  };
  t.context.module4 = {
    actions: {
      common: sinon.spy(),
    },
  };
  t.context.module1 = {
    state: {
      common: 'module1',
      m1: 'module1',
    },
    getters: {
      m1: sinon.spy(),
    },
    mutations: {
      common: sinon.spy(),
      m1: sinon.spy(),
    },
    actions: {
      common: sinon.spy(),
      m1: sinon.spy(),
    },
    modules: {
      foo: t.context.module3,
    },
  };
  t.context.module2 = {
    state: {
      common: 'module2',
      m2: 'module2',
    },
    getters: {
      m2: sinon.spy(),
    },
    mutations: {
      common: sinon.spy(),
      m2: sinon.spy(),
    },
    actions: {
      common: sinon.spy(),
      m2: sinon.spy(),
    },
    modules: {
      foo: t.context.module4,
    },
  };

  t.context.module = combineModules(
    t.context.module1,
    t.context.module2,
    true
  );
  t.context.store = new vuex.Store(t.context.module);
});

test('merges state', t => {
  const { module } = t.context;

  t.is(module.state.m1, 'module1');
  t.is(module.state.m2, 'module2');
  t.is(module.state.common, 'module2');
});

test('merges getters', t => {
  const { module, module1, module2 } = t.context;

  t.is(module.getters.m1, module1.getters.m1);
  t.is(module.getters.m2, module2.getters.m2);
});

test('combines mutations', t => {
  const { module, module1, module2, store } = t.context;

  t.not(module.mutations.m1, module1.mutations.m1);
  t.not(module.mutations.m2, module2.mutations.m2);
  t.not(module.mutations.common, module1.mutations.common);
  t.not(module.mutations.common, module2.mutations.common);

  t.false(module1.mutations.m1.called);
  t.false(module2.mutations.m2.called);
  t.false(module1.mutations.common.called);
  t.false(module2.mutations.common.called);

  store.commit('m1');
  t.true(module1.mutations.m1.called);

  store.commit('m2');
  t.true(module2.mutations.m2.called);

  store.commit('common');
  t.true(module1.mutations.common.called);
  t.true(module2.mutations.common.called);
});

test('combines actions', async t => {
  const { module, module1, module2, store } = t.context;

  t.not(module.actions.m1, module1.actions.m1);
  t.not(module.actions.m2, module2.actions.m2);
  t.not(module.actions.common, module1.actions.common);
  t.not(module.actions.common, module2.actions.common);

  t.false(module1.actions.m1.called);
  t.false(module2.actions.m2.called);
  t.false(module1.actions.common.called);
  t.false(module2.actions.common.called);

  await store.dispatch('m1');
  t.true(module1.actions.m1.called);

  await store.dispatch('m2');
  t.true(module2.actions.m2.called);

  await store.dispatch('common');
  t.true(module1.actions.common.called);
  t.true(module2.actions.common.called);
});

test('combines submodules', async t => {
  const { store, module3, module4 } = t.context;

  await store.dispatch('common');
  t.false(module3.actions.common.called);
  t.false(module4.actions.common.called);

  await store.dispatch('foo/common');
  t.true(module3.actions.common.called);
  t.true(module4.actions.common.called);
});

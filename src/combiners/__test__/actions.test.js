import test from 'ava';
import sinon from 'sinon';
import Vue from 'vue';
import vuex from 'vuex';

import { combineActions } from '../actions';

Vue.use(vuex);

test('returns an actions object', t => {
  const actions = combineActions(
    {
      fetch: () => {},
    },
    {
      submit: () => {},
    },
  );

  t.is(typeof actions, 'object');
  t.is(typeof actions.fetch, 'function');
  t.is(typeof actions.submit, 'function');
});

test('combines differently-keyed actions', async t => {
  const fetch = sinon.spy();
  const submit = sinon.spy();
  const actions = combineActions(
    {
      fetch,
    },
    {
      submit,
    },
  );

  const store = new vuex.Store({ actions });

  await store.dispatch('fetch');

  t.true(fetch.called);
  t.false(submit.called);

  await store.dispatch('submit');

  t.true(submit.called);
});

test('combines same-keyed actions', async t => {
  const fetch1 = sinon.spy();
  const fetch2 = sinon.spy();
  const submit = sinon.spy();
  const actions = combineActions(
    {
      fetch: fetch1,
    },
    {
      fetch: fetch2,
      submit,
    },
  );

  const store = new vuex.Store({ actions });

  await store.dispatch('fetch');

  t.true(fetch1.called);
  t.true(fetch2.called);
  t.false(submit.called);

  await store.dispatch('submit');

  t.true(submit.called);
});

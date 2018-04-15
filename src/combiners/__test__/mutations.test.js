import test from 'ava';
import sinon from 'sinon';
import Vue from 'vue';
import vuex from 'vuex';

import combineMutations from '../mutations';

Vue.use(vuex);

test('returns a mutations object', t => {
  const mutations = combineMutations(
    {
      fetch: () => {},
    },
    {
      submit: () => {},
    },
  );

  t.is(typeof mutations, 'object');
  t.is(typeof mutations.fetch, 'function');
  t.is(typeof mutations.submit, 'function');
});

test('combines differently-keyed mutations', t => {
  const fetch = sinon.spy();
  const submit = sinon.spy();
  const mutations = combineMutations(
    {
      fetch,
    },
    {
      submit,
    },
  );

  const store = new vuex.Store({ mutations });

  store.commit('fetch');

  t.true(fetch.called);
  t.false(submit.called);

  store.commit('submit');

  t.true(submit.called);
});

test('combines same-keyed mutations', t => {
  const fetch1 = sinon.spy();
  const fetch2 = sinon.spy();
  const submit = sinon.spy();
  const mutations = combineMutations(
    {
      fetch: fetch1,
    },
    {
      fetch: fetch2,
      submit,
    },
  );

  const store = new vuex.Store({ mutations });

  store.commit('fetch');

  t.true(fetch1.called);
  t.true(fetch2.called);
  t.false(submit.called);

  store.commit('submit');

  t.true(submit.called);
});

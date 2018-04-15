import test from 'ava';
import sinon from 'sinon';
import Vue from 'vue';
import vuex from 'vuex';

import filter from '../filter';

Vue.use(vuex);

test('does not trigger action if filter fails', async t => {
  const spy = sinon.spy();
  const store = new vuex.Store({
    actions: {
      fetch: filter(() => false, spy),
    },
  });

  await store.dispatch('fetch');

  t.false(spy.called);
});

test('triggers action is filter passes', async t => {
  const spy = sinon.spy();
  const store = new vuex.Store({
    actions: {
      fetch: filter(() => true, spy),
    },
  });

  await store.dispatch('fetch');

  t.true(spy.called);
});

test('passes in context and payload', async t => {
  const spy = sinon.stub().returns(false);
  const store =new vuex.Store({
    actions: {
      fetch: filter(spy, () => {}),
    },
  });

  await store.dispatch('fetch', 'foo');

  const [context, payload] = spy.lastCall.args;

  t.is(payload, 'foo');
  t.is(typeof context, 'object');
});

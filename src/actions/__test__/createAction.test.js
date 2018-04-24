import test from 'ava';

import createAction from '../createAction';
import createPayload from '../createPayload';

test('creates an action', t => {
  const result = createAction('FOO');

  t.is(typeof result, 'function');
  t.is(typeof result(), 'object');
});

test('sets the type', t => {
  const result = createAction('FOO')();

  t.is(result.type, 'FOO');
});

test('sets the payload', t => {
  const result = createAction(
    'FOO',
    (x) => ({ x }),
  )('zzz');

  t.is(result.payload.x, 'zzz');
});

test('when no payloadCreator provided, uses the provided data', t => {
  const result = createAction('FOO')('zzz');

  t.is(result.payload, 'zzz');
});

test('sets meta data', t => {
  const result = createAction(
    'FOO',
    void 0,
    (x) => ({ x }),
  )('zzz');

  t.is(result.meta.x, 'zzz');
});

test('works with payload creator', t => {
  const foo = createAction(
    'FOO',
    createPayload([ 'value' ]),
    createPayload([ 'form' ], 1),
  );
  const result = foo(4, 'bah');

  t.is(result.payload.value, 4);
  t.is(result.meta.form, 'bah');
});

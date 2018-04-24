# vuex-scaffold
Scaffolding methods to compose your Vuex store

## createAction
```js
(
  type: string,
  payloadCreator?: Function,
  metaCreator?: Function,
) => (
  ...args
) => {
  type: string,
  payload: Object,
  meta: Object,
}
```
Aside from the standard `dispatch(type, payload)`, Vuex also supports an action object, i.e. `dispatch({ type: 'foo' })`. A common pattern is to use an action creator to generate the action object.

`createAction` allows you to compose this action creator.

```js
const fetch = createAction(
  'fetch',
  (id) => ({ id }),
  (id, resolve, reject) => ({ resolve, reject }),
);

// then:
const action = fetch(4, res, rej);
store.dispatch(action);
```

## createPayload
```js
(
  keys: Array<string>,
  offset?: number,
) => (
  ...values
) => Object
```
A helper that creates a payload object from an array of keys. Use it in conjunction with `createAction`.

```js
const fetch = createAction(
  'fetch',
  createPayload([ 'id' ]),
  createPayload([ 'resolve', 'reject' ], 1),
);

fetch(4, res, rej)
```

## combineActions
```js
(...actions: Array<Object>) => Object
```
Takes a number of objects that contain actions and combines them. Any same-keyed actions are run together.

```js
const actions = combineActions(
  {
    fetch: (context, payload) => { /* ... */ },
  },
  {
    fetch: (context, payload) => { /* ... */ },
  },
);

// later
store.dispatch('fetch');
// will dispatch both fetch actions
```

## combineActionArray
```js
(actions: Array<Object>) => Object
```
An array version of `combineActions`.

## combineMutations
```js
(...mutations: Array<Object>) => Object
```
Takes a number of objects that contain mutations and combines them. Any same-keyed mutations are run together.

```js
const mutations = combineMutations(
  {
    FETCH: (state, payload) => { /* ... */ },
  },
  {
    FETCH: (state, payload) => { /* ... */ },
  },
);

// later
store.dispatch('FETCH');
// will dispatch both fetch mutations
```

## combineMutationArray
```js
(mutations: Array<Object) => Object
```
An array version of `combineMutations`

## combineModules
```js
(...modules: Array<Object>) => Object
```
Takes a number of modules and combines them.

## combineModuleArray
```js
(modules: Array<Object>) => Object
```
An array version of `combineModules`

## mapToCommit
```js
(key: string) => Function
```
Takes the key of a mutation and automatically commits it when the specified action is caled.

```js
const actions = {
  fetch: mapToCommit('FETCH'),
};
```

## filter
```js
(
  predicate: (...args) => boolean,
  fn: (...args) => any,
) => Function
```
wraps an action or commit in a function that only executes when the given predicate passes.

```js
const actions = {
  fetch: filter(
    (context, payload) => payload.key === 4,
    (context, payload) => { /* ... */ },
  ),
};
```
Filter is also curried, meaning you can create helper functions:
```js
const onlyForKey = filter((context, payload) => payload.key === 4);

const actions = {
  fetch: onlyForKey(() => { /* ... */ }),
};
```

## dispatchCommits
```js
(module: Object) => Object
```
takes all mutations in a module and creates an action for each one.

```js
const module = dispatchCommits({
  mutations: {
    fetch: (state, payload) => { /* ... */ },
  },
});

store.dispatch('fetch'); // will trigger the fetch mutation
```
This means you no longer have to differentiate between your actions and mutations. It also means you can isolate your action as you don't need to know what is a mutation or an action.

```js
const mutations = {
  submitting: () => { /* ... */ },
  submitted: () => { /* ... */ },
};
const actions = {
  doSomething: () => { /* ... */ },
  submitted: () => { /* ... */ },
  submit: async ({ commit, dispatch }) => {
    commit('submitting');
    await dispatch('doSomething');
    commit('submitted');
    await dispatch('submitted');
  },
};
```
In the above example, the submit action has to be aware of the fact that `submitting` is a mutation, `doSomething` is an action, and `submitted` is both an action and a mutation.

It would be much better if your action could dispatch actions and not have to be aware of the context. Using `dispatchCommits`, submit would look something like:
```js
({ commit, dispatch }) => {
  dispatch('submitting');
  dispatch('doSomething');
  dispatch('submitted');
}
```

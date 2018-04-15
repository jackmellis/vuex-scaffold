import curry from 'curry';

var createAction = (function (type, payloadCreator, metaCreator) {
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var payload = payloadCreator ? payloadCreator.apply(null, args) : {};
    var meta = metaCreator ? metaCreator.apply(null, args) : void 0;
    var error = payload instanceof Error;

    return {
      type: type,
      payload: payload,
      meta: meta,
      error: error
    };
  };
});

var createPayload = (function (keys) {
  var start = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return function () {
    for (var _len = arguments.length, values = Array(_len), _key = 0; _key < _len; _key++) {
      values[_key] = arguments[_key];
    }

    values = values.slice(start);
    var result = {};
    keys.forEach(function (key, i) {
      result[key] = values[i];
    });
    return result;
  };
});

var combineActions = (function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var result = {};

  args.filter(Boolean).forEach(function (arg) {
    Object.keys(arg).forEach(function (key) {
      result[key] = (result[key] || []).concat(arg[key]);
    });
  });

  Object.keys(result).forEach(function (key) {
    var actions = result[key];
    result[key] = function (context, payload) {
      return Promise.all(actions.map(function (action) {
        return action(context, payload);
      }));
    };
  });

  return result;
});

var combineMutations = (function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var result = {};

  args.filter(Boolean).forEach(function (arg) {
    Object.keys(arg).forEach(function (key) {
      result[key] = (result[key] || []).concat(arg[key]);
    });
  });

  Object.keys(result).forEach(function (key) {
    var mutations = result[key];
    result[key] = function (context, payload) {
      mutations.forEach(function (action) {
        return action(context, payload);
      });
    };
  });

  return result;
});

var toType = function toType(obj) {
  return Object.prototype.toString.call(obj);
};

var isObject = function isObject(obj) {
  return toType(obj) === '[object Object]';
};

var isBoolean = function isBoolean(obj) {
  return toType(obj) === '[object Boolean]';
};

var deepAssign = function deepAssign(target) {
  for (var _len = arguments.length, sources = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    sources[_key - 1] = arguments[_key];
  }

  var _loop = function _loop() {
    var source = sources.shift();

    if (isObject(target) || isObject(source)) {
      if (!isObject(target)) {
        target = {};
      } else if (!isObject(source)) {
        source = {};
      }

      Object.keys(source).forEach(function (key) {
        var value = source[key];
        if (isObject(value)) {
          target[key] = deepAssign(target[key], source[key]);
        } else {
          target[key] = source[key];
        }
      });
    }
  };

  while (sources.length) {
    _loop();
  }
  return target;
};

var combineArray = (function (args) {
  args.unshift({});
  return deepAssign.apply(null, args);
});

var combineModules = function combineModules() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var deep = false;
  if (isBoolean(args[args.length - 1])) {
    deep = args[args.length - 1];
    args.pop();
  }
  args = args.filter(Boolean);

  var result = Object.assign.apply(Object, [{}].concat(args));
  var states = args.map(function (arg) {
    return arg.state;
  });
  var getters = args.map(function (arg) {
    return arg.getters;
  });
  var mutations = args.map(function (arg) {
    return arg.mutations;
  });
  var actions = args.map(function (arg) {
    return arg.actions;
  });
  var modules = args.map(function (arg) {
    return arg.modules;
  });

  result.state = combineArray(states);
  result.getters = combineArray(getters);
  result.mutations = combineMutations.apply(null, mutations);
  result.actions = combineActions.apply(null, actions);

  if (deep) {
    result.modules = {};
    modules.filter(Boolean).forEach(function (arg) {
      Object.keys(arg).forEach(function (key) {
        result.modules[key] = (result.modules[key] || []).concat(arg[key]);
      });
    });
    Object.keys(result.modules).forEach(function (key) {
      var value = result.modules[key];
      if (value.length === 0) {
        result.modules[key] = {};
      } else if (value.length === 1) {
        result.modules[key] = value[0];
      } else {
        result.modules[key] = combineModules.apply(null, value.concat(true));
      }
    });
    // result.modules = combineModules.apply(null, modules.concat(true));
  }

  return result;
};

var mapToCommit = (function (key) {
  return function (_ref, payload) {
    var commit = _ref.commit;
    return commit(key, payload);
  };
});

var filter = curry(function (pred, fn) {
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (pred.apply(this, args)) {
      return fn.apply(this, args);
    }
  };
});

var dispatchCommits = (function (module) {
  var actions = {};
  Object.keys(module.mutations).forEach(function (key) {
    actions[key] = mapToCommit(key);
  });

  return Object.assign({}, module, {
    actions: combineActions(module.actions, actions)
  });
});

export { createAction, createPayload, combineActions, combineMutations, combineModules, mapToCommit, filter, dispatchCommits };

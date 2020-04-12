module.exports = function disablesAction(disableActions = false) {
  const actions = {
    find: {},
    count: {},
    list: {},
    insert: {},
    get: {},
    update: {},
    remove: {},
    create: {},
  };

  if (disableActions === true || Array.isArray(disableActions)) {
    Object.keys(actions)
      .filter(k => disableActions === true || disableActions.includes(k))
      .forEach((k) => { actions[k] = false; });
  }

  return {
    actions,
  };
};

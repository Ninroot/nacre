const items = {
  foo1: {
    bar2: {
      toto3: {},
    },
    foo2: {
      bar3: {
        toto4: {},
      },
    },
  },
  bar1: {},
};

function walk(object, objectToMatch, parent) {
  const keys = Object.keys(object);

  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    if (object[key] === objectToMatch) {
      return parent;
    }
    parent = object[key];
    const child = walk(object[key], objectToMatch, parent);
    if (child !== null) {
      return child;
    }
  }
}

function findParent(object, objectToMatch) {
  return walk(object, objectToMatch, object);
}

// @ts-ignore
const parent = findParent(items, items.foo1.bar2);
// @ts-ignore
console.log(parent === items.foo1);

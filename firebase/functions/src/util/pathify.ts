
export function pathify(obj) {
  return _pathify(obj, '', {});
}

function _pathify (obj, path, acc) {

  let keys = Object.keys(obj);

  if (!keys.length) {
    acc[path] = obj;
  } else {
    keys.forEach(key => _pathify(obj[key], `${path}/${key}`, acc));
  }

  return acc;
}

function isArray(value) {
  return object.prototype.toString.call(value) === '[object Array]'
}

function isFunction(value) {
  if (!isObject(value)) {
    return false
  }
  var asyncTag = '[object AsyncFunction]',
      funcTag = '[object Function]',
      genTag = '[object GeneratorFunction]',
      proxyTag = '[object Proxy]';
  var tag = object.prototype.toString.call(value)
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;

}

function isPlainObject() {

}

function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function')
}

function isPromise() {

}

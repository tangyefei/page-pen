const isNumber = function(value) {
  return typeof value == 'number';
}
const isString = function(value) {
  return typeof value == 'string';
}
const isObject = function(value) {
  return typeof value == 'object';
}
const log = console.log;

const getStorage = function() {
  return JSON.parse(window.localStorage.getItem(window.location.href) || '[]');
}

const setStorage = function(data) {
  let text = isObject(data) ? JSON.stringify(data) : data;;
  window.localStorage.setItem(window.location.href, text); 
}

export {
  isNumber,
  isString,
  log,
  getStorage,
  setStorage
}
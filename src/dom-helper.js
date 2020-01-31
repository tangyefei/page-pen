const getSelection = function() {
  return window.getSelection && window.getSelection();//.toString();
}
const createTextNode = document.createTextNode.bind(document);

const createElement = (tag, cls, text)=>{
  let ele = document.createElement(tag);
  ele.classList.add(cls);
  ele.innerText = text;
  return ele;
}

const hasClass = (el, className) => {
  return el.classList.contains(className);
}

export default {
  hasClass,
  getSelection,
  createTextNode,
  createElement
}
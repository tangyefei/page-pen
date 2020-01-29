import './base.scss';

const PEN_IDLE = 'PEN_IDLE';
const PEN_DOWN = 'PEN_DOWN';
const PEN_UP = 'PEN_UP';

const log = console.log;
const select = function() {
  return window.getSelection && window.getSelection();//.toString();
}
const _t = document.createTextNode.bind(document);
const _e = document.createElement.bind(document);

const highLightSelection = function(selection) {
  let text = selection.toString().trim();
  let node = selection.baseNode;
  let index = node.textContent.indexOf(text);
  let preText = _t(node.textContent.substring(0,index));
  let aftText = _t(node.textContent.substring(index+text.length));
  let ele = _e("span");
  ele.classList.add("select-zone");
  ele.innerText = text;

  let parent = node.parentElement;
  parent.appendChild(preText);
  parent.appendChild(ele);
  parent.appendChild(aftText);

  node.remove();
}

let status = PEN_IDLE;

document.body.classList.add('pen-wrapper');

document.body.addEventListener('mousedown', function(e){
  status = PEN_DOWN;
  log(status);
})
document.body.addEventListener('mouseup', function(e){
  let selection = select();
  let text = selection.toString().trim();
  if(text && text.length > 0) {
    status = PEN_UP;
    highLightSelection(selection);
  } else {
    status = PEN_IDLE;
  }
})
document.body.addEventListener('mousemove', function(){
  // if(status !== PEN_IDLE) {
  //   status = PEN_IDLE;
  //   log(status);
  // }
})

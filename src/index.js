
import './css/base.scss';

// import Utils from './utils';
import {PEN_IDLE, PEN_DOWN, PEN_UP} from './constant';
import { isNumber, isString, log, getStorage, setStorage} from './utils';
import $ from './dom-helper';
import { buildAST, simplify } from './parser';

class PagePen {
  constructor(el) {
    this.status = PEN_IDLE;
    this.el = el;
    this.astTree = buildAST(el);
    this.init();
    this.listen();
  }

  init() {
    let astNodes = this.astTree.children;
    let records = getStorage();
    let couples = this.getHighlighCouples(astNodes, records);
    
    for (let i = 0; i < couples.length; i++) {
      const [textNode, expression] = couples[i];
      this.highLightDOM(textNode, expression);
    }
  }

  listen() {
    let self = this;

    document.body.addEventListener('click', function(e){
      let node = e.target;
      debugger;
      if($.hasClass(node, 'select-zone')) {
        self.clearHighLight(node.parentElement, node);
      }
    });

    document.body.addEventListener('mousedown', function(e){
      status = PEN_DOWN;
    })
    document.body.addEventListener('mouseup', function(e){
      let selection = $.getSelection();
      let text = selection.toString().trim();

      if(text && text.length > 0) {
        self.status = PEN_UP;
        self.highLightSelection(selection);
      } else {
        self.status = PEN_IDLE;
      }
    })
  }

  highLightSelection(selection) {
    let text = selection.toString();

    this.highLightDOM(selection.anchorNode, [{from:selection.anchorOffset, len:text.length}]);
  }

  clearHighLight(parent, hlNode) {
    let textNode = $.createTextNode(hlNode.innerText);

    this.updateAstTree('remove', parent, hlNode, textNode);

    parent.insertBefore(textNode, hlNode);
    hlNode.remove();
  }

  getHighlighCouples(astNodes, records, collection=[]) {
    if(!records || records.length == 0) return [];
    
    for (let i = 0, j = 0; i < astNodes.length; i++) {
      const node = astNodes[i];
      if(node.el.nodeType == 3) {
        let record = records[j];
        let len = node.el.textContent.length;
        if(isNumber(record) && record == len) {
          j += 1;
          continue;
        } else {
          // isString or length not equal
          let lenSum = 0, jFrom = j;
          while(lenSum < len) {
            if(record==undefined){debugger;}
            lenSum += (typeof record == 'number') ? record : (isString(record) ? record.length : 0);
            j += 1;
            record = records[j];
          }
          if(lenSum > len) throw new Error('统计的长度和实际不一致');

          let hlSlices = [], pos = 0;

          for (let k = jFrom; k <= j-1; k++) {
            if( isString(records[k]) ) hlSlices.push({from:pos, len: records[k].length});
            pos += isString(records[k]) ? records[k].length : records[k];
          }
          collection.push([node.el, hlSlices])
        }

      } else if(node.children) {
        this.getHighlighCouples(node.children, records[j++], collection)
      }
    }
    return collection;
  }

  prepareDoms(node, hlSlices) {
    let hlMarks = hlSlices.map(d => d.from+','+(d.from+d.len));
    let dots = [0];

    for (let i = 0; i < hlSlices.length; i++) {
      const d = hlSlices[i];
      dots.push(d.from, d.from + d.len);      
    }
    dots.push(node.textContent.length)

    let sliceDoms = [];

    for (let i = 0; i < dots.length; i++) {
      let [from, to, ele] = [dots[i], dots[i+1]];
      let text = node.textContent.substring(from, to);

      if(from == to) continue;

      if(hlMarks.indexOf(from + ',' + to) != -1) {
        ele = $.createElement("span", "select-zone", text);
      } else {
        ele = $.createTextNode(text);
      }

      sliceDoms.push(ele);
    }
    return sliceDoms;
  }

  updateAstTree(type, ...args) {
    if(type == 'add') {
      this.astTree.addHl(...args)
    }
    if(type == 'remove') {
      this.astTree.removeHl(...args);
    }

    setStorage(simplify(this.astTree));
  }

  updateDoms(parent, textNode, sliceDoms) {
    for (let i = 0; i < sliceDoms.length; i++) {
      const dom = sliceDoms[i];
      parent.insertBefore(dom, textNode);
    }
    textNode.remove();
  }

  highLightDOM(textNode, hlSlices) {
    let parent = textNode.parentElement;
    
    if(parent.classList.contains('select-zone')) return;
    
    let sliceDoms = this.prepareDoms(textNode, hlSlices);

    this.updateAstTree('add', parent, textNode, sliceDoms);
    this.updateDoms(parent, textNode, sliceDoms);
  }
}

new PagePen(document.querySelector('article'));



import $ from './dom-helper';

class ASTNode {
  constructor(el) {
    this.el = el;
    this.children = [];
  }
  addChildren(nodes) {
    this.children.push(...nodes);
  }
  findAstNode(el) {
    let stack = [this];
    while(stack.length) {
      let cur = stack.shift();
      if(cur.el === el) return cur;
      else if(cur.children) stack.push(...cur.children);
    }
  }
  addHl(el, textNode, nodes) {
    let astNode = this.findAstNode(el);
    let index = astNode.children.findIndex(d => {
      return d.el.nodeType==3 && d.el == textNode;//.textContent.indexOf(text)!=-1
    });
    let newNodes = nodes.map(d => new ASTNode(d));
    astNode.children.splice(index,1, ...newNodes);
  }
  removeHl(el, hlNode, textNode) {
    let astNode = this.findAstNode(el);
    let index = astNode.children.findIndex(c => c.el === hlNode);
    if(index != -1) {
      astNode.children.splice(index, 1, new ASTNode(textNode))
    }
    else {
      throw new Error('not find ast node to be removed');
    }
  }
}

function buildAST(root) {
  let astNode = new ASTNode(root);
  let children = Array.prototype.map.call(root.childNodes || [], (node) => {
    return buildAST(node);
  })
  astNode.addChildren(children)
  return astNode;
}

function simplify(astNode) {
  let res;
  if(astNode.children.length) {
    res = [];
    astNode.children.forEach(d => {
      res.push(simplify(d));
    })
  } 
  // mark的文本
  else if(astNode.el.nodeType ==1 && $.hasClass(astNode.el, 'select-zone')) {
    return astNode.el.innerText
  }
  // 普通文本
  else {
    return astNode.el.textContent.length;
  }
  // console.log('after minimize:' + JSON.stringify(res));
  return res;
}

export {
  buildAST,
  simplify
};
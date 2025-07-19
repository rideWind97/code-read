/*
vue2 diff算法核心流程图（Mermaid格式）

flowchart TD
  A["开始：新旧子节点头尾指针"]
  A --> B["头头比：key是否相同？"]
  B -- 是 --> C["复用节点，头指针++"]
  B -- 否 --> D["尾尾比：key是否相同？"]
  D -- 是 --> E["复用节点，尾指针--"]
  D -- 否 --> F["查找key映射，复用或新建"]
  C --> G["指针交错？"]
  E --> G
  F --> G
  G -- 否 --> B
  G -- 是 --> H["插入剩余新节点，删除剩余旧节点"]
  H --> I["结束"]
*/

function diff(oldChildren, newChildren) {
  let oldStart = 0, oldEnd = oldChildren.length - 1;
  let newStart = 0, newEnd = newChildren.length - 1;
  while (oldStart <= oldEnd && newStart <= newEnd) {
    if (oldChildren[oldStart].key === newChildren[newStart].key) {
      // 头头比，复用
      patch(oldChildren[oldStart], newChildren[newStart]);
      oldStart++; newStart++;
    } else if (oldChildren[oldEnd].key === newChildren[newEnd].key) {
      // 尾尾比，复用
      patch(oldChildren[oldEnd], newChildren[newEnd]);
      oldEnd--; newEnd--;
    } else {
      // 其他情况，查找key复用或新建
      // ...省略
      newStart++;
    }
  }
  // 处理剩余新节点插入、旧节点删除
}


import { Dep } from "../reactive/reactive.js";

export function watch(obj, key, cb) {
  let oldVal = obj[key];

  function update() {
    const newVal = obj[key];
    cb(newVal, oldVal);
    oldVal = newVal;
  }

  Dep.target = { update };
  obj[key]; // 触发 getter，收集依赖
  Dep.target = null;
}

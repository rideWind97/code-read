// 简易计算属性实现，支持函数和对象两种写法
import { Dep } from "../reactive.js";

export function computed(options) {
  let getter, setter;
  if (typeof options === "function") {
    getter = options;
    setter = () => {};
  } else {
    getter = options.get;
    setter = options.set || (() => {});
  }

  let value;
  let dirty = true;

  // 依赖收集和缓存
  const runner = () => {
    if (dirty) {
      value = getter();
      dirty = false;
    }
    return value;
  };

  // 依赖响应，数据变更时重置缓存
  new WatcherProxy(getter, () => {
    dirty = true;
  });

  return {
    get value() {
      return runner();
    },
    set value(val) {
      setter(val);
    },
  };
}

// WatcherProxy用于依赖收集，类似Watcher但只做依赖追踪
function WatcherProxy(getter, cb) {
  Dep.target = { update: cb };
  getter();
  Dep.target = null;
}

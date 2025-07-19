// defineReactive：定义响应式属性
export function defineReactive(obj, key, val) {
  const dep = Dep();
  Object.defineProperty(obj, key, {
    get() {
      if (Dep.target) dep.depend();
      return val;
    },
    set(newVal) {
      if (newVal !== val) {
        val = newVal;
        dep.notify();
      }
    },
  });
}

// 1. 创建一个新的数组原型对象
const arrayProto = Array.prototype;
const arrayMethods = Object.create(arrayProto);

['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(method => {
  const original = arrayProto[method];
  arrayMethods[method] = function(...args) {
    const result = original.apply(this, args);
    // 这里应该有 dep 的引用，通知依赖更新
    this.__ob__ && this.__ob__.dep.notify();
    return result;
  };
});

// 2. Observer中处理数组
function Observer(obj) {
  if (Array.isArray(obj)) {
    obj.__proto__ = arrayMethods;
    // 对数组每一项递归observe
    obj.forEach(item => observe(item));
  } else {
    Object.keys(obj).forEach(key => {
      defineReactive(obj, key, obj[key]);
    });
  }
  // 给对象/数组加上__ob__属性，存放dep
  Object.defineProperty(obj, '__ob__', {
    value: { dep: Dep() },
    enumerable: false
  });
}

// observe：入口函数
export function observe(obj) {
  if (typeof obj !== "object" || obj === null) return;
  Observer(obj);
}

// Dep：依赖收集器
export function Dep() {
  let subs = [];
  return {
    depend() {
      if (Dep.target && !subs.includes(Dep.target)) {
        subs.push(Dep.target);
      }
    },
    notify() {
      subs.forEach((sub) => sub.update());
    },
  };
}
Dep.target = null;

// Watcher：订阅者
export function Watcher(obj, key, cb) {
  function update() {
    cb(obj[key]);
  }
  Dep.target = { update };
  obj[key]; // 触发getter收集依赖
  Dep.target = null;
}

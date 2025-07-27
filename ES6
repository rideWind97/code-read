# ES6 重点知识总结

## 1. 变量声明与作用域

```javascript
// let 和 const
let a = 1;        // 块级作用域，可重新赋值
const b = 2;      // 块级作用域，不可重新赋值
var c = 3;        // 函数作用域，存在变量提升

// 暂时性死区
console.log(typeof x); // ReferenceError
let x = 1;
```

## 2. 解构赋值

```javascript
// 数组解构
let [a, b, ...rest] = [1, 2, 3, 4, 5];
let [x = 1, y = 2] = [3]; // 默认值

// 对象解构
let {name, age, city = 'Unknown'} = {name: 'Alice', age: 25};
let {name: userName, age: userAge} = {name: 'Bob', age: 30}; // 重命名

// 嵌套解构
let {a: {b}} = {a: {b: 1}}; // b = 1
```

## 3. 字符串扩展

```javascript
// 模板字符串
let name = 'Alice';
let str = `Hello, ${name}! 换行
支持多行`;

// 标签模板
function highlight(strings, ...values) {
  return strings.reduce((result, string, i) => 
    result + string + (values[i] ? `<mark>${values[i]}</mark>` : ''), '');
}

let message = highlight`Hello, ${name}!`; // Hello, <mark>Alice</mark>!

// 新增方法
'hello'.startsWith('he');    // true
'hello'.endsWith('lo');      // true
'hello'.includes('ell');     // true
'hello'.repeat(3);           // hellohellohello
```

## 4. 函数扩展

```javascript
// 箭头函数
const add = (a, b) => a + b;
const square = x => x * x;
const greet = () => 'Hello';

// 参数默认值和剩余参数
function sum(a = 0, b = 0, ...numbers) {
  return numbers.reduce((acc, num) => acc + num, a + b);
}

// 扩展运算符
Math.max(...[1, 2, 3]); // 3
let arr = [...'hello']; // ['h', 'e', 'l', 'l', 'o']
```

## 5. 对象扩展

```javascript
// 属性简写
let name = 'Alice', age = 25;
let obj = {name, age, sayHello() { return 'Hello'; }};

// 计算属性名
let key = 'dynamicKey';
let obj2 = {[key]: 'value', [name + 'Age']: age};

// Object.assign()
Object.assign(target, source1, source2);

// 对象方法
Object.keys(obj);      // 获取键名数组
Object.values(obj);    // 获取值数组
Object.entries(obj);   // 获取键值对数组
Object.is(a, b);       // 严格比较
```

## 6. 数组扩展

```javascript
// Array.from() 和 Array.of()
Array.from('abc');           // ['a', 'b', 'c']
Array.from({length: 3});     // [undefined, undefined, undefined]
Array.of(1, 2, 3);           // [1, 2, 3]

// 新增方法
[1, 2, 3].find(x => x > 1);        // 2
[1, 2, 3].findIndex(x => x > 1);   // 1
[1, 2, 3].includes(2);             // true
[1, 2, 3].fill(0, 1, 2);           // [1, 0, 3]

// 扩展运算符
let arr1 = [1, 2];
let arr2 = [...arr1, 3, 4]; // [1, 2, 3, 4]
```

## 7. 类 (Class)

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }
  
  speak() {
    console.log(`${this.name} makes a sound`);
  }
  
  static getSpecies() {
    return 'Animal';
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }
  
  speak() {
    super.speak();
    console.log(`${this.name} barks`);
  }
  
  get description() {
    return `${this.name} is a ${this.breed}`;
  }
  
  set age(value) {
    this._age = value;
  }
}
```

## 8. 模块化

```javascript
// math.js (导出)
export const PI = 3.14;
export function add(a, b) { return a + b; }
export default class Calculator { /* ... */ }

// main.js (导入)
import Calculator, { PI, add } from './math.js';
import * as MathUtils from './math.js';
import('./math.js').then(module => { /* 动态导入 */ });
```

## 9. Promise

```javascript
// 创建 Promise
const promise = new Promise((resolve, reject) => {
  // 异步操作
  setTimeout(() => {
    Math.random() > 0.5 ? resolve('success') : reject('error');
  }, 1000);
});

// 使用 Promise
promise
  .then(result => console.log(result))
  .catch(error => console.error(error))
  .finally(() => console.log('完成'));

// 静态方法
Promise.all([p1, p2, p3]);       // 第一个失败则返回失败，所有都成功则返回成功
Promise.race([p1, p2, p3]);      // 第一个完成的，竞态
Promise.allSettled([p1, p2, p3]); // 等待所有完成
Promise.any([p1, p2, p3]);        // 第一个成功的返回成功，所有都失败则返回失败
```

## 10. async/await

```javascript
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('获取数据失败:', error);
    throw error;
  }
}

// 并行执行
async function parallelExecution() {
  const [users, posts, comments] = await Promise.all([
    fetch('/api/users').then(r => r.json()),
    fetch('/api/posts').then(r => r.json()),
    fetch('/api/comments').then(r => r.json())
  ]);
  return { users, posts, comments };
}
```

## 11. Set 和 Map

```javascript
// Set - 唯一值集合
let set = new Set([1, 2, 3, 3]);
set.add(4).add(5);
set.has(2);     // true
set.size;       // 5
set.delete(3);  // 删除元素
set.clear();    // 清空

// Map - 键值对集合
let map = new Map();
map.set('name', 'Alice');
map.set(1, 'number key');
map.get('name');    // 'Alice'
map.has('name');    // true
map.size;           // 2
map.delete('name'); // 删除
map.clear();        // 清空

// WeakSet 和 WeakMap
let weakSet = new WeakSet();
let obj = {};
weakSet.add(obj);
```

## 12. Symbol

```javascript
// 创建 Symbol
let sym1 = Symbol('description');
let sym2 = Symbol('description');
console.log(sym1 === sym2); // false

// 作为对象属性
let obj = {
  [sym1]: 'value',
  [Symbol.iterator]: function* () {
    yield 1; yield 2; yield 3;
  }
};

// 内置 Symbol
Symbol.iterator;    // 迭代器
Symbol.hasInstance; // instanceof
Symbol.toStringTag; // toString()
```

## 13. 迭代器和生成器

```javascript
// for...of 循环
for (let item of [1, 2, 3]) {
  console.log(item);
}

// 自定义迭代器
let obj = {
  *[Symbol.iterator]() {
    yield 1;
    yield 2;
    yield 3;
  }
};

// 生成器函数
function* gen() {
  yield 1;
  yield 2;
  return 3;
}

let g = gen();
g.next(); // {value: 1, done: false}
```

## 14. Proxy 和 Reflect

```javascript
// Proxy
let target = {};
let proxy = new Proxy(target, {
  get(target, property) {
    console.log(`获取属性 ${property}`);
    return target[property];
  },
  
  set(target, property, value) {
    console.log(`设置属性 ${property} = ${value}`);
    target[property] = value;
    return true;
  }
});

proxy.name = 'Alice'; // 设置属性 name = Alice
console.log(proxy.name); // 获取属性 name, Alice

// Reflect
Reflect.get(obj, 'name');
Reflect.set(obj, 'name', 'Bob');
Reflect.has(obj, 'name');
```

## 15. 其他重要特性

```javascript
// 数值扩展
Number.isNaN(NaN);      // true
Number.isFinite(123);   // true
Math.trunc(4.9);        // 4
Math.sign(-5);          // -1

// 字符串编码
'\u{1F600}';            // 😀
String.fromCodePoint(0x1F600); // 😀

// 正则表达式增强
let regex = /\p{Script=Han}+/gu; // Unicode 属性
'你好'.match(regex); // ['你好']

// 尾调用优化（理论）
function factorial(n, acc = 1) {
  if (n <= 1) return acc;
  return factorial(n - 1, n * acc); // 尾调用
}
```

## 核心要点总结

✅ **变量声明**: 使用 `let/const` 替代 `var`  
✅ **函数**: 箭头函数、默认参数、剩余参数  
✅ **对象**: 属性简写、计算属性名  
✅ **解构**: 数组和对象解构赋值  
✅ **字符串**: 模板字符串、标签模板  
✅ **类**: 现代面向对象语法  
✅ **模块**: 标准化模块系统  
✅ **异步**: Promise 和 async/await  
✅ **集合**: Set、Map、WeakSet、WeakMap  
✅ **迭代**: for...of、生成器、迭代器  

这些是 ES6 最核心和常用的特性，掌握它们可以显著提升 JavaScript 开发效率和代码质量。
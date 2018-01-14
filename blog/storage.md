# Web Storage

[w3c](https://www.w3.org/TR/webstorage/#dependencies)

## localStorage

+ 语法

  ```javascript
  // 读取
  data = localStorage.getItem('key')
  data = localStorage.key
  data = localStorage['key']
  key = localStorage.key(n)  // 获取第n个key
  length = localStorage.length // 获取key的个数
  // 写入
  localStorage.setItem('key', 'value')
  localStorage.key = 'value'
  localStorage[key] = 'value'
  // 删除
  localStorage.removeItem('key')
  localStorage.clear()  // 清空
  // 数据事件监听
  window.addEventListener('storage', event => {})
  ```
+ 特点

  + 满足同源策略，跨域不能共享
  + 多个session键共享数据，即在多个浏览器tab或浏览器窗口内共享一份数据
  + 不同浏览器之间不能共享数据，即满足同源的情况下，chrome、firefox之间不能共享
  + 满足同源策略的iframe可以共享数据，不满足同源策略的不能
  + storage事件只用于不同tab、窗口间通信，本tab(窗口)内数据变化不会触发
  + 数据持久有效，除非手动删除
  + `value`只能存储字符串，对于非字符类数据赋值则使用以下规则：

    + number, Array, Object, function 调用`toString`后存入
    + null 存入字符串 'null'
    + undefined 存入字符串 'undefined'

## sessionStorage

+ 语法

  ```javascript
  // 读取
  data = sessionStorage.getItem('key')
  data = sessionStorage.key
  data = sessionStorage['key']
  key = sessionStorage.key(n)  // 获取第n个key
  length = sessionStorage.length // 获取key的个数
  // 写入
  sessionStorage.setItem('key', 'value')
  sessionStorage.key = 'value'
  sessionStorage[key] = 'value'
  // 删除
  sessionStorage.removeItem('key')
  sessionStorage.clear()  // 清空
 ```
+ 特点

  + 满足同源策略，跨域不能共享
  + 多个session间不能共享数据，即在多个浏览器tab或浏览器窗口内数据相互独立
  + 不同浏览器之间不能共享数据，即满足同源的情况下，chrome、firefox之间不能共享
  + 满足同源策略的iframe可以共享数据，不满足同源策略的不能
  + 不能响应storage事件，因为本tab(窗口)内数据变化不会触发，不同tab(窗口)数据独立
  + 数据有效期是session事件，即关闭tab(窗口)数据销毁
  + `value`只能存储字符串，对于非字符类数据赋值则使用以下规则：

    + number, Array, Object, function 调用`toString`后存入
    + null 存入字符串 'null'
    + undefined 存入字符串 'undefined'



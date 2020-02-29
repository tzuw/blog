---
layout: post
title: "[更新中] Javascript-常用语法糖整理"
subtitle: "[Updating] Javascript-common-syntactic-sugar"
date: 2019-10-18 21:10:00
author: "tzuw"
header-img:  "public/assets/img/cement.png"
tags: [ES5, ES6, 语法糖, Syntactic-sugar, 学习笔记] 
categories: [前端, Javascript]
---

最近需要用到一些前端代码，所以赶紧来看看相关的语法糖，加速开发。

### this

在 js 的代码中，在没有任何知识的前提下，最让人费解的就是 var self = this; 这段代码了。后来了解到，它的出现其实和代码中的作用域有关：

- 在一个**对象内部**，this指向的是这个对象；
- 在普通函数内部，this指向的是 Window Object；
- 在没有被赋值给变量的匿名函数中，this 指向了 Window Object；
- 并且，在层叠函数中，内层函数会有新的作用域，this 的指向也会发生改变；

### .bind(this)

如果你觉得 var self = this; 太麻烦，每次还得多加一行，你也可以使用 .bind(this) 来达到一眼一样的目的。使用方法：

```javascript
var timer = {
  seconds: 0,
  // var self = this;
  start() {
    setInterval(function(){
      // self.seconds++
      this.seconds++
    }, 1000)
  }
}

timer.start()
setTimeout(function () {
  console.log(timer.seconds)
}.bind(this), 3500)

// the bind function 其实就是返回了一个带有 this 作用域的新的方法。
```



### 语法糖：箭头函数

箭头函数也可以有这个效果，匿名函数中的 this 不再指向 Window，而是指向声明它的对象。

```javascript
var timer = {
  seconds: 0,
  start() {
    setInterval(() => {
      this.seconds++
    }, 1000)
  }
}

timer.start()
setTimeout(function () {
  console.log(timer.seconds)
}, 3500)
```

### 语法糖：解构赋值

### 语法糖：剩余参数和拓展符

### 语法糖：模板字符串

### 语法糖：let & const 声明



### 参考资料

1. [**《Pratical Modern JavaScript》**](https://ponyfoo.com/books/practical-modern-javascript)
2. [**https://stackoverflow.com/questions/337878/var-self-this**](https://stackoverflow.com/questions/337878/var-self-this)
3. [https://segmentfault.com/a/1190000010159725](https://segmentfault.com/a/1190000010159725)
4. [https://pjchender.blogspot.com/2016/03/javascriptthisbug.html](https://pjchender.blogspot.com/2016/03/javascriptthisbug.html)
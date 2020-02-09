---
layout:       post
title:        "从 MutationObserver 开始"
subtitle:     "Start from MutationObserver"
date:         2020-02-08 11:11:00
author:       "tzuw"
header-style: text
tags:
    - MutationObserver 
---
![mutationObserver](/public/assets/img/in-post/mutationObserver.png)



本文阐述对一则 [stackoverflow](https://stackoverflow.com/a/38153639) 回答的理解。

### 前情提要

事情是这样的，在建站初fork的博客在标签云归档的地方使用了**[ jekyll-TeXt-theme](https://github.com/kitian616/jekyll-TeXt-theme)**，好死不死我想给归档加入一个分页的功能，并且还要再列表中每个文章标题的下面加入该文所包含的标签列表，而且标签还要带有超链接。如下图，

![mutationObserver](/public/assets/img/in-post/tag-cloud-example.png)



于是就需要将原先 js 代码控制的标签点击事件得到的 html 传入自建的 vue.js 的组件，以使用BootstrapVue 中的分页插件。据了解 [[1] ](https://stackoverflow.com/a/56067320)[[2]](https://github.com/sverrirs/jekyll-paginate-v2/issues/9) 这么的麻烦是因为，gh-pages所支持的插件 jekyll-pagination 版本没有支持对标签或类别的分页。[这里](https://pages.github.com/versions/)有一份 gh-pages 支持的插件版本。当然，下面也有人回答解决办法，但是我有看，却还没有懂 ... 



所以，又经过了一系列谷歌后，决定通过混合别的插件来实现分页的功能，即使用BootstrapVue中的组件。[组件的文档](https://bootstrap-vue.js.org/docs/components/pagination/)很全，但是要混合原来的代码使用的话，就需要将原先 每次由点击事件修改的文章标题列表注入 vue.js 中，以及了解 js 代码和 vue.js 代码如何互相交互。那就需要用到，基于 vue 中的 slot api，它的作用主要是在组件间传递 html 代码。



### 解决办法

原回答提供了两种方案在 vue 组件中监听 slot 变量的变化。

（1）使用 vue 来 $emit 事件

​		需要使用三个 vue 组件来控制，当一个 vue 组件中的 html 有修改，由一个专门触发事件的组件来触发 slot 值修改的事件，给另一个组件接收，以此来达到对 slot 值修改的监听。

（2）使用 MutationObserver

​		不需要两个vue组件，而是能够直接监听某部分html ( DOM tree ) 的修改。由于需要监听修改，并根据修改来修改 vue 组件的变量来是 BootstrapVue 进行分页操作，所以需要将 MutationObserver 放置在 vue.js 的 mounted 中进行监听，通常我们将组件被挂载后需要执行的代码放在那里。

------

另外，由于是将点击事件修改后的 html 传入 vue 组件进行分页，所以由此生成的html的标签按钮并没有在原来的点击事件的监听中，于是还需要重新绑定点击事件。这就涉及到需要等经过分页处理的 html 生成之后在进行绑定。原始的 js 代码使用了 $( document ).ready() 来实现，但是我实际在 vue 组件中使用时还是无法达到我要的效果。经过谷歌，window.onload() 事件和 (document).ready() 事件在 vue 组件中使用并不像在原来 js 代码中那样直接。于是，此处使用了 vue.js 的 updated [api](https://vuejs.org/v2/api/#updated)，通常我们将由变量修改所引起的 virtual DOM 变化后需要进行的操作放在那里。

综上，我将对原始代码的标签点击事件造成的 DOM tree 修改的监听放在 vue 组建的 mounted 里，使用 MutationObserver来监听；而在 vue 组件的 updated 中，重新绑定对修改后 DOM tree 中标签的点击事件。

​	

参考

1. [https://stackoverflow.com/questions/38148297/in-vue-js-can-a-component-detect-when-the-slot-content-changes/38153639#38153639](https://stackoverflow.com/questions/38148297/in-vue-js-can-a-component-detect-when-the-slot-content-changes/38153639#38153639)
2. [https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)
3. [https://javascript.ruanyifeng.com/dom/mutationobserver.html](https://javascript.ruanyifeng.com/dom/mutationobserver.html)
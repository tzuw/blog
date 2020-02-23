---
layout: post
title: "Java中反序列化带有Iterable类型field的对象"
subtitle: "Deserialzing a instance contained a Iterable field in Java"
date: 2019-10-01 20:50:00
author: "tzuw"
header-img:  "public/assets/img/cement.png"
tags: [反序列化, iterable, 学习笔记] 
categories: [Java]
---

### 前情提要

为了不让外部的调用能改变实例的属性，所以考虑反序列化带有 Iterable 属性的对象。当然，除了如此方法，还有。。。





### 解决方法

将反序列化逻辑封装在自定义的 deserializer 

将变量类型设置为 ImmutableList

将变量类型设置为 List，而在 getter 方法返回 Iterable

将变量类型设置为 List，getter方法返回Collection.unmodifiable
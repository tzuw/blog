---
layout: post
title: "ElasticSearch父子文档结构 vs. Nested 结构"
subtitle: "Parent-Child Structure vs. Nested Structure"
date: 2019-12-08 21:17:00
author: "tzuw"
header-img:  "img/cement.png"
tags: [ES, MySQL, 学习笔记]
categories: [ElasticSearch, 中间件]
---

MySQL的相似字符串查找 "LIKE %keyword%" 是一个全表的操作，检索效率差，除非你将数据取出放在内存备用。但是随着数据量的上升，内存将无法负荷，MySQL的強項本就是在事務處理而不是數據檢索。搜尋引擎中間件的強項才是檢索。

ElasticSearch 作为一个基于 Lucene 的分布式搜寻引擎已然是一个热门的大数据分析中间件。Lucene 是Apache下一個全文檢索和搜尋的開放原始碼程式庫。

下面介绍 ES 中的两种数据结构。

### 父子文档结构

可以理解為关系型数据库中的一对多关系，一个父文档可以对应多个子文档。

-   Join类型用于描述一对多的关系



### Nested 结构



### 对比图

来源: rockybean 教程

![](/blog/img/in-post/es-parent-child-vs-nested.png)

### 参考资料

1. [https://zhuanlan.zhihu.com/p/32112952](https://zhuanlan.zhihu.com/p/32112952)
2. [https://www.elastic.co/guide/cn/elasticsearch/guide/current/parent-child.html](https://www.elastic.co/guide/cn/elasticsearch/guide/current/parent-child.html)
3. [https://blog.csdn.net/laoyang360/article/details/82950393](https://blog.csdn.net/laoyang360/article/details/82950393)
4. [https://blog.csdn.net/u010454030/article/details/77840606](https://blog.csdn.net/u010454030/article/details/77840606)
5. [https://discuss.elastic.co/t/choosing-parent-child-vs-nested-document/6742](https://discuss.elastic.co/t/choosing-parent-child-vs-nested-document/6742)
6. [https://stackoverflow.com/questions/49941244/elastic-search-parent-child-vs-nested-document](https://stackoverflow.com/questions/49941244/elastic-search-parent-child-vs-nested-document)
7. [https://discuss.elastic.co/t/choosing-parent-child-vs-nested-document/6742](https://discuss.elastic.co/t/choosing-parent-child-vs-nested-document/6742)

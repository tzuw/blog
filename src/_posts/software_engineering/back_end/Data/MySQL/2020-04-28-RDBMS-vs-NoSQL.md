---
layout: post
title: "RDBMS vs NoSQL"
subtitle: "MySQL vs NoSQL"
date: 2020-04-28 11:10:00
catalog: true
author: "tzuw"
header-img:  "img/cement.png"
tags: [MySQL, RDBMS, NoSQL, data warehouse] 
categories: [資料倉儲]
---

>   RDBMS 和 NoSQL 適用於不用的需求/場景，這可以從大數據時代的演變角度進行解讀。原本 RDBMS 的主要功能是，能夠正確的、同步的的處理具有特定結構的數據。 而現在隨著數據的產生速度加快，數據量也激增。新的功能需求因應而生，新的需求是希望數據庫能處理高速產生的大量數據，而不在特別需要做到同步和零錯誤。



### # RDBMS

RDBMS 的全名是關聯式數據庫管理系統，它一般會使用 ER 模型進行建模，即需要維護资料之間的關係，並需要在資料保存之前就決定 Schema。此外，RDBMS 有兩個比較重要的概念。

（1）RDBMS 通常會使用**正規化**技術來避免不同資料表儲存重複的資訊。

（2）使用 Transation 即機制來保證數據的一致性。（Atomicity, Consistency, Isolation, Durability)



| id    | name           | country   | email                |
| ----- | -------------- | --------- | -------------------- |
| SP001 | 人民郵電出版社 | Australia | feedback@renming.com |

| ISBN          | title               | author      | format | price | publisher_id |
| ------------- | ------------------- | ----------- | ------ | ----- | ------------ |
| 9780992461225 | 數據挖掘 概念與技術 | Jiawei Han  | ebook  | 79.00 | SP001        |
| 9780994182654 | 高效能程序員的訓練  | Jeff Atwood | ebook  | 59.00 | SP001        |



### # NoSQL

NoSQL 的全名為 Not Only SQL。可以說 SQL 是精確的，而 NoSQL 是多變的 (Schema-free)。

MongoDB Sharding 分散式儲存架構建置 (概念篇)

它們可以這樣理解。首先，"不止" SQL 指的是業務中可以混用 RDBMS 和 NoSQL 來達成最佳的儲存效果。第二點，指的是 NoSQL 擁有水平擴展的能力。比如，MongoDB 中的 Sharding 分片技術就可以達到擴展的目的，可以說 NoSQL 的設計就是**為叢集執行而生的**。在另一篇學習筆記裡面會詳細介紹。第三，NoSQL 是多變的。當你需要修改 schema 時會需要自行遍歷數據庫，或者只在數據又被讀取時在進行修改。第四，相較於 Transaction 機制，NoSQL 則採用了 CAP 機制 (Consistency, Availiablity, Partition Tolerance) 。然而，由於不可能同時滿足三個要求 (願望) ，當有分片的情況下，MongoDB 選擇了 C (Eventually Consistency) 和 P。[ref](https://www.quora.com/Why-doesnt-MongoDB-have-availability-in-the-CAP-theorem) [ref](https://www.ithome.com.tw/news/92506)

最後，"成熟度不足，版本升級風險高" 這個部分應該已經沒有了。「畢竟我看的這篇筆記是 10 年前寫的哈。」



```json
// 文檔型
{
  ISBN: 9780992461225,
  title: "數據挖掘 概念與技術",
  author: "Jiawei Han",
  format: "ebook",
  price: 79.00
}

{
  ISBN: 9780992461225,
  title: "數據挖掘 概念與技術",
  author: "Jiawei Han",
  year: 2012,
  format: "ebook",
  price: 79.00,
  description: "Learn JavaScript from scratch!",
  rating: "5/5",
  review: [
    { name: "美國CHOICE雜誌", text: "這是一本非常優秀的數據挖掘教材。" },
    { name: "Computing Reviews", text: "最新的第三版反映了數據挖掘領域的最新發展和變化。" }
  ]
}
```



NoSQL 大致有下面幾種類型：

**列模型**：在一列中存储所有相關的数据。它的特點是，查詢快，插入、更新慢。是 DSS（决策支持系统）、BI 的优秀選擇。一般使用在数据集市和数据仓库，適合批量數據處理和及時查詢，但不適合事務處理。典型的有 C-Store，Vertica， Sybase IQ。

**鍵值對模型**：数据按照键值对的形式进行组织。适合不涉及过多数据关系业务关系的业务数据。典型的鍵值對模型數據庫有 cassandra、 HBase、Redis。~~有時間可以學習學習。~~

**文檔類模型**：一般保存半结构化内容，采用 JSON 或类似的方式描述数据。**和 RDBMS 相比，文檔類模型支持數據的嵌套結構；和鍵值模型相比，文檔類模型支持搜尋嵌套對象。**典型的有 MongoBD、CouchDB等。它將每一筆資料都當成一個文件 (每個文件的結構可以不一樣)。 [ref](https://blog.csdn.net/dellme99/article/details/16968979)「什麼，MongoDB 對 SQL 和 ACID 特性也是支持的哦。」「BASE 原則」



### # SQL(RDBMS) vs. NoSQL

主流的 RDBMS 有 Oracle，MySQL，PostgreSQL，Microsoft SQLServer，使用場景：具有事務需求的系統 (銀行/購物平台)。

主流的 NoSQL 有 MongoDB (面向文檔)、Cassandra、HBase (面向列)。使用場景：文檔類模型、列模型適用於保存日誌。即通常用來存一些結構不固定的數據。

不同點：

-   No JOIN in NoSQL

-   ACID vs. CAP

-   schema vs. schema-free

-   Normalization vs. Denormalization

    MySQL 的 Normalization 可以有效地降低冗餘數據；NoSQL 中的 Denormalization 會使查詢速度變快，但在更新多筆數據時就會變慢。多數的文檔型 NoSQL 採用 Denormalization 的方式來存儲資料。

```json
// Normalization
{
  ISBN: 9780992461225,
  title: "數據挖掘 概念與技術",
  author: "Jiawei Han",
  format: "ebook",
  price: 79.00,
  publisher_id: "SP001"
}

{
  id: "SP001"
  name: "人民郵電出版社",
  country: "USA",
  email: "feedback@renming.com"
}


// Denormalization
{
  ISBN: 9780992461225,
  title: "數據挖掘 概念與技術",
  author: "Jiawei Han",
  format: "ebook",
  price: 29.00,
  publisher: {
    name: "人民郵電出版社",
    country: "USA",
    email: "feedback@renming.com"
  }
}
```

（3）集群

MySQL 在大規模集群上幾乎沒有成功的案例；而 NoSQL 則在集群方面的擴展性很強。



### 參考資料

-   [[1]](https://www.cnblogs.com/beilin/p/6007080.html)  [[2]](https://www.cnblogs.com/beilin/p/5981870.html)  裡面談了關係型數據庫和非關係型數據庫的對比。
-   [[3]](https://shininglionking.blogspot.com/2018/04/rdbms-vs-nosql.html)  RDBMS v.s. NoSQL  ([邁向王者的旅途](https://shininglionking.blogspot.com/))
-   [SQL vs NoSQL: The Differences](https://www.kshuang.xyz/doku.php/database:sql_vs_nosql)
-   [[4]](https://www.tamr.com/blog/rdbms-vs-nosql-data-flexibility/) 這篇總結的不錯。
-   [[5]](https://www.ithome.com.tw/news/92506)  [[6]](https://dotblogs.com.tw/explooosion/2018/01/21/040728)  MongoDB 安裝教學
-   [[7]](https://kknews.cc/zh-tw/code/8oao9aq.html)  [[8]](https://www.infoq.cn/article/2014/01/nosql-vs-rdbms)  [NoSQL型別介紹及適用場景](https://codertw.com/%E7%A8%8B%E5%BC%8F%E8%AA%9E%E8%A8%80/556428/)  使用場景
-   [MongoDB 學習筆記之一 - 從 NoSQL 談起](http://garyliutw.blogspot.com/2014/05/mongodb-nosql.html)  (網路技術趨勢觀測站)
-   [SQL vs NoSQL: The Differences](https://www.kshuang.xyz/doku.php/database:sql_vs_nosql)  裡面有一些例子 (資訊人筆記)
-   https://tw.alphacamp.co/blog/sql-nosql-database-dbms-introduction 這裡面居然有題目做。(alphacamp)
-   [後端基礎：資料庫 NoSQL、transaction、ACID 與 Lock](https://medium.com/@hugh_Program_learning_diary_Js/%E5%BE%8C%E7%AB%AF%E5%9F%BA%E7%A4%8E-%E8%B3%87%E6%96%99%E5%BA%AB-nosql-transaction-acid-%E8%88%87-lock-882f3079fd3d)  進階


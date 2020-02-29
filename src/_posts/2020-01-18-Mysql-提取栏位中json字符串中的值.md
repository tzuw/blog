---
layout: post
title: "Mysql提取json中的数据-笔记"
subtitle: "extracting data from json string in Mysql"
date: 2020-01-18 21:10:00
author: "tzuw"
header-img:  "public/assets/img/cement.png"
tags: [json_extract, 学习笔记] 
categories: [MySQL]
---

MySQL的功能还是很强大的，竟可以在 select 的同时解析 json 字符串，从中提取所需要的数据。恰好用到相关 api 来处理 嵌套 json 和 json 嵌套 json array 的情况，所以下面简单记录下 api 的使用方法，大多数内容是从[官网](https://dev.mysql.com/doc/refman/5.7/en/json.html)整理而来。（因为有些东西它可能用一次，然后就会忘记了。）

table_name = my_table

|  id  |  sample_json_str  |
| :--: | :---------------: |
|  1   | sample_json_str_1 |
|  2   | sample_json_str_2 |



```json
// 纯捏造范例数据 sample_json_str
{
  "source": "contact_book_female_middle_school",
  "dates": {
    "expired": "2025-09-11",
    "updated": "2019-09-11",
    "created": "unknown"
  },
  "info": [{
      "name": "Lisa",
      "gender": "woman",
      "address": {
        "city": "上海",
        "country": "small_country",
        "road": "small_road"
      },
      "phone_numbers": {
        "home": [1234, 5678],
        "work": [9101112, 13141516]
      },
      "nicknames": ["Lis", "Liz", "Lizzy", "Lili"]
    },
    {
      "name": "Mary",
      "gender": "woman",
      "address": {
        "city": "北京",
        "country": "mountain_country",
        "road": "mountain_road"
      },
      "phone_numbers": {
        "home": [1234, 5678, 12345678],
        "work": [1314, 520]
      },
      "nicknames": ["Mary", "Mae", "May", "Maria"]
    }]
}

```



需要将数据提取出来变成： sheet_name = "contact", col = [ name, nickname1, nickname2, ... , gender, address_concated, phone_number_home1, phone_number_home2, ... , phone_number_work1, ... , phone_number2, ... , ]

```mysql
SELECT id,
	json_extract( t.sample_json_str, '$.source' ) AS name,
	json_extract( t.sample_json_str, '$.dates.expired' ) AS expired_date,
	json_extract( t.sample_json_str, '$.dates.created' ) AS created_date,
	 
	-- 需要提取 name-city-phoneNumberWork 格式的数据
  REPLACE(REPLACE(REPLACE(REPLACE(
     JSON_EXTRACT(`contacts`, '$.info[0].name', '$.info[0].address.city',
          '$.info[0].phone_numbers.work[0]'),
          '[', ''), ']', ''), '\"', ''), ', ', '-') AS first_girl_infos,

  -- 字符串替换 woman->girl, man->boy
  CASE 
  	WHEN JSON_EXTRACT(`contacts`, '$.info[0].gender') = 'woman' THEN 'girl'
  	WHEN JSON_EXTRACT(`contacts`, '$.info[0].gender') = 'man' THEN 'boy'
  	ELSE 'UNK'
  END AS gender
        
FROM my_table;
	
-- demo: https://rextester.com/OUQFX46681
```



**划重点**

- '$**.target_field' 代表满足 key=target_field 的任意路径

- 仍然存在的问题：

  - 只取了第一个 gril 的信息出来，若里面每个 girl 都要取，数据无法按行排并且也无法事先知道有几个。

  - 两列中的 array 数据可以做 element-wise 拼接？

    - CONCAT() 能直接拼接两列字符串数据，例如：

      ```mysql
      SELECT CONCAT(`name`, ' ', `email`) as password_email FROM `table`;
      ```

    - Python 里面的 numpy 可以实现
    - MySQL 无法实现，比较正确的做法应该使用多张表，然后建立外键来关联。况且MySQL也并没有 Array 这种数据形态。
      - 相关参考资料
        - https://stackoverflow.com/questions/17371639/how-to-store-arrays-in-mysql 建议不要使用array
        - https://dba.stackexchange.com/questions/252554/storing-arrays-in-mysql
        - https://makitweb.com/how-to-store-array-in-mysql-with-php/

    

**参考资料**

- https://dev.mysql.com/doc/refman/8.0/en/comments.html
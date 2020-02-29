---
layout: post
title: "Java中反序列化带有Iterable类型field的对象?"
subtitle: "Shouldn't deserialzing a instance contained a Iterable field in Java"
date: 2019-10-01 20:50:00
author: "tzuw"
header-img:  "public/assets/img/cement.png"
tags: [反序列化, Iterable, 学习笔记] 
categories: [Java]
---

### 前情提要

```Java
Device sampleDevice = JSON.parseObject(str1, Device.class);
```

在使用 fastjson 将字符串直接反序列化 Java 对象的时候（而不是通过 JSON 一个 feild 一个 feild 的解析来构造 pojo，遇到复杂对象会很难让人看懂代码写的是啥），遇到了报错:

```java
Exception in thread "main" com.alibaba.fastjson.JSONException: syntax error, expect {, actual [, pos 105, fieldName fun, fastjson-version 1.2.47
	at com.alibaba.fastjson.parser.deserializer.JavaBeanDeserializer.deserialze(JavaBeanDeserializer.java:451)
	at com.alibaba.fastjson.parser.deserializer.JavaBeanDeserializer.deserialze(JavaBeanDeserializer.java:271)
	at com.alibaba.fastjson.parser.deserializer.JavaBeanDeserializer.deserialze(JavaBeanDeserializer.java:267)
	at com.alibaba.fastjson.parser.DefaultJSONParser.parseObject(DefaultJSONParser.java:661)
	at com.alibaba.fastjson.parser.deserializer.MapDeserializer.parseMap(MapDeserializer.java:192)
	at com.alibaba.fastjson.parser.deserializer.MapDeserializer.deserialze(MapDeserializer.java:59)
	at com.alibaba.fastjson.parser.deserializer.MapDeserializer.deserialze(MapDeserializer.java:41)
	at com.alibaba.fastjson.parser.deserializer.FastjsonASMDeserializer_1_Device.deserialze(Unknown Source)
	at com.alibaba.fastjson.parser.deserializer.JavaBeanDeserializer.deserialze(JavaBeanDeserializer.java:267)
	at com.alibaba.fastjson.parser.DefaultJSONParser.parseObject(DefaultJSONParser.java:661)
	at com.alibaba.fastjson.JSON.parseObject(JSON.java:365)
	at com.alibaba.fastjson.JSON.parseObject(JSON.java:269)
	at com.alibaba.fastjson.JSON.parseObject(JSON.java:488)
	at serialization_tutorial.main.main(main.java:53)

Process finished with exit code 1

```



意思大概是 fieldName fun 里面的数据无法正常解析，这是因为 fun 所对应的数据形态是一个 Iterable，导致 fastjson 无法解析。范例代码如下：

```java
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Device {
	@Getter
	@Setter
	private String deviceNo;

	@Getter
	@Setter
	private GradeWithValue grade;

	@Getter
	@Setter
	private Status Status;

	@Getter
	@Setter
	private String description;

	@Getter
	@Setter
	private Timezone timeZone;

	@Getter
	@Setter
	//	@JSONField(serializeUsing=SupportAppNamesCodec.class, deserializeUsing=SupportAppNamesCodec.class)
	private HashMap<String, Iterator<AppName>> supportAppNames;

	public Device (String deviceNo, GradeWithValue grade) {
		this.deviceNo = deviceNo;
		this.grade = grade;
	}
}
```



### 解决方法

1. 将反序列化逻辑封装在自定义的 deserializer 和 serializer，并通过注解指定 fastjson 在序列化/反序列化的时候使用的工具类。这种方法代码需根据实际业务修改，只是将原本的 JSON 字符串反序列化操作进行封装，代码无法复用。

   ```java
   @JSONField(serializeUsing=SupportAppNamesCodec.class, deserializeUsing=SupportAppNamesCodec.class)
   ```

2. 在类中添加某个 List 属性时，为了不让调用者直接通过引用修改数据，所以将 get 方法设计成返回一个不可变集合

   - 返回 Iterable (记得要 disable the remove api, 其实就是 Collections.unmodifiableList) ，或者 Enumeration

     在类中添加某个 List 属性时，为了不让调用者进行修改，所以在该属性的 get 方法时实际返回的是一个 Iterable，即 List 所实现的一个接口，get 方法封装了类对于该属性的实现。因为 Iterable 接口中方法只包含用于遍历的相关方法，不包含改变内部元素的方法。如果 get 方法返回的是 List 类型，那么就暴露了类使用 List 来储存该属性，并且调用者可以简单地通过得到的 List 对象来对类实例的内部数据进行修改，容易发生危险的事情。

   - 返回 java.util.Collections.unmodifiableList，在下面的 [stackexchange](https://softwareengineering.stackexchange.com/questions/316234/how-to-design-an-iterable-but-immutable-read-only-collection) 里有说明。当一下搬运工。

     ```Java
     public class Event {
     
       private List<Player> players;
     
       public List<Player> getPlayers() {
         return Collections.unmodifiableList(players);
       }
     
       public void addPlayer(Player p) {
         players.add(p);
       }
     }
     ```

   - 返回 Guava's [com.google.common.collect.ImmutableList](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/collect/ImmutableList.html) (进一步保证了 thread-safe)

     ```Java
     	public ImmutableList<Timezone> getSupportedTimezone() {
     		return ImmutableList.copyOf(supportedTimezone);
     	}
     ```
  
     另外，fastJson 不支持直接反序列化 ImmutableList。[[3]](https://github.com/alibaba/fastjson/issues/1907 )
     
     ```java
     Exception in thread "main" com.alibaba.fastjson.JSONException: create instance error, class com.google.common.collect.ImmutableList
     	at com.alibaba.fastjson.util.TypeUtils.createCollection(TypeUtils.java:2082)
     	at com.alibaba.fastjson.parser.deserializer.FastjsonASMDeserializer_2_AppName.deserialze(Unknown Source)
     	at com.alibaba.fastjson.parser.deserializer.JavaBeanDeserializer.deserialze(JavaBeanDeserializer.java:267)
     	at com.alibaba.fastjson.parser.DefaultJSONParser.parseArray(DefaultJSONParser.java:747)
     	at com.alibaba.fastjson.serializer.CollectionCodec.deserialze(CollectionCodec.java:129)
     	at com.alibaba.fastjson.parser.DefaultJSONParser.parseObject(DefaultJSONParser.java:661)
     	at com.alibaba.fastjson.parser.deserializer.MapDeserializer.parseMap(MapDeserializer.java:192)
     	at com.alibaba.fastjson.parser.deserializer.MapDeserializer.deserialze(MapDeserializer.java:59)
     	at com.alibaba.fastjson.parser.deserializer.MapDeserializer.deserialze(MapDeserializer.java:41)
     	at com.alibaba.fastjson.parser.deserializer.DefaultFieldDeserializer.parseField(DefaultFieldDeserializer.java:86)
     	at com.alibaba.fastjson.parser.deserializer.JavaBeanDeserializer.parseField(JavaBeanDeserializer.java:1078)
     	at com.alibaba.fastjson.parser.deserializer.JavaBeanDeserializer.deserialze(JavaBeanDeserializer.java:773)
     	at com.alibaba.fastjson.parser.deserializer.JavaBeanDeserializer.parseRest(JavaBeanDeserializer.java:1283)
     	at com.alibaba.fastjson.parser.deserializer.FastjsonASMDeserializer_1_Device.deserialze(Unknown Source)
     	at com.alibaba.fastjson.parser.deserializer.JavaBeanDeserializer.deserialze(JavaBeanDeserializer.java:267)
     	at com.alibaba.fastjson.parser.DefaultJSONParser.parseObject(DefaultJSONParser.java:661)
     	at com.alibaba.fastjson.JSON.parseObject(JSON.java:365)
     	at com.alibaba.fastjson.JSON.parseObject(JSON.java:269)
     	at com.alibaba.fastjson.JSON.parseObject(JSON.java:488)
     	at serialization_tutorial.main.main(main.java:54)
      
     Process finished with exit code 1  
     ```

### 结论

不要对 Iterable、ImmutableList 进行反序列化，非常反人类。直接在 get 方法返回你想要的数据形态就可以啦~ fastJson 解析 json 字符串的时候是首先根据 set 方法的数据形态，然后根据 field 的数据形态来决定的，而 get 方法貌似只要能正常得到数据都是可以的。

### 参考资料

1. [https://softwareengineering.stackexchange.com/questions/316234/how-to-design-an-iterable-but-immutable-read-only-collection](https://softwareengineering.stackexchange.com/questions/316234/how-to-design-an-iterable-but-immutable-read-only-collection)
2. [https://softwareengineering.stackexchange.com/questions/318696/should-i-return-iterable-or-enumeration-in-java](https://softwareengineering.stackexchange.com/questions/318696/should-i-return-iterable-or-enumeration-in-java)
3. [https://github.com/alibaba/fastjson/issues/1907](https://github.com/alibaba/fastjson/issues/1907)
4. [https://czjxy881.github.io/踩坑经验/一个-FastJSON-反序列化泛型的问题/](https://czjxy881.github.io/踩坑经验/一个-FastJSON-反序列化泛型的问题/)
5. [https://juejin.im/post/5afa250ef265da0b7e0c6636](https://juejin.im/post/5afa250ef265da0b7e0c6636)


---
title: "Singleton模式"
subtitle: "Singleton mode"
layout: post
author: "tzuw"
date: 2020-03-07 16:22:00
tags: [学习笔记, 设计模式, Singleton pattern, lazy initialization, volatile, synchronized, JVM]
categories: [软件工程]
---

单例模式：保证类只会产生一个物件，并提供存取该类的统一方法。

它除了在教科书或者面试时会被提到之外，在程序中共享同某个数据库的连接实例、共享内存中的某个数据缓存，也就是在需要共享资源的时候，单例模式会被使用。



### 实现方式



按加载时机可以分为：饿汉方式和懒汉方式；按实现的方式，有：双重检查加锁，内部类方式和枚举方式。[ref](https://zhuanlan.zhihu.com/p/25733866)



```java
// 懒汉式 懒加载 lazy initialization
// 比较错误的方式。怕抢占资源而使用了 synchronized 关键字，但是其实它只在第一次创建实例的时候起到了作用。
public class Singleton {
  private Singleton() {}
  
  private static Singleton instance;
  
  public static synchronized Singleton getInstance() {
    if (instance == null) {
      instance = new Singleton();
    }
    return instance;
  }
}
```

```java
// 双重检验锁 （懒汉式 懒加载 lazy initialization）
// 因为懒汉式的 synchronized 关键字只在第一个进入需要，
// 所以衍生出同步块加锁的方式，并且同步块内外都需要检验。
// 但是，instance = new Singleton(); 并不是一个原子操作
// volatile 关键字：确保了变量的可见性，赋新值对其他线程立即可见。
// 「先行发生原则」，即对于一个 volatile 变量的写操作都会先发生于后面对这个变量的读操作。[3]
// sychronized 同步块
public class Singleton {
  private Singleton() {}
  
  private volatile static Singleton instance;
  
  public Singleton getInstance() {
    if (instance == null) {
      sychronized(Singleton.class) {
        if (instance == null) {
          instance = new Singleton();
        }
      }
    }
    return instance;
  }
}
```

```java
// 饿汉式 eager initialization
// 不是懒加载
public class Singleton {
  private Singleton() {}
  
  // 创建对象的时候就创建实例，因此是线程安全的
  private static Singleton instance = new Singleton();
    
  public static Singleton getInstance() {
    return instance;
  }
}
```

```java
// 静态内部类
// 是懒加载
// 《Effective Java》中提到的推荐方法
public class Singleton {
  private Singleton() {}
  
  private static class Holder {
    private static Singleton instance = new Singleton();
  }
  
  public static Singleton getInstance() {
    return Holder.instance;
  }
}
```

```java
// 枚举 enum
// 即是使用反射机制也无法多次实例化一个枚举变量 [6]
// 《Effective Java》中提到的推荐方法
public enum Singleton {
  instance;
  
  private Singleton() {}
  
  public void print() {
    System.out.println(" Hello Singleton ! ")
  }
  
  public static void main(String[] args) {
    Singleton singleton = Singleton.instance;
    
    instance.print();
  }
}
```



### 更好的、更简单、线程安全的

>   没有错，我们需要一个拥有上述条件的单例模式实现方法。

我感觉在没有懒加载的需求的前提下，**饿汉式实现方法**最直接地能够满足条件。

如果有懒加载需求，那么可以考虑内部静态类，或者枚举类的实现方式。

**内部静态类：**

静态内部类在外部类被加载时时不会被加载的，除非它的某个静态成员变量/方法，或者构造器被调用的时候才会被加载。

而且通过反射是不能从外部类获取内部类的属性的。*

所以这种实现方式既满足线程安全（使用内部类的就初始化），且又是懒加载的。

**枚举类：** [6]

枚举类本身就是默认线程安全的。而且还能防止反序列化造成可以重新创建新实例的情况。



### 不要使用单例模式

>   Don't use Singleton pattern.

公司的大佬说，大家老是使用 Singleton，但是其实它存在很多不好的地方。我们应该在非必要的时候避免去使用它。

然后我们就照着做了。

大佬说：「单例模式会导致代码耦合性增加，并且使设计测试用例更加的困难。」[5]

單例導致了類之間的強耦合，並且在寫測試用例的時候，也會難以用一個模擬對象來進行測試。

單例的優點在於減少系統的內存開銷，並且避免了資源的多重佔用。

而他的缺點在於：擴展困難，測試困難。並且還容易引发內存洩漏。



### 遇到的关键词

[先行发生原则](https://www.cnblogs.com/plxx/p/4376205.html) : 先行发生是 Java 内存模型中定义的两项操作之间的偏序关系。如果说操作 A 先行发生于操作 B ，其实就是说在发生操作 B 之前，操作 A 产生的影响被操作 B 察觉。

[懒加载/延迟初始化](https://www.cnblogs.com/kavlez/p/lazy-init.html)



### 参考资料

1.  [http://web.archive.org/web/20120509021223/http://en.wikipedia.org/wiki/Singleton_pattern](http://web.archive.org/web/20120509021223/http://en.wikipedia.org/wiki/Singleton_pattern)

2.  [https://medium.com/better-programming/what-is-a-singleton-2dc38ca08e92](https://medium.com/better-programming/what-is-a-singleton-2dc38ca08e92)

3.  [http://wuchong.me/blog/2014/08/28/how-to-correctly-write-singleton-pattern/](http://wuchong.me/blog/2014/08/28/how-to-correctly-write-singleton-pattern/)

4.  [https://softwareengineering.stackexchange.com/questions/235527/when-to-use-a-singleton-and-when-to-use-a-static-class](https://softwareengineering.stackexchange.com/questions/235527/when-to-use-a-singleton-and-when-to-use-a-static-class) *

    Singleton vs. static class, when is the time to use it ? 

5.  [https://softwareengineering.stackexchange.com/questions/40373/so-singletons-are-bad-then-what/40610#40610](https://softwareengineering.stackexchange.com/questions/40373/so-singletons-are-bad-then-what/40610#40610) *

    单例模式会导致代码耦合性增加，并且使设计测试用例更加的困难。

6.  [https://blog.csdn.net/u011595939/article/details/79972371#4%E9%9D%99%E6%80%81%E5%86%85%E9%83%A8%E7%B1%BB%E6%96%B9%E5%BC%8F%E6%8E%A8%E8%8D%90](https://blog.csdn.net/u011595939/article/details/79972371#4静态内部类方式推荐) *

7.  [https://juejin.im/post/5de5c661e51d452515148078](https://juejin.im/post/5de5c661e51d452515148078) *

    如何避免单例模式被破解。

    通过 Java 的反射机制和序列化和反序列化，可以破解除了枚举实现方式之外的单例模式实现，当然也可以被预防。


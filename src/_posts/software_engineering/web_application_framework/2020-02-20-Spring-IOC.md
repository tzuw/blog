---
layout: post
title: "Sping - Inversion of Control - 笔记"
subtitle: "Learning Sping IOC"
date: 2020-02-18 21:10:00
author: "tzuw"
header-img:  "img/cement.png"
tags: [configuration, 反射机制, Spring-IOC, IOC, 反转控制, DI, 依赖注入, 学习笔记] 
categories: [Java, Spring]
---

### Java 反射机制

使得程序在**运行时**，对于任意一个类都能够知道这个类的所有属性和方法；对于任意一个对象，都能够调用它的任意的方法和属性（包括私有属性和方法）。

这是一种动态获取信息，动态调用对象的方法。

举例而言，

```java
// Employee.java
public class Employee {
  public String name;
  
  public int age;
  
 	public void printEmployeeName() {}
}

// CoffeeMaker.java
public class CoffeeMaker extends Employee {
  private String nickName;
  
  protected String birthday;
  
  public void setInfo(String name) {
    nickName = name;
  }
  
  private void setBirthday(String date) {
    birthday = date;
  }
}

// Test.java getFields(); getMethods();
public class Test {
  private static void printFields(Class clazz) {    
    // get all available public  fields
    Field[] fields = clazz.getFields();
    // clazz.getDeclaredFields(), clazz.getDeclaredMethods()
    
    for (Field field : fields) {
      // int modifeirs = field.getModifiers(); 访问权限
      System.out.println(field.getType().getName() + 
                        " " + field.getName());
    }
  }
  public static void main(String[] args) {
    printFields(CoffeeMakerclass);
  }
}  

```

此外，上文提到 Java 的反射机制还能够自由的调用类的私有方法/变量，只要在成功获取方法/变量后，将访问权限修改后，通过 invoke()  / set() 方法就可以调用。

还可以很逆天的修改私有常量。

### Spring IOC

依赖注入 (Dependency Injection) 其实就是，控制翻转( Inversion of Control)，就是**把底层类作为参数传入上层类**，实现上层类对下层类的控制。如此一来，底层类的修改就不会牵一发而动全身了，比如 [[4]](https://www.zhihu.com/question/23277575) 中的只是要把轮胎尺寸改成动态配置，如果没有加入依赖注入的概念，那么要修改一堆代码。

有3种 DI 方法，

（1）构造函数传入

（2）Setter 方法

（3）接口传递

需要有一个，控制反转容器 ( IoC Container )来配置 DI 。在 Spring 中可以通过 xml 配置文件、设定由自动扫描包来达成，或者由一个设定类(被标注 @Configuration)的类来实现。

对于大型项目，自动扫描包是比较常见的方法，毕竟有太多东西需要注入了。Spring IoC 可以找到路径下使用 @Component, @Service, @Controller, @Repository ... 的类。并且，这些类被称为 Bean，它们的 id 默认是首字母小写的类名。

```xml
// xml 配置文件
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:context="http://www.springframework.org/schema/context"
    xsi:schemaLocation="
        http://www.springframework.org/schema/beans        
        http://www.springframework.org/schema/beans/spring-beans-3.0.xsd
        http://www.springframework.org/schema/context                
        http://www.springframework.org/schema/context/spring-context-3.0.xsd">
    <!-- id 表示组件的名字，class表示组件类 -->
    <bean id="coffeeMaker" class="com.test.CoffeeMaker" />
</beans>

```

```java
// 设置自动扫描包的范围
// 于配置文件中设置   <context:component-scan base-package="com.test"/>
// 于入口类处设置
@ComponentScan(value= "com.test")
public class Test {
  private static void printFields(Class clazz) {    
    Field[] fields = clazz.getFields();    
    for (Field field : fields) {
      System.out.println(field.getType().getName() + 
                        " " + field.getName());
    }
  }
  public static void main(String[] args) {
    printFields(CoffeeMakerclass);
  }
} 
```



### 参考资料

1. [https://juejin.im/post/598ea9116fb9a03c335a99a4](https://juejin.im/post/598ea9116fb9a03c335a99a4)
2. [https://codertw.com/%E7%A8%8B%E5%BC%8F%E8%AA%9E%E8%A8%80/11422/](https://codertw.com/程式語言/11422/)
3. [http://tengj.top/2016/04/28/javareflect/](http://tengj.top/2016/04/28/javareflect/)
4. [https://www.zhihu.com/question/23277575](https://www.zhihu.com/question/23277575)
5. [Spring IoC有什么好处呢？ - Mingqi的回答 - 知乎](https://www.zhihu.com/question/23277575/answer/169698662)
6. [https://www.jianshu.com/p/64aac6461d5b](https://www.jianshu.com/p/64aac6461d5b)

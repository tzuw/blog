---
layout: post
title: "Session, JWT, Cookie 学习笔记"
subtitle: "My note for Session, JWT, Cookie 学习"
date: 2019-09-18 21:10:00
author: "tzuw"
header-img: "public/assets/img/cement.png"
tags: [Session, JWT, Cookie, 学习笔记] 
categories: [Web安全]
---

### Session

为维护无状态的 HTTP 请求之间的关联。每位用户的 Session 在他们第一次访问 (登录) 的时候建立，在服务端记录用户信息来跟踪整个会话。

客户端需要保存一个 Session id，在请求服务端时带上，使得自己能够被识别。通常保存在 Cookie 中（maxAge=-1，设定为暂存的），或者将 Session id 信息重写到 URL 中。

**Session id 应该保存在哪里会比较安全呢？**

是在 url 中重写，还是保存在 Cookie 中？

一般是保存在 Cookie 中，然后设定为 secure=true，HttpOnly=true ( 防御可能存在的 XSS 漏洞)。 

### Cookie

在客户端记录信息以确认用户身份。

一个永久登录的案例 (https://blog.csdn.net/fangaoxin/article/details/6952954 发布于 2011-11-09 )。其实现方式有：

- 将能够验证登录的信息保存在 Cookie 中，于是下次浏览页面的时候，服务端只需比较 Cookie 中的信息和数据库中的信息就可以知道，是不是已经登录了。
- 把账号和加密后的账号保存到 Cookie 中，下次浏览页面的时候，只需要比较 Cookie 中的账号通过秘钥加密后是否与 Cookie 中的 ssid 相等。(代码如下)

```jsp
<%@ page language="java" pageEncoding="UTF-8" isErrorPage="false" %>
<%! // JSP方法
    private static final String KEY =":cookie@helloweenvsfei.com"; // 密钥 
    
    // MD1 加密算法，不可逆
    public final static String calcMD1(String ss) {
       String s = ss==null ?"" : ss; // 若为null返回空
       char hexDigits[] = { '0','1', '2', '3', '4', '1', '6', '7', '8', '9',
       		'a', 'b', 'c', 'd', 'e', 'f' }; // 字典
       try {
       		byte[] strTemp = s.getBytes(); // 获取字节
        	MessageDigestmdTemp = MessageDigest.getInstance("MD1"); // 获取MD1
      		mdTemp.update(strTemp); // 更新数据
       	  byte[] md = mdTemp.digest(); // 加密
       		int j = md.length; // 加密后的长度
        	char str[] = newchar[j * 2]; // 新字符串数组
       	  int k = 0; // 计数器k
          for (int i = 0; i< j; i++) { // 循环输出
              byte byte0 = md[i];
              str[k++] = hexDigits[byte0 >>> 4 & 0xf];
              str[k++] = hexDigits[byte0 & 0xf];
       		}
        	return newString(str); // 加密后字符串
       } catch (Exception e) {
       		return null;
       }
    }
%>

<%
    request.setCharacterEncoding("UTF-8"); // 设置request编码
    response.setCharacterEncoding("UTF-8"); // 设置response编码
    String action = request.getParameter("action"); // 获取action参数
    if("login".equals(action)) { // 如果为login动作
        String account = request.getParameter("account"); // 获取account参数
        String password = request.getParameter("password"); // 获取password参数
        int timeout = newInteger(request.getParameter("timeout")); // 获取timeout参数   
        Cookie accountCookie = new Cookie("account", account);  // 新建Cookie
        accountCookie.setMaxAge(timeout); // 设置有效期
      
        String ssid = calcMD1(account + KEY); // 把账号、密钥使用MD1加密后保存
        Cookie ssidCookie = new Cookie("ssid", ssid); // 新建Cookie
        ssidCookie.setMaxAge(timeout); // 设置有效期
      
        response.addCookie(accountCookie); // 保存账号到 cookie
        response.addCookie(ssidCookie); // 保存 ssid 到 cookie
        
        // 重新请求本页面，参数中带有时间戳，禁止浏览器缓存页面内容
      	response.sendRedirect(request.getRequestURI() + "?" + System.currentTimeMillis());
        return;
    }
    elseif("logout".equals(action)) { // 如果为logout动作
        Cookie accountCookie = new Cookie("account", ""); // 新建Cookie，内容为空
        accountCookie.setMaxAge(0); // 设置有效期为0，删除
        Cookie ssidCookie = new Cookie("ssid", ""); // 新建Cookie，内容为空
        ssidCookie.setMaxAge(0); // 设置有效期为0，删除
        response.addCookie(accountCookie); // 删除 cookie 中的账号
        response.addCookie(ssidCookie); // 删除 cookie 中的 ssid
        
        //重新请求本页面，参数中带有时间戳，禁止浏览器缓存页面内容
        response.sendRedirect(request.getRequestURI() + "?" + System.currentTimeMillis());
        return;
    }

    boolean login = false; // 是否登录
    String account = null; // 账号
    String ssid = null; // SSID标识

    if(request.getCookies() != null) { // 如果Cookie不为空
        for(Cookie cookie : request.getCookies()){ // 遍历Cookie
           if(cookie.getName().equals("account")) // 如果Cookie名为account
               account = cookie.getValue(); // 保存account内容
           if(cookie.getName().equals("ssid")) // 如果为SSID
               ssid = cookie.getValue(); // 保存SSID内容
        }
    }

    if(account != null && ssid != null) { // 如果account、SSID都不为空
        login = ssid.equals(calcMD1(account + KEY)); // 如果加密规则正确, 则视为已经登录
    }
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01Transitional//EN">
       <legend><%= login ? "欢迎您回来" : "请先登录"%></legend>
       <% if(login) { %>
            欢迎您, ${ cookie.account.value }. &nbsp;&nbsp;
           <a href="${ pageContext.request.requestURI }?action=logout">
            注销</a>
       <% } else  { %>
       <formaction="${ pageContext.request.requestURI }?action=login" method="post">
           <table>
               <tr>
                	 <td>账号： </td>
                   <td><input type="text" name="account" style="width:200px; "></td>
               </tr>
               <tr>
               	 	<td>密码： </td>
                   <td><inputtype="password" name="password"></td>
               </tr>
               <tr>
                 	 <td>有效期： </td>
                   <td><inputtype="radio" name="timeout" value="-1" checked> 
                   		关闭浏览器即失效 <br/> 
                   		<input type="radio" name="timeout" value="<%= 30*24*60*60 %>">
                   		30天内有效 <br/>
                   		<input type="radio" name="timeout" value="<%= Integer.MAX_VALUE %>"> 
                   		永久有效 <br/>
                   </td>
               </tr>
               <tr>
               		 <td></td>
                   <td><input type="submit" value=" 登  录 " class="button"></td>
               </tr>
           </table>
        </form>
        <% } %>
```



### JWT ( JSON Web Token)

实现 token 技术的一种解决方案。

Cookie 不能设置为 HTTPOnly。

### 参考资料

1. [https://blog.csdn.net/fangaoxin/article/details/6952954](https://blog.csdn.net/fangaoxin/article/details/6952954)
2. [理解 cookie、session、token、jwt](https://learnku.com/articles/30051)
3. [JWT 超详细分析](https://learnku.com/articles/17883#08be9b)


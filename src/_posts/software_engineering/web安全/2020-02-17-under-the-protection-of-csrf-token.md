---

layout: post
title: "在 csrf token 的保护之下"
subtitle: "Under the protection of csrf token"
date: 2020-02-17 21:10:00
author: "tzuw"
header-img:  "public/assets/img/cement.png"
tags: [csrf, security, session, cookies, httpheader] 

categories: [Web安全]

---

#### # 前情提要

为了避免跨站请求在你不知情的情况下，对你的后端接口发一些恶意的增删改查请求，需要给来自前端页面的请求加上csrf token，来确保服务器能够识别这个请求真的是使用者自己发的。

#### # 最初的思路

约定一个接口，在返回的时候给前端 vuex 的 state 里保存一个 csrf token，使前端在之后每次请求后端时都带着 token。即是一个由服务端生成 token ，并且于服务端进行校验的过程。采用了在响应时在前端的 cookies 里加入 csrf token 的方法，同时也一直有一个疑问：由于前端需要向后端请求一个 token，那么就必然会有一个接口会不需要校验 csrf token，那会不会存在不安全的可能。

就当时的了解而言，csrf token 主要是保护那些重要的接口，比如增加、删除和修改；于是，对于一个单纯获取 csrf token 的接口而言，是不是可以不进行校验呢？答案是肯定的。因为，就算攻击者拿到了你的 csrf token，他还是需要知道你的 session id 才能通过后端的校验，也就是这个用来请求 csrf token 的接口相比较于其他，少了一些校验。并且，这个获取 csrf token 的接口一般而言都是和登录的功能绑定的，也就是你需要能够正常的登录（让服务端确认你就是使用者本人），才能获取 csrf token。然而，也是有那种获取 csrf token 的接口只是一个普通的接口的情况，那风险或许就会比较高了。

#### # 谷歌到的解决方案

下面的陈诉整理自参考资料的第 [[1]](https://blog.techbridge.cc/2017/02/25/csrf-introduction/),[[2]](https://stackoverflow.com/questions/20504846/why-is-it-common-to-put-csrf-prevention-tokens-in-cookies),[[3]](https://security.stackexchange.com/questions/175536/does-a-csrf-cookie-need-to-be-httponly)项。

1. 由服务端生成 csrf token，并通过 response header（或者通过 Set-Cookie）将 token 传递到前端，并且让之后需要前端需要校验的接口都带上。在服务端完成校验，校验成功前端接口的请求才会正常执行，否则会被后端拦截。
   - 放在 header 里会容易被攻击者从别的 domain 进行获取，因此为以防万一还可以加上 Referer 校验。
   - 放在 cookie 里面就不存在这个问题，因为攻击者是无法获取使用者domain下的 cookie 的，但是需要将 cookies 的 Http-only 设置为 false。目前，Django, AngualrJS 等都是采用这种方式。
   - 一般比较普遍的做法是通过 Set-Cookie 向前端传递 csrf token。
2. 通过在 response body 里面加入 csrf token传递到前端，目前 Express 是采用这种方式。
3. Double Submit Cookie ，一种完全不用在服务端存东西的方法。也就是说不需要担心 session id 被盗取后，csrf token 也会失效？它的方法主要是，由服务端生成 csrf token 并且保存于前端的 cookie 中；当前端进行请求时，服务端会比较请求中带的 token 和他来自的 domain 下的 cookie 的 csrf token 值是否一致；也就是说，攻击者的请求（来自于另一个domain）一定无法通过校验 ，因为攻击者的 domain 下是无法存在一个 使用者 domian 的 cookie 的。当然，如果攻击者掌握了使用者的 domain，那就另当别论了，这个后面可以再深入了解下 ( -> [double-submit-cookies-vulnerabilities](https://security.stackexchange.com/questions/59470/double-submit-cookies-vulnerabilities) )。



#### # 最终方案与检验

主要的环境，依托于某平台进行登录，并且需要自行解决跨站请求伪造攻击。将原来通过 Set-Cookie 传递 token 到前端的方法改成了，通过 response header 传递的方法，并且将 csrf token 保存于服务端的 session 中；另外由于，没有了登录校验来保护 csrf token 的获取，因此在每个请求又加上了 Refer 校验（设置拦截器，检查请求的 domain ）。

并且，当下面几种情况发生时，服务端需要生成或更新 csrf token：

（1）第一次登录平台，并开启服务页面时；

（2）在平台的校验 token 更新时（即开启新的 session ），将 csrf token 更新，并且同步更新我们服务端自己的 session id。如此，就可以较好的保证平台 session 过期时我们的服务端也能获取新  token 和 新 session id，每次发请求的时候都是使用者我本人，一个伪造的请求很大概率会持有的是过期的 token 和 session id；

当调用请求 token 的接口时，服务端 session 中的 token 与请求的 header 里所携带的不一致时，拦截请求。

~~（感觉只要攻击者盗取了你的 session id，那么什么 csrf token 阿的阿猫阿狗，都没有什么软用。此时，就体现了 Refer 校验的重要性。当攻击者掌握了你的 domain，又知道你的 session id，感觉也就无力回天了；所以，每次登录后一定要记得登出）~~

大概的伪代码如下，

```java
public void getToken() {
	if ( null == request.getSession().getAttribute('csrfToken').equals() ||		
		cookiesSetByPlatformBeingRefreshed ) {
		String newToken = generateNewToken();
		response.setHttpHeader('csrfToken', newToken);
	}
}

public void shouldDoIntercept() {
	if (request.getRequestURI() not in ignores && !request.getSession().getAttribute(
		'csrfToken').equals(request.getHttpHeader('csrfToken'))) {
		return true;
		}
	return false;
}
```

最后，通过使用 Burp Suite 请求拦截器来发送错误的 token 来检验接口的安全性。



#### # 参考资料

1. https://blog.techbridge.cc/2017/02/25/csrf-introduction/
2. https://stackoverflow.com/questions/20504846/why-is-it-common-to-put-csrf-prevention-tokens-in-cookies
3. https://security.stackexchange.com/questions/175536/does-a-csrf-cookie-need-to-be-httponly
4. https://stackoverflow.com/questions/54258233/do-i-have-to-store-tokens-in-cookies-or-localstorage-or-session
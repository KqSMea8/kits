# 跨域

## CORS

浏览器在想服务端发起请求时，会自动在request header中添加`Orgin`字段，
该字段含义是要当前请求所在的域，格式形如`<scheme> "://" <host> [ ":" <port> ]`,
服务端根据`Origin`字段是否同源决定是否响应CORS请求。

整个CORS通信过程，都是浏览器自动完成，不需要用户参与。
对于开发者来说，CORS通信与同源的AJAX通信没有差别，代码完全一样，
因此，能否使用CORS方式通信主要是服务端是否支持。

+ 简单请求与非简单请求

  简单请求是指使用一次请求完成

  非简单请求是指需要额外一次`OPTION`请求来协商是否发起真正的请求，
  `OPTION`请求的响应中包含有效期字段，该字段指明在有效时间内，
  同样的请求不用再次发起`OPTION`请求，可直接发起真正的请求

  同时满足以下条件的使用简单请求，对于不满足任意一条的使用非简单请求

  + method 是以下之一

    + `get`
    + `post`
    + `head`

  + request header不超过以下内容的

    + `Accept`
    + `Accept-Language`
    + `Content-Language`
    + `Content-Type`

  + content-type 是以下之一的

    + `text/plain`
    + `multipart/form-data`
    + `application/x-www-form-urlencoded`

+ 非简单请求`OPTION`预请求

  + 请求头

    + `Access-Control-Allow-Method`

      【必填】此次请求使用的方法

    + `Access-Control-Allow-Headers`

      此次请求需要额外携带的请求头字段

  + 响应头

    + `Access-Control-Allow-Methods`

      【必填】此域内允许跨域请求的方法。使用逗号分隔的字符串

    + `Access-Control-Allow-Credentials`

      cookie相关，参考简单请求响应的此字段

    + `Access-Control-Max-Age`

      本次预检查的有效期，单位为秒，有效期内，同一个Origin不用再次发预请求

+ 简单请求和非简单请求通过预检查后的响应字段

  + Access-Control-Allow-Origin

    【必填】要么是请求时的origin值，要么是*，表示接受任意域名，否则抛出异常

  + Access-Control-Allow-Credentials

    是否发生cookie。设置`true`则发送，其他值或无此字段不发送

    cookie在跨域时默认是不发送的，在XHR请求时如果要携带cookie需要设置
    `withCredentials=true`。同时，`Accept-Control-Allow-Origin`不能是`*`。

  + access-Control-Expose-Headers

    客户端可获取的其他请求头字段。

    `XHR.getResponseHeader()`默认只能获取以下字段

    + `Cache-Control`
    + `Content-Language`
    + `Content-Type`
    + `Expires`
    + `Last-Modified`
    + `Prama`

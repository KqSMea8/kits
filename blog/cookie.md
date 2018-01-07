cookie
=======

> RFC规范：[HTTP State Management Mechanism](https://tools.ietf.org/html/rfc6265)

> Wiki: [HTTP_cookie](https://en.wikipedia.org/wiki/HTTP_cookie)

cookie是一段可以由网站服务端发送，并在浏览器本地存储的，
用于记录用户行为状态（如购物车，浏览记录）或用户身份（是否登录）等信息的数据。

当服务器向客户端做出响应时，通过添加response header中的 `set-cookie` 字段，
将cookie信息携带给客户端，这个过程是需要手动添加实现的。

`set-cookie`字段可以在任何一个response中被设置，
客户端可以在response的状态码等于1XX的时候忽略这个字段，
但等于其他状态码（包括4XX，5XX）的时候则不能忽略。

当客户端发http请求到服务端时，浏览器会检查是否有已存储的cookie，
有则自动添加在request header中的 `cookie` 字段中，发送到服务端，
这个过程是自动实现的，而且是每次请求均会如此执行。

因此，根据浏览器自动携带cookie这一个特性，
可以发现并不是所有的数据都适合长久的存放于cookie中，
只有那些“每次请求都需要与服务器沟通的信息”才需要长久的保存在cookie中，
否则就会造成网络带宽的浪费。

在规范中cookie的存储是有限制的，但各个浏览器厂商实现也略存在差异，
具体情况需要实际测试。规范中的限制包括：

+ 每条cookie至少可以存储4096字节(byte)，包括cookie的name, value, attribute数据长度的总和，
  【虽然规范指定**至少**，但浏览器厂商实现各异，保险起见，在使用时最好小于4095字节】

+ 每个域下至少存储50条cookie

+ 浏览器一共至少可以3000条cookie

规范中还指出服务端应尽量减小cookie的大小，以压缩带宽，
并保证每次请求都能携带上cookie的信息，因此，虽然规范使用的是 **至少**来限定，
但在实际的开发中，应当按**至多**来使用，除非已经在特定的浏览器中实际测试成功。

cookie在浏览器端与在服务端的读写略有差异，服务端能控制的功能大于客户端。
由于cookie的读写与语言相关，浏览器端只使用js语言，直接介绍js方法即可，
服务端语言比较多，因此以下只介绍cookie特性，不做具体语言的实现。


# 客户端(浏览器)中使用cookie

## 读取cookie

  可直接调用 `document.cookie` 取值。例如：

  在github网站的console中运行以下代码，会打印出客户端可访问的所有的cookie键值对。
  （当设置`httponly`客户端是无法访问的）

  ```javascript
    console.log(document.cookie)
    // output: "_octo=GH1.1.641397018.1515304792; _ga=GA1.2.1568990340.1515304792; tz=Asia%2FShanghai; _gat=1"
  ```

## 设置cookie

  可直接调用 `document.cookie = 'cookie_value'`,
  （**注意：**用这个方法一次只能对一个cookie的键进行设置或更新）

  当cookie中无此key时，则写入一个此key的cookie值

  当cookie中已经包含此key，则执行更新操作，即覆盖原有的值

  JS表达式：

  ```javascript
    document.cookie = `${key}=${value};max-age=${max-age-in-seconds};expires=${date-in-GMTString-format};domain=${domain};path=${path};secure;`
  ```

  `cookie_value`是包含一个{key:value}键值对和多个attribute(键值对或键)的字符串。
  其中attribute包括：`exoires`, `max-age`, `domain`, `path`, `secure`, `httponly`

  `cookie_value` 有以下特性：

  + `键值对`或`键`之间使用`;`(分号)做分隔符
  + `键名` 大小写不敏感。
  + `key`与`value`之间使用`=`(等号)做分割符，以第一个出现的为准，
    后续出现的`=`视为`value`的值部分，如果整条cookie中未出现`=`，
    则认为此条cookie不合法，会被忽略
  + `键名`与`值` 首尾的空格均会被自动trim，中间出现的空格会全部保留
  + `value`(非attribute的value)可以是任意字符，包括attribute的名字，等号等保留关键字，
    但分号不可以，因为分号被认为是`键值对`或`键`的结束。

  > 部分文档中有使用空格和分号做分隔符的说法，实际上空格并不是必须的，
  > 因为key与value首尾的空格均会被过滤掉，
  > 因此不使用空格或使用多个空格效果是一样的。

  + ${key}=${value}【必填】：

    `key`: cookie的名字，不能是空字符串

    `=`: 分割符

    `value`: cookie的值，可以是任意字符

    注意：

    + `key` 为空或是一串空格（首尾空格会trim掉等于空），此条cookie会被忽略
    + `value`可以是任意字符，但使用保留字段是不推荐的。

    实际开发中要避免使用cookie的保留字段作为value，以免造成混乱，
    当cookie的`value`中出现保留字段，可用来判定可能是存储时丢失分隔符造成的。

    对于一定要使用空格、等号等特殊字符的场景，要对`key`和`value`的值进行escape。
    （例如：存储时使用`encodeURIComponent`进行编码，
    读取时再使用`decodeURIComponent`进行解码）


  + expires【选填】：过期时间

    注意:

    + 必须是UTC时间格式，可使用`date.toUTCString()`或`date.toGMTString()`方法来获得,
      如果使用了非UTC格式的值，则认为此条cookie非法，会被忽略。
    + 如果设置时间早于或刚好等于当前时间，则认为立即过期，此cookie会被删除
    + 如果位置此字段，则过期时间为session结束的时间，即关闭浏览器的时间

    tips:

    关闭正在访问网页并不代表session结束，因为现代浏览器大多提供标签(tab card)功能，
    关闭网页只是关闭一个标签，但session信息会在所有标签中共享，
    所以只有关闭了浏览器，session信息才会清除。

    例如：

    `expires=Sun, 07 Jan 2018 08:21:24 GMT` ，
    则过期时间是UTC时刻2018年1月7日08:21:24，超过这个时刻此条cookie会失效，
    注意：UTC时刻指的是0时区的UTC时间，也就是GMT时间
    ([UTC与GMT区别](https://www.zhihu.com/question/27052407))

  + max-age【选填】: 过期时间（秒），无默认值，与`expires`具有相同作用，
    但是优先级要大于`expires`，即同时设置了 `expires`和`max-age`以max-age为准。
    部分浏览器不支持此属性，如ie6, ie7, ie8。

    当`max-age`设置 `负数` 或 `0` 时，代表立即失效，则删除此cookie

    当设置`正数`时，代表在 *多少秒* 后过期，即过期时间=创建时刻 + max-age

    > 部分文档中指出 `max-age`的默认值是 `-1`，过期时间同session，与expires的默认值一致，
    > 当经现代浏览器测试`max-age`的默认值并不是`-1`，但如果未设置，过期时间是与seesion一致的。
    > （可能在部分旧版浏览器中表现不一样，有待测试）所以，`max-age`设置`-1`，与未设置，行为是不一样的。

  + domain【选填】：访问哪些域名时请求头会被携带上此条cookie，即只发送匹配到域名的cookie。

    如果未设置，则只会发给当前文档所在的域，并不会发给子域

    如果设置，则会发给设置的域及其子域，但是不能设置非法的域。当
    设置非法的域时，此条cookie会被忽略，即添加失败。

    例如：在域`foo.example.com`中可以设置 `foo.example.com` 或 `example.com`,
    但设置`bar.example.com` 或`baz.foo.example.com`均会失败。此外，
    设置公共域前缀（如`com`，`co.uk`）也会失败

  + path【选填】：访问哪些路径时请求头会被携带上此条cookie，即只发送匹配到路径的cookie,
    路径分隔符使用 `/`(%x2F)

    如果未设置，则默认使用根路径 `/` , 即所以请求都会带上此cookie

    如果设置，则匹配此路径及其子路径，如设置 `/foo` , 则 `/foo` `/foo/bar` 均会携带此cookie

  + secure【选填】：只能通过可靠协议传输（using SSL and the HTTPS protocol），
    因此在使用http协议时不要设置此字段，否则cookie会设置失败

    默认此字段不设置，`secure`不使用键值对方式表达，因此不设置是指不写此key。
    `secure=;`，`secure=null;`，`secure=undefined;`等均等效于`secure;`，即设置secure。

以上就是浏览器端使用js读取和写入js的方式和注意点，
由于使用原生的js操作cookie是比较麻烦的事情，尤其是读取，所有的cookie以字符串的方式返回，
下面提供一个简单的cookie tool 示例

```javascript
/*\
|*|
|*|  :: cookies.js ::
|*|
|*|  Syntaxes:
|*|
|*|  * docCookies.setItem(name, value[, end[, path[, domain[, secure]]]])
|*|  * docCookies.getItem(name)
|*|  * docCookies.removeItem(name[, path], domain)
|*|  * docCookies.hasItem(name)
|*|  * docCookies.keys()
|*|
\*/

var docCookies = {
  getItem: function (sKey) {
    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
  },
  setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
    var sExpires = "";
    if (vEnd) {
      switch (vEnd.constructor) {
        case Number:
          sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
          break;
        case String:
          sExpires = "; expires=" + vEnd;
          break;
        case Date:
          sExpires = "; expires=" + vEnd.toUTCString();
          break;
      }
    }
    document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
    return true;
  },
  removeItem: function (sKey, sPath, sDomain) {
    if (!sKey || !this.hasItem(sKey)) { return false; }
    document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + ( sDomain ? "; domain=" + sDomain : "") + ( sPath ? "; path=" + sPath : "");
    return true;
  },
  hasItem: function (sKey) {
    return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
  },
  keys: /* optional method: you can safely remove it! */ function () {
    var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
    for (var nIdx = 0; nIdx < aKeys.length; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
    return aKeys;
  }
};

// 对于永久cookie我们用了Fri, 31 Dec 9999 23:59:59 GMT作为过期日。
// 如果你不想使用这个日期，可使用世界末日Tue, 19 Jan 2038 03:14:07 GMT，
// 它是32位带符号整数能表示从1 January 1970 00:00:00 UTC开始的最大秒长
// (即01111111111111111111111111111111, 是 new Date(0x7fffffff * 1e3))
```

# 在服务端使用cookie

服务端的使用方式与客户端基本无差异，只是相对于客户端多一个控制cookie的字段：

`httponly` 【选填】

此字段用于控制此条cookie只能服务端访问，即在客户端使用`documnet.cookie`是无法访问的，
但是使用开发者工具依旧可以看到（chrome-> F12 -> Application -> cookies ）。
因此此字段在客户端是无法使用。

此字段默认不设置，与`secure`的使用方式一样，不是键值对格式，
因此要设置此字段只需标注 `httponly;` 即可

使用此特性一般用于避免XSS攻击，由于XSS攻击多数通过盗取用户cookie中的身份信息后发起攻击，
因此将cookie中的身份信息写入 `httponly`后，客户端就无法获取了。

## 设置cookie

  在 response header中使用 `set-cookie`字段设置，每一个`set-cookie`字段对应一个cookie
  （**注意：**不能将多个cookie放在一个set-cookie字段中,当你要想设置多个 cookie，
  需要添加同样多的set-Cookie字段），
  set-cookie字段的值就是普通的字符串，每个cookie可以设置相关属性选项。

  + nodejs

    ```javascript
    response.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);
    ```

  + php

    ```php
    bool setcookie ( string $name [, string $value = "" [, int $expire = 0 [, string $path = "" [, string $domain = "" [, bool $secure = false [, bool $httponly = false ]]]]]] )
    ```

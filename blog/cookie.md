cookie
=======

[RFC:set-cookie](https://tools.ietf.org/html/rfc6265#section-4.1)
[RFC:cookie](https://tools.ietf.org/html/rfc6265#section-4.2)

存储cookie是浏览器提供的功能，cookie其实是存储在浏览器中的纯文本，
浏览器的安装目录下会专门有一个 cookie 文件夹来存放各个域下设置的cookie，
cookie标准还是做了一些限制的：每个域名下的cookie 的大小最大为**4KB**，
每个域名下的cookie数量最多为**20**个（但很多浏览器厂商在具体实现时支持大于20个）。

当服务器要做出响应时，可以通过添加response header中的 `set-cookie` 字段，
将客户端需要的cookie携带过去。
当网页要发http请求时，浏览器会先检查是否有相应的cookie，
有则自动添加在request header中的 `cookie` 字段中。
这是浏览器自动帮我们做的，而且每一次http请求浏览器都会自动帮我们做。
这个特点很重要，因为这关系到“什么样的数据适合存储在cookie中”。

如果这些数据并不是每个请求都需要发给服务端，那么浏览器的自动处理无疑增加了网络开销；
但如果这些数据是每个请求都需要发给服务端（比如身份认证信息），
那么自动携带的特性就大大免去了重复手动添加的操作。
所以对于那些“每次请求都要携带的信息”就特别适合放在cookie中，其他类型的数据就不适合了。

cookie即可以在浏览器端设置和使用，也可以在服务端设置和使用，但两者略有差异，
由于cookie的读取和写入方法与使用语言的相关，浏览器端只使用js语言，直接介绍js方法即可，
服务端语言就比较多了，因此这里只介绍部分语言的使用，主要还是介绍cookie特性。

下面分别来介绍。

# 客户端(浏览器)中使用cookie

## 读取cookie

  可直接调用 `document.cookie` 取值。例如在github网站的console中运行,
  会打印出客户端可访问的所有的cookie键值对（有些cookie客户端是无法直接访问的，与服务端的差异）

  ```javascript
    console.log(document.cookie)
    // output: "_octo=GH1.1.641397018.1515304792; _ga=GA1.2.1568990340.1515304792; tz=Asia%2FShanghai; _gat=1"
  ```

## 设置cookie

  可直接调用 `document.cookie = 'cookie_value'`,
  **注意：**用这个方法一次只能对一个cookie的键进行设置或更新。
  当cookie中无此key时，写入一个此key的cookie值，
  当cookie中已经包含此key的值，则执行更新操作，即覆盖原有的值。

  例如：

  ```javascript
    document.cookie = `${key}=${value};max-age=${max-age-in-seconds};expires=${date-in-GMTString-format};domain=${domain};path=${path};secure;`
  ```

  `cookie_value`是一个键值对形式的字符串。包括以下几个字段，
  字段与字段间使用`;`（分号）隔开，并且字段名大小写不敏感。
  部分文档中有使用空格和分号做分隔符的说法，实际上经现代浏览器测试空格并不是必须的，
  而且每个键值对key与value首尾的空格均会被过滤掉。因此不使用空格或使用多个空格效果是一样的。

  + ${key} = ${value}【必填】： `key`是cookie的名字， `value`可以是任意字符，
    包括cookie的保留字段名（如`exoires`、`domain`）、空格、等号。

    实际开发中要避免使用cookie的保留字段，以免造成混乱，
    当cookie的value中出现保留字段，可用来判定可能是存储时丢失分隔符造成的。
    对于空格、等号可使用`encodeURIComponent`进行编码，读取时再使用`decodeURIComponent`解码。

  + expires【选填】：过期时间，**注意：** 必须是UTC时间，
    可使用`new Date(timestamp).toUTCString()`或`new Date(timestmap).toGMTString()`方法来获得

    如果设置 `expires=Sun, 07 Jan 2018 08:21:24 GMT` 则在UTC时刻2018年1月7日08:21:24之后失效，
    cookie失效后会从浏览器中删除，([UTC与GMT区别](https://www.zhihu.com/question/27052407))

    如果未设置，则过期时间为session结束的时间，即关闭浏览器的时间。
    但并不是关闭正在访问网页就销毁cookie，因为现代浏览器大多提供标签(tab card)功能，
    关闭网页只是关闭一个标签，但session信息会在所有标签中共享，
    所以只有关闭了浏览器，session信息才会清除。

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
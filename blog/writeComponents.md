# 开始编写一个Vue组件之前

> 使用vue已有一年有余，对vue的一些认识，对组件的一些沉思

+ 阅读提示：

  + 需要有一定的面向对象的概念，但不是指基于原型链的面向对象，我不认为js是面向对象的语言。
  + 需要有一定的设计模式理念，不知道也无伤大雅，只是有些时候可能会理解不到深意。
  + vue中虽说一切皆组件，但以下行文中组件均指纯组件(button，table等)，不指代页面

+ 写在前：

  作者本是一个很懒散的人，平时只钻研技术却基本不写总结性的文章，
  大概是因为我觉得这些所谓的技术都是些很浅显很易懂的，只要花些时间都很快就能上手，
  没有必要说说写写我学会了什么什么，掌握了什么什么，真的没有什么可值得宣讲，
  大家都是程序员，一定的学习能力还是有的，况且随着知识的积累，经验的增加，
  对某些技术还会产生新的认识，也可能发现原来自己是这样的不足和幼稚，难免啪啪的打脸，
  这就尴尬了是吧，所以基本不写总结性文章。

  那么说了这么多屁话，为什么还要写这篇文章呢，科科，因为我不得不承认的一个事实，
  新手还是太多了。。。不多说上干货

## 又谈Vue语法

我们知道Vue提供了两大非常重要的功能：html模板引擎和数据双向绑定，
因此我们只需关注数据即可，数据的变化能自动联动页面的变化，完成页面的渲染
从而使我们能从混乱的页面渲染逻辑中解放出来，也因为DOM事件的提前声明再使用的方式，
混乱的事件绑定逻辑从此不复存在，相对于jQuery时代的编码，
此时页面的编写也变得有章可循，有法可依，逻辑更加清晰。

上面这段话看起来又像是凑字数的废话（又没有稿费，瞎凑什么字数），然而我想说，
就像后会有期中说的：听过很多道理，依然过不好这一生。道理谁不懂，
那么谁又在vue的代码中依旧使用了jQuery时代的思维方式在编码呢，也许是有旧情怀吧，
也许是还不能理解Vue的深意吧。不过没有关系，又谈Vue语法就是要介绍一下Vue的深意来的。

Vue提供了几个Options：data、computed、watch、filters、directives、
methods、lifecycle hooks等，没有列到的不是用不到而是暂不再此次探讨范围之内，
我会依次介绍对这个options的认识。
（顺带说下个人编码习惯：我在写一个vue文件时定义options就是按照上面列出的顺序，
先数据再方法，先声明再使用的规则，不得不说是使用C#语言时遗留的习惯，因为清晰，
在团队合作时，风格一致也利于团队合作，已无力吐糟无视团队规则的人）

+ data

  我们可以认为一个vue文件是一个对象（符合es6 module规范的其实都可以认为是一个对象），
  data就是这个对象私有变量，并且这些私有变量均携带了observable的特性，
  因此，这就限定了data的使用范围，也是使用私有变量的初衷：**缓存对象的中间状态**，
  那么什么可以称为对象的中间状态呢，结合vue我认为可以是以下3种：

  + 初始数据(rawData)：这些数据并不能满足直接使用（模板引擎或函数），
    需要一次或多次的转换和加工才能应用。
  + 模板引擎的数据：这是由observable特性和模板引擎决定的，是渲染页面的需要，无可厚非。
  + 缓存数据(cache)：这些数据可有可无，依照业务逻辑的复杂度决定，组件肯定是不需要的，
    页面基本也用不到。

  但是在真实的世界中，除了以上三种使用方式，我们还能见到另外一种**错误的**方式被频繁使用：

  + 函数的中间状态数据：怎么理解呢，就是说本应该使用函数参数传递的变量却在data中存放。

  有时候我们实现一个复杂的功能，需要大量的逻辑处理，为了可维护我们将大逻辑拆成多个函数（
  写超过1000行的函数不在讨论之列，无力吐槽），每个函数完成一项相对独立的逻辑，
  在这些函数串起来的时候就不能避免需要数据传递（中间状态）。然而，
  有些人却选择了使用私有变量传递，这样可以吗？当然，只是显得没那么专业罢了，
  当你解决bug时看到很多函数里出现了this.xxx=，
  但又不能快速理清哪个this.xxx被先执行哪些被后执行，貌似有关联但貌似又没有关系时,
  我想你大声默念WTF也是无济于事罢了。

  每个对象都有一个独立作用域，那么私用变量可以认为是这个作用域的全局变量，
  我们从学习编码的那一天起就被告知避（jin）免（zhi）使用全局变量，
  污染全局变量会带来不可预知的bug，这是铁律，被忘记了吗，全局变量的危害我就不展开了。

  因此：**使用data缓存函数中间状态数据的做法是错误的，不值得使用**

  还有另外一种用法也是不值得推荐的，但这种用法无伤大雅，是和项目的大小和项目架构有关

  + 非observable的数据：即这些数据是单向使用的，一般出现于与模板引擎没有直接和间接关系的数据

  为什么说无伤大雅：因为即使这么用了，只要数据量不大，对页面的影响是可以忽略的，
  getter、setter在数据量可接受的范围内并没有什么副作用。
  为什么说与项目大小和项目架构有关：因为对于小型项目每一个页面或组件都小，
  一般不需要编写独立的js分离业务逻辑，况且如果引入了vuex管理状态，
  那么没有页面的逻辑就更少了。只有在大型项目中，业务非常的复杂，
  我们会将页面拆分成view和service两部分写，vue只负责视图的模板引擎和数据双向绑定，
  将业务的逻辑抽离到service中，最后将需要observable的数据暴露给view部分，因此，
  非observable的数据也不放在data中。

+ computed、watch

  这两个为什么要一起说呢？这不是很显然嘛，这两个能完成的功能实在太像了，
  以至于很多选手觉得用来没有什么差别那么用哪个又有什么关系呢，功能都能实现还分什么分。
  我也只能科科了。[Vue官网](https://vuejs.org/v2/guide/computed.html)似乎给出了区别，
  但你真的看懂了吗，体会到了吗，我来说一下我浅薄的认识

  + computed: 多对一的计算：即需要借助多个数据的值才能算出一个数据的值
  + watch: 一对多的计算：即一个数据变量了会引发很多值的变化

  可以看出两种正好是完全相反的模式，应用场景就显而易见了，看**不推荐(cuo wu)的用法**的栗子

  ```javascript
    export default {
      data() {
        return {
          varA: 'a',
          varC: 'c',
          varD: 'd',
        }
      },
      computed: {
        varB() {
          this.varC = `because of ${this.varA}, also change ${this.varC}`
          return `because of ${this.varA}`
        }
      }
      watch: {
        varB(value) {
          this.varD = `because of ${value}`
        }
      }
    }
  ```
  例子中可以看到`varA`的变化引发`varC`和`varB`的变化，然后`varB`引发`varD`的变化，
  但是，计算属性`varB`求值时同时修改了`varC`的值，这种是不推荐做法，
  因为违背了功能单一性原则，计算属性应该只为最后的求值，中间不应该修改无关的变量。

  推(zheng)荐(que)的做法:

   ```javascript
    export default {
      data() {
        return {
          varA: 'a',
          varB: 'b',
          varC: 'c',
        }
      },
      computed: {
        varD() {
          return `because of ${this.varB}`
        }
      }
      watch: {
        varA(value) {
          this.varB = `because of ${value}`
          this.varC = `because of ${value}, also change ${this.varC}`
        }
      }
    }
  ```

  但是，你就问了，一对一的场景还不是没解了！哦，确实，是也不是。
  一个值联动另一个值变化watch还是computed确实没有差别，但是仔细想想还是有差别的。

  下面我们看两个例子，当在看例子请我先说一个computed与data的关系（
  仅对对面向对象编程了解不深的童鞋有效，有很好基础的跳过，直接看下面的例子）：
  computed中文翻译过来叫计算属性，其实我觉英语应该使用computedAttr更好一些，
  因为很多人都忽略属性这个词，认为computed是函数而不是属性（经常会看到getXXX的命名，
  无力吐槽），我们在面向对象的设计中，类中有两个概念：属性和方法，对应是变量和函数，
  可见属性是变量的意思，只不过属性有附加的特性：可定义getter和setter，
  在C#更有私有变量和公有属性一说，讲的是变量对内使用，对外暴露的是属性，当然这是题外话了。

  好了，例子来了：变量`varA`会联动`varB`的变化

  + watch模式

    ```javascript
      export default {
        data() {
          return {
            varA: 'a',
            varB: 'b',
          }
        },
        watch: {
          varA(value) {
            this.varB = this.doSomething()
            // or
            // this.varB = `because of ${value}`
          }
        },
        methods: {                // 这个函数并不是必须的，只是为了做区别，
          doSomething() {         // 实际操作中只要watch内的逻辑不是很复杂
            return 'do something' // 一般不独立开一个函数
          }
        }
      }
    ```
  + computed 模式

    ```javascript
      export default {
        data() {
          return {
            varA: 'a',
          }
        },
        computed: {
          varB() {
            return `because of ${this.varA}`
          }
        }
      }
    ```
  有没有受到什么启发呢？是的，有以下不同：

    + watch模式需要在data中定义两个变量，computed模式只需要一个，另一个由computed定义。
      因此：如果在分析代码是如果忽略了watch（在超大页面或组件中太容易发生了，代码量太大），
      是无法察觉`varA`与`varB`有什么关系的，等于给后人挖坑。computed就可以一目了然。
    + watch模式`varA`的变化会引发`varB`的重新计算，但`varB`并不一定依赖`varA`的值，
      只是`varA`变化后`varB`需要重新计算。
    + computed模式中`varB`的重新计算是与`varA`的值强相关的，
      `varA`变化不仅会引发`varB`的重新计算，而且计算的结果依赖于`varA`变化后的值。

  看完以上三点我们总结出：在一对一的关系中，两个变量的值之间

    + 存在直接关系，使用computed，即使watch能完成，但有缺点。
    + 没有直接关系，使用watch，computed无法完成

+ filters、directives、methods

  这三个放在一起讲，是因为这三个本质都是方法

  + filters 在Vue2.0中被弱化了，看官方解释

    > Vue 2.x filters can only be used inside mustache interpolations and
    > v-bind expressions (the latter supported in 2.1.0+),
    > because filters are primarily designed for text transformation purposes.
    > For more complex data transforms in other directives,
    > you should use **Computed properties** instead.

    没有什么值得说的，在实际项目中可用可不用，我大多是不会用的，
    因为使用filter比使用methods并没有带了什么实质性的效率（几乎没有减少代码量），
    可能用习惯了管道(pipe)的人对这个比较钟爱吧

  + directives 在实际项目中指令也是比较少见的，因为指令的适用范围很窄，
    methods完成的需求绝对不使用指令做。

    指令常见于全局指令，因为局部（组件内，页面内）指令几乎无用武之地，
    能想到的场景methods几乎都能胜任了。那么，为什么这么说呢，
    因为当模板引擎在解析绑定指令的DOM时，会根据指令的参数执行与当前DOM相关的处理函数，
    那么，局部指令显然可以使用 lifecycle + methods 完成，
    当指令不包含任何`expression`、`arg`、`modifiers`时，编写指令的意义就更小了。

    如官方示例的v-fcous，我们在页面或组件的mounted钩子里通过
    `this.$refs.element.focus()`是完全可以实现的

    因此，指令可认为是一些通用DOM逻辑被抽离到独立的模块中，
    并且这些逻辑需要一定的参数(`expression`、`arg`、`modifiers`)辅助，
    例如一些开源库[v-validate](https://github.com/baianat/vee-validate)校验、
    [v-tooltip](https://github.com/Akryum/v-tooltip)提示等，
    结合示例，可见指令的应用范围，莫要用错。

  + methods 这个就更没的谈了，主要是结合data说一下，切莫把函数间的状态数据带入data中，
    污染了data中的数据，另外要说的同data中的最后一点，也是可有可无的，
    在大型项目中，如果采用的view与service分离的架构，
    那么与view无关的逻辑就要全部抽离出去，放到service处理，只返回view关心的data即可。

+ lifecycle hooks

  没有重点要说的，注意页面（或组件）切换时生命周期的执行顺序即可。

## 组件抽象
































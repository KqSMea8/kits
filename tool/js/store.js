const _store = Symbol('store')
const _watchMap = Symbol('watchMap')
const _watchId = Symbol('watchId')
const _notify = Symbol('notify')
const _eventMap = Symbol('eventMap')

function defineProperty(obj, key, val, notify) {
  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  const getter = property && property.get
  const setter = property && property.set

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: () => {
      const value = getter ? getter.call(obj) : val
      return value
    },
    set: (newVal) => {
      const value = getter ? getter.call(obj) : val
      if (this.isEqual(newVal, value)) {
        return
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) {
        return
      }
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      notify()
    }
  })
}


class Store {

  constructor(option, store) {
    option = option || {}
    let events = option.event || []
    let getters = option.getter || {}
    let methods = option.method || {}
    let states = option.state || {}

    // 缓存完整的store对象
    this[_store] = store

    // 事件映射表
    this[_eventMap] = new Map()

    // 注册事件名称
    events = _.reduce(events, (acc, name) => {
      if (_.isString(name)) {
        acc.name = name
      }
    }, {})
    Object.freeze(events)
    Object.defineProperty(this, 'event', {
      get() {
        return events
      }
    })

    // 注册getters
    _.forEach(getters, (func, key) => {
      if (_.isFunction(func)) {
        Object.defineProperty(this, key, {
          get() {
            return func.call(this, store)
          }
        })
      }
    })

    // 注册methods
    _.forEach(methods, (func, key) => {
      if (_.isFunction(func)) {
        Object.defineProperty(this, key, {
          get() {
            return (...args) => {
              args.push(store)
              return func.apply(this, args)
            }
          }
        })
      }
    })

    // 注册states
    _.forEach(states, (value, key) => {
      defineProperty(this, key, value)
    })

    // watch相关参数
    this[_watchMap] = new Map() // 多指watch时map表
    this[_watchId] = 0          // 多值watch时的唯一id
    this[_notify] = null        // 多值watch统一回调
  }

  on(name, func) {
    if (!this.event[name] || !_.isFunction(func)) {
      return
    }
    if (!this[_eventMap].has(name)) {
       this[_eventMap].set(name, [])
    }
    this[_eventMap].get(name).push(func)
  }

  off(name, func) {
    if (!this[_eventMap].has(name)) {
      return
    }
    if (func) {
      const funcs = this[_eventMap].get(name)
      const index = funcs.indexOf(func)
      if (index !== -1) {
        funcs.splice(index, 1)
      }
    } else {
      this[_eventMap].delete(name)
    }
  }

  emit(name, ...args) {
    if (!this.event[name]) {
      return
    }
    if (this[_eventMap].has(name)) {
      const funcs = this[_eventMap].get(name)
      _.forEach(funcs, func => {
        func(...args)
      })
    }
  }

  /**
   * watch states, 发生变化执行回调,
   * 当watch单个state时，发生变化立即回调
   * 当watch多个states时，需要手动执行notify触发回调
   *
   * watch的回调函数参数：func(newVal, oldVal, store)
   * newVal: 变化后的值
   * oldVal: 变化前的值
   * store: 完整的store对象
   *
   * watch回调函数应尽量使用箭头函数，因函数this会发生变化
   *
   * 例子：
   * // 单个state
   * import { test } from 'store'
   * test.watch('stateA', (newVal, oldVal, store) => {
   *   console.log(newVal, oldVal, store)
   *   console.log(test.stateA === newVal)
   *   console.log(store.test === test)
   * })
   * // 多个state
   * import { test } from 'store'
   * test.watch(['stateB, stateC'], (newVal, oldVal, store) => {
   *   console.log(newVal.stateB, newVal.stateC, oldVal.stateB, oldVal.stateC)
   *   console.log(test.stateB === newVal.stateB, test.stateC === newVal.stateC)
   *   console.log(store.test === test)
   * })
   * test.notify() // 执行后立刻回调watch
   *
   */
  watch(states, func) {
    if (_.isString(states)) { // watch单个key
      if (_.has(this, states)) {
        defineProperty(this, states, this[states], (oldVal) => {
          func(this[states], oldVal, this[_store])
        })
      }
    } else if (_.isArray(states)) { // watch多个key
      this[_watchId] += 1
      this[_notify] = (oldVal, key) => {
        if (!this[_watchMap].has(this[_watchId])) {
          this[_watchMap].set(this[_watchId], {
            func,
            oldVals: { [key]: oldVal }
          })
        } else {
          this[_watchMap].get(this[_watchId]).oldVals[key] = oldVal
        }
      }
      _.forEach(states, state => {
        if (_.isString(state) && _.has(this, state)) {
          defineProperty(this, state, this[state], this[_notify])
        }
      })
      this[_notify] = null
    }
  }

  /**
   * 当watch多个state时需要手动执行notify触发回调
   * watch多个state时，state变化顺序是随机，变化个数也随机
   * 需要人为干预watch变化结束的时机
   *
   */
  notify(...args) {
    _.forEach([...this[_watchMap].values()], item => {
      const newVals = {}
      _.forEach(item.oldVals, (v, key) => {
        newVals[key] = this[key]
      })
      args.push(this[_store])
      item.func(newVals, item.oldVals, ...args)
    })
  }

}


function initStore(modules) {
  const rst = {}
  _.forEach(modules, item => {
    rst[item.name] = new Store(item, rst)
  })
  return rst
}

const obj = {
  name: '',
  event: [ // 支持的事件

  ],
  state: {  // 自己的状态
    a: '',
  },
  getter: {  // 计算属性
    user(store) {
      return this.a
    }
  },
  method: {   //
    getSomeSth(arg1, arg2, store) {
      return this.a[arg1] + this.a[arg2]
    }
  }
}

export default obj

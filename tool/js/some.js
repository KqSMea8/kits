const obj = {
  name: '',
  event: [ // ֧�ֵ��¼�

  ],
  state: {  // �Լ���״̬
    a: '',
  },
  getter: {  // ��������
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

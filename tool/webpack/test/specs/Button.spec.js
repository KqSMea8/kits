import Button from 'components/Button'
import { createTest, createVue, destroyVM } from '../util'

describe('Button.vue', () => {
  let vm = null

  afterEach(() => {
    destroyVM(vm)
  })

  it('初始化数据', () => {
    vm = createVue(Button)
    expect(vm.type).toBe('default')
    expect(vm.width).toBe('')
    expect(vm.height).toBe('')
    expect(vm.active).toBeFalsy()
    expect(vm.withCaret).toBeFalsy()
    expect(vm.buttonStyle).toEqual({})
    expect(vm.buttonClass).toEqual('default ')
  })
  it('切换按钮类型', () => {
    vm = createTest(Button, {
      type: 'label',
      withCaret: true,
    })
    expect(vm.buttonClass).toBe('label ')
    expect($(vm.$el).find('span').hasClass('caret')).toBeTruthy()
  })
  it('切换按钮状态', () => {
    vm = createTest(Button, {
      type: 'approve',
      active: true,
    })
    expect(vm.buttonClass).toBe('approve btn-active')
  })
  it('改变按钮大小', () => {
    vm = createTest(Button, {
      width: '200px',
      height: '30px',
    })
    expect(vm.buttonStyle).toEqual({
      height: '30px',
      width: '200px',
    })
  })
})

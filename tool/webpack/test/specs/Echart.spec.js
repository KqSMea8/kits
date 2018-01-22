import Echart from 'components/Echart'
import {
  createTest,
  nextTick,
} from '../util'

function randomData() {
  let r = Math.round(Math.random() * 10)
  let step = 1
  if (r > 9) {
    step = 2
  }
  if (r < 1) {
    step = 0
  }
  let data = [1000, 1000 * 100, 1000 * 1000]
  let value = data[step] === -1 ? undefined : Math.round(Math.random() * data[step])
  return value
}

function genLineData(n = 60, type = 'oneMin') {
  let now = new Date();
  let range = {
    oneDay: 24 * 3600 * 1000,
    oneMis: 1000,
    oneMin: 60 * 1000,
    oneHour: 3600 * 1000,
  };
  let data = []
  for (let i = n - 1; i >= 0; i--) {
    now = new Date(+now + range[type]);
    const timestamp = Math.floor(now.getTime())
    data.push({
      timestamp: timestamp,
      bit_rx: randomData(),
      bit_tx: randomData(),
    })
  }
  return data
}

function genBarData(n = 10) {
  let data = []
  for (let i = n - 1; i >= 0; i--) {
    const host = 'xx:xx:xx:xx:xx:xx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0
      const v = (c === 'x') ? r : ((r & 0x3) | 0x8)
      return v.toString(16)
    })
    data.push({
      host: host,
      bit_rx: randomData(),
      bit_tx: randomData(),
    })
  }
  data = _.orderBy(data, item => {
    return item.bit_tx + item.bit_rx
  }, 'desc')
  return data
}
function genPieData(n) {
  return [{
    value: 1,
    name: '直接访问1'
  }, {
    value: 1,
    name: '邮件营销2'
  }, {
    value: 1,
    name: '联盟广告3'
  }, {
    value: 1,
    name: '视频广告4'
  }, {
    value: 1,
    name: '搜索引擎5'
  }, {
    value: 1,
    name: '直接访问6'
  }, {
    value: 1,
    name: '邮件营销7'
  }, {
    value: 1,
    name: '联盟广告8'
  }, {
    value: 2,
    name: '视频广告9'
  }, {
    value: 99999,
    name: '搜索引擎0'
  }]
}

describe('Echart.vue', () => {
  let vm = null

  beforeEach(() => {
  })
  afterEach(() => {
  })

  it('初始化数据', () => {
    const tpromise = Promise.resolve().then(() => {
      return []
    })
    vm = createTest(Echart, {
      data: tpromise
    })
    expect(vm.series).toEqual([])
    expect(vm.reload).toBeFalsy()
    expect(vm.increase).toBeFalsy()
    expect(vm.type).toBe('line')
    expect(vm.height).toBe('350px')
    expect(vm.firstLoad).toBeTruthy()
    expect(vm.chart).not.toBeNull()
    expect(vm.loading).toBeTruthy()
  })
  it('数据更新', (done) => {
    const tpromise = new Promise(resolve => {
      resolve(genBarData())
    })
    vm = createTest(Echart, {
      data: tpromise,
      series: [{
        key: 'bit_rx',
        name: '入流量',
      }, {
        key: 'bit_tx',
        name: '出流量',
      }],
      options: {
        title: '柱状图测试',
        xAxisKey: 'host',
      },
      type: 'bar',
      increase: false,
    })
    spyOn(vm, 'render')
    Promise.resolve().then(() => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(genBarData())
        }, 100)
      })
    })
    .then(data => {
      vm.data = Promise.resolve(data)
      return new Promise(resolve => {
        nextTick(() => {
          expect(vm.render.calls.count()).toEqual(1)
          resolve()
        })
      })
    })
    .then(() => {
      vm.reload = true
      vm.data = Promise.resolve().then(() => {
        return genBarData()
      })
      return new Promise(resolve => {
        nextTick(() => {
          expect(vm.render.calls.count()).toEqual(2)
          resolve()
        })
      })
    })
    .then(() => {
      done()
    })
  })
  it('render测试', (done) => {
    let tpromise = Promise.resolve().then(() => {
      return genLineData()
    })
    vm = createTest(Echart, {
      data: tpromise,
      series: [{
        key: 'bit_rx',
        name: '入流量',
      }, {
        key: 'bit_tx',
        name: '出流量',
      }],
      type: 'line',
    })
    Promise.resolve().then(() => {
      return vm.render(tpromise).then(() => {
        expect(vm.firstLoad).toBeFalsy()
      })
    })
    .then(() => {
      return vm.render(tpromise).then(() => {
        expect(vm.message).toEqual('')
      })
    })
    .then(() => {
      vm.increase = false
      tpromise = Promise.resolve().then(() => {
        return genLineData(1)
      })
      return vm.render(tpromise).then(() => {
        expect(vm.message).toEqual('')
      })
    })
    .then(() => {
      tpromise = Promise.reject()
      return vm.render(tpromise).then(() => {
        expect(vm.message).toEqual('Error')
      })
    })
    .then(() => {
      tpromise = Promise.resolve({})
      return vm.render(tpromise).then(() => {
        expect(vm.message).toEqual('Error')
      })
    })
    .then(() => {
      tpromise = Promise.resolve([])
      return vm.render(tpromise).then(() => {
        expect(vm.message).toEqual('没有数据')
      })
    })
    .then(() => {
      done()
    })
  })
  it('数据异常', (done) => {
    let tpromise = Promise.resolve().then(() => {
      return genPieData()
    })
    vm = createTest(Echart, {
      data: tpromise,
      type: 'pie',
    })
    Promise.resolve().then(() => {
      return vm.render(tpromise).then(() => {
        expect(vm.message).toEqual('Error')
      })
    })
    .then(() => {
      vm.series = [{
        stack: 'sss',
      }]
      return vm.render(tpromise).then(() => {
        expect(vm.message).toEqual('Error')
      })
    })
    .then(() => {
      done()
    })
  })
})

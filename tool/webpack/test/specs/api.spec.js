const request = require('rewire!api/index.js')

describe('api test', () => {
  it('prepareUrl test', () => {
    // eslint-disable-next-line no-underscore-dangle
    const prepareUrl = request.__get__('prepareUrl')
    const url = '/api/<labelid>/next/<id>'
    expect(prepareUrl(url, {
      labelid: 1,
      id: 2
    })).toBe('/api/1/next/2')
    expect(prepareUrl(url, {
      labelid: 1,
      id: 2,
      other: 3,
      some: 4
    })).toBe('/api/1/next/2?other=3&some=4')
    expect(prepareUrl(url, {
      labelid: 1,
      id: 2,
      other: [3, 4],
    })).toBe('/api/1/next/2?other=3&other=4')
    expect(prepareUrl(url, {
      labelid: 1,
      id: 2,
      zh: '中文',
    })).toBe('/api/1/next/2?zh=%E4%B8%AD%E6%96%87')
  })

  it('genConfig test', () => {
    // eslint-disable-next-line no-underscore-dangle
    const genConfig = request.__get__('genConfig')
    // eslint-disable-next-line no-underscore-dangle
    const TIMEOUT = request.__get__('TIMEOUT')
    let config1 = genConfig('/users/get', {
      urlQuery: {
        userid: 1
      },
      other: 2,
    })
    expect(config1.url).toBe('/api/users/1')
    expect(config1.method).toBe('get')
    expect(config1.data).toEqual({ other: 2 })
    expect(config1.timeout).toBe(TIMEOUT)
    expect(config1.headers).toEqual({
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json',
      Authorization: 'Bearer undefined'
    })
    expect('cancelToken' in config1).toBe(true)
    const config2 = genConfig('/npb/acls/delete', {
      urlQuery: {
        lcuuid: 1
      },
      other: 2,
      timeout: 0,
      onUploadProgress: () => {},
      onDownloadProgress: {},
    })
    expect(config2.url).toBe('/api/call')
    expect(config2.method).toBe('post')
    expect(config2.data).toEqual({
      url: '/v1/deepflow/npb-acls/1/',
      method: 'delete',
      apitype: 'app',
      data: {
        other: 2,
      },
    })
    expect(config2.timeout).toBeUndefined()
    expect(typeof config2.onUploadProgress).toBe('function')
    expect(config2.onDownloadProgress).toBeUndefined()
    const config3 = genConfig('/npb/acls', {
      urlQuery: {
        userid: 1
      },
      data: {
        other: 2,
      },
      timeout: 1000
    })
    expect(config3.url).toBe('/api/call')
    expect(config3.method).toBe('post')
    expect(config3.data).toEqual({
      url: '/v1/deepflow/npb-acls/?userid=1',
      method: 'get',
      apitype: 'app',
      data: {
        other: 2
      },
    })
    expect(config3.timeout).toBe(1000)
    const config4 = genConfig('/npb/acls', {
      urlQuery: {
        userid: 1
      },
      other: 2,
    })
    expect(config4.data).toEqual({
      url: '/v1/deepflow/npb-acls/?userid=1',
      method: 'get',
      apitype: 'app',
      data: {
        other: 2
      },
    })
  })
})

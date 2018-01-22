import {
  query,
  sizeFrom,
  fieldSource,
  sort,
  bool,
  must,
  mustNot,
  should,
  filter,
  minimumShouldMatch,
  term,
  exists,
  range,
  aggs,
  bucket,
  metric,
  build,
  termCode,
} from 'common/esKit.js'


describe('eskit', () => {
  it('单元测试', () => {
    const termIP = term('tag.ip', '192.168.1.1')
    const termIP2 = term('tag.ip', '10.33.1.1')
    const existsMac = exists('tag.mac')
    const rangTimestamp = range('timestamp', { gte: 123, lt: 345 })
    expect(termIP).toEqual({
      term: { 'tag.ip': '192.168.1.1' }
    })
    expect(existsMac).toEqual({
      exists: { field: 'tag.mac' }
    })
    expect(rangTimestamp).toEqual({
      range: { timestamp: { gte: 123, lt: 345 }}
    })
    expect(must(termIP)).toEqual({
      must: { term: { 'tag.ip': '192.168.1.1' }}
    })
    expect(must(termIP, existsMac)).toEqual({
      must: [
        { term: { 'tag.ip': '192.168.1.1' }},
        { exists: { field: 'tag.mac' }},
      ]
    })
    expect(should(termIP)).toEqual({
      should: { term: { 'tag.ip': '192.168.1.1' }}
    })
    expect(minimumShouldMatch(1)).toEqual({
      minimum_should_match: 1
    })
    expect(should(termIP, termIP2)).toEqual({
      should: [
        { term: { 'tag.ip': '192.168.1.1' }},
        { term: { 'tag.ip': '10.33.1.1' }},
      ]
    })
    expect(mustNot(termIP)).toEqual({
      must_not: { term: { 'tag.ip': '192.168.1.1' }}
    })
    expect(mustNot(termIP, termIP2)).toEqual({
      must_not: [
        { term: { 'tag.ip': '192.168.1.1' }},
        { term: { 'tag.ip': '10.33.1.1' }},
      ]
    })
    expect(filter(termIP)).toEqual({
      filter: { term: { 'tag.ip': '192.168.1.1' }}
    })
    expect(filter(termIP, termIP2)).toEqual({
      filter: [
        { term: { 'tag.ip': '192.168.1.1' }},
        { term: { 'tag.ip': '10.33.1.1' }},
      ]
    })
    expect(bucket('flow', 'term', 'tag.ip')).toEqual({
      flow: { term: { field: 'tag.ip' }}
    })
    expect(bucket('flow', 'term', { field: 'tag.ip', size: 10 })).toEqual({
      flow: { term: { field: 'tag.ip', size: 10 }}
    })
    expect(metric('bit_rx', 'sum', 'sum.bit_rx')).toEqual({
      bit_rx: { sum: { field: 'sum.bit_rx' }}
    })
    expect(sizeFrom(10, 10)).toEqual({
      size: 10,
      from: 10,
    })
    expect(fieldSource(
      ['flow.arr_time_0_0', 'flow.end_time', 'flow.close_type'],
      false
    )).toEqual({
      stored_fields: ['flow.arr_time_0_0', 'flow.end_time', 'flow.close_type'],
      _source: false,
    })
    expect(sort({ timestamp: 'asc' })).toEqual({
      sort: {
        timestamp: 'asc'
      }
    })
    expect(sort([
      { timestamp: 'desc' },
      { 'tag.ip': 'asc' }
    ])).toEqual({
      sort: [
        { timestamp: 'desc' },
        { 'tag.ip': 'asc' },
      ]
    })
    expect(termCode('dfi_bw_usage_isp', ['tag.ip', 'tag.epc_id'])).toEqual({
      term: { 'tag._code': 3 }
    })
  })

  it('集成测试', () => {
    expect(bool(
      should(term('tag.ip', '192.122.1.1')),
      should(
        term('tag.ip', '192.122.1.2'),
        term('tag.ip', '192.122.1.3'),
      ),
      must(term('tag.ip', '192.122.1.1')),
      must(term('tag.ip', '192.122.1.1')),
      must(term('tag.ip', '192.122.1.1')),
      must(
        term('tag.ip', '192.122.1.1'),
        term('tag.ip', '192.122.1.1'),
      ),
    )).toEqual({
      bool: {
        should: [
          { term: { 'tag.ip': '192.122.1.1' }},
          { term: { 'tag.ip': '192.122.1.2' }},
          { term: { 'tag.ip': '192.122.1.3' }},
        ],
        must: [
          { term: { 'tag.ip': '192.122.1.1' }},
          { term: { 'tag.ip': '192.122.1.1' }},
          { term: { 'tag.ip': '192.122.1.1' }},
          { term: { 'tag.ip': '192.122.1.1' }},
          { term: { 'tag.ip': '192.122.1.1' }},
        ]
      }
    })
    const bool2 = bool(
      must(term('tag.ip', '192.122.1.1')),
      should(
        term('tag.mac', '12:12:12:12:12:12'),
        term('tag.mac', '12:12:12:12:ab:ab'),
      ),
      mustNot(
        exists('tag.proto'),
        exists('tag.port'),
        exists('tag.host'),
      ),
      filter(
        range('timestamp', { gte: 123456789, lt: 34567890 }),
        bool(should(
          term('tag.ip', '10.33.1.1'),
          term('tag.ip', '10.33.1.2')
        ))
      )
    )
    expect(query(bool2, term('tag.vlan', 1))).toEqual({
      query: {
        bool: {
          must: {
            term: { 'tag.ip': '192.122.1.1' }
          },
          should: [
            { term: { 'tag.mac': '12:12:12:12:12:12' }},
            { term: { 'tag.mac': '12:12:12:12:ab:ab' }},
          ],
          must_not: [
            { exists: { field: 'tag.proto' }},
            { exists: { field: 'tag.port' }},
            { exists: { field: 'tag.host' }},
          ],
          filter: [
            { range: { timestamp: { gte: 123456789, lt: 34567890 }}},
            { bool: {
              should: [
                { term: { 'tag.ip': '10.33.1.1' }},
                { term: { 'tag.ip': '10.33.1.2' }},
              ]
            }}
          ]
        },
        term: { 'tag.vlan': 1 },
      }
    })
    const metricSum = metric('sum_bit_rx', 'sum', 'sum.bit_rx')
    const bucketMac = bucket('mac', 'term', 'tag.mac', aggs(metricSum))
    const bucketIP = bucket('ip', 'term', 'tag.ip', aggs(metricSum))
    expect(aggs(bucketMac, bucketIP)).toEqual({
      aggs: {
        mac: {
          term: { field: 'tag.mac' },
          aggs: {
            sum_bit_rx: { sum: { field: 'sum.bit_rx' }}
          }
        },
        ip: {
          term: { field: 'tag.ip' },
          aggs: {
            sum_bit_rx: { sum: { field: 'sum.bit_rx' }}
          }
        }
      }
    })
    expect(build(
      fieldSource(null, false),
      sizeFrom(100),
      sort('timestamp'),
      query(bool2),
      aggs(bucketMac),
    )).toEqual({
      _source: false,
      size: 100,
      sort: { timestamp: 'desc' },
      query: {
        bool: {
          must: {
            term: { 'tag.ip': '192.122.1.1' }
          },
          should: [
            { term: { 'tag.mac': '12:12:12:12:12:12' }},
            { term: { 'tag.mac': '12:12:12:12:ab:ab' }},
          ],
          must_not: [
            { exists: { field: 'tag.proto' }},
            { exists: { field: 'tag.port' }},
            { exists: { field: 'tag.host' }},
          ],
          filter: [
            { range: { timestamp: { gte: 123456789, lt: 34567890 }}},
            { bool: {
              should: [
                { term: { 'tag.ip': '10.33.1.1' }},
                { term: { 'tag.ip': '10.33.1.2' }},
              ]
            }}
          ]
        },
      },
      aggs: {
        mac: {
          term: { field: 'tag.mac' },
          aggs: {
            sum_bit_rx: { sum: { field: 'sum.bit_rx' }}
          }
        },
      }
    })
  })
})

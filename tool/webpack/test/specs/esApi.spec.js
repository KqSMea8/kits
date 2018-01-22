import {
  query,
  bool,
  must,
  mustNot,
  filter,
  exists,
  range,
  term,
  aggs,
  bucket,
  metric,
  build,
} from 'common/esKit.js'

import esapi from 'rewire!api/esApi.js'
import esData from '../mock/esData.json'

const { aggs_3_level, hits_fill, aggs_fill } = esData

describe('esapi', () => {
  it('analyzeQuery and reduceData', () => {
    const queryBody = build(
      query(
        bool(
          filter(
            range('timestamp', { gte: 123456789, lt: 234567890 }),
            bool(
              mustNot(
                exists('tag.epc_id'),
                exists('tag.ip'),
                exists('tag.proto'),
              ),
              must(
                exists('tag.ip'),
              )
            ),
            term('tag._code', 0)
          )
        )
      ),
      aggs(
        bucket('ip', 'terms', 'tag.ip', aggs(
          bucket('epc', 'terms', 'tag.epc_id', aggs(
            metric('bit_rx', 'sum', 'sum.bit_rx'),
            metric('bit_tx', 'sum', 'sum.bit_tx'),
          ))
        )),
        bucket('ip', 'terms', 'tag.ip', aggs(
          bucket('epc', 'terms', 'tag.epc_id', aggs(
            metric('bit_rx', 'sum', 'sum.bit_rx'),
            metric('bit_tx', 'sum', 'sum.bit_tx'),
          ))
        ))
      )
    )
    // eslint-disable-next-line no-underscore-dangle
    const analyzeQuery = esapi.__get__('analyzeQuery')
    const options = analyzeQuery('/es/wan', queryBody)
    expect(options).toEqual({
      field: '_source',
      aggTimestamp: false,
      query: queryBody,
      needTimestamp: true,
    })

    // eslint-disable-next-line no-underscore-dangle
    const reduceData = esapi.__get__('reduceData')
    expect(reduceData(aggs_3_level, options)).toEqual({
      hits: [
        {
          max: {
            bit_rx: 64715872,
            bit_rx_ts: 1493092341,
            bit_tx: 32326136,
            bit_tx_ts: 1493092341,
            closed_flow_count: 44398,
            closed_flow_count_ts: 1493092274,
            flow_count: 115597,
            flow_count_ts: 1493092380,
            packet_rx: 57021,
            packet_rx_ts: 1493092341,
            packet_tx: 57021,
            packet_tx_ts: 1493092341
          },
          sum: {
            bit_rx: 34466222112,
            bit_tx: 16946301468,
            closed_flow_count: 18457848,
            flow_count: 18457848,
            packet_rx: 29751872,
            packet_tx: 29833428
          },
          tag: {
            _id: '192.168.8.20 9 3',
            epc_id: 9,
            ip: '192.168.8.20'
          },
          timestamp: 1493078400
        },
        {
          max: {
            bit_rx: 4426528,
            bit_rx_ts: 1493209275,
            bit_tx: 271499061,
            bit_tx_ts: 1493209253,
            closed_flow_count: 4,
            closed_flow_count_ts: 1493209179,
            flow_count: 4,
            flow_count_ts: 1493209179,
            packet_rx: 8137,
            packet_rx_ts: 1493209275,
            packet_tx: 23069,
            packet_tx_ts: 1493209253
          },
          sum: {
            bit_rx: 872384288,
            bit_tx: 55308713696,
            closed_flow_count: 15,
            flow_count: 15,
            packet_rx: 1603277,
            packet_tx: 4701385
          },
          tag: {
            _id: '192.168.8.27 9 3',
            epc_id: 9,
            ip: '192.168.8.27'
          },
          timestamp: 1493164800
        }
      ],
      aggregations: {
        ip: [
          {
            key: '192.168.8.20',
            doc_count: 12,
            epc: [
              {
                key: 9,
                doc_count: 12,
                bit_rx: {
                  value: 64715872
                },
                bit_tx: {
                  value: 32326136
                }
              }
            ]
          },
          {
            key: '192.168.8.21',
            doc_count: 4,
            epc: [
              {
                key: 9,
                doc_count: 4,
                bit_rx: {
                  value: 8475
                },
                bit_tx: {
                  value: 8685
                }
              }
            ]
          }
        ],
        mac: [
          {
            key: '192.168.8.20',
            doc_count: 12,
            epc: [
              {
                key: 9,
                doc_count: 12,
                bit_rx: {
                  value: 64715872
                },
                bit_tx: {
                  value: 32326136
                }
              }
            ]
          },
          {
            key: '192.168.8.21',
            doc_count: 4,
            epc: [
              {
                key: 9,
                doc_count: 4,
                bit_rx: {
                  value: 8475
                },
                bit_tx: {
                  value: 8685
                }
              }
            ]
          }
        ]
      },
      total: 31,
    })
  })

  it('fillTimestamp', () => {
    const timestamp = {
      startTime: 1493078300,
      endTime: 1493078630,
      intervalNum: 60,
      intervalStr: '1MINUTE',
    }
    // eslint-disable-next-line no-underscore-dangle
    const getTimestampMap = esapi.__get__('getTimestampMap')
    const hitsTimestampMap = getTimestampMap(hits_fill, 'hits').timestampMap
    const hitsTimestampArr = [...hitsTimestampMap.keys()]
    expect(hitsTimestampArr).toEqual([
      1493078400,
      1493078520,
    ])

    // eslint-disable-next-line no-underscore-dangle
    const genFullTimestamp = esapi.__get__('genFullTimestamp')
    expect(genFullTimestamp(_.min(hitsTimestampArr), timestamp)).toEqual([
      1493078400,
      1493078460,
      1493078520,
      1493078580,
      1493078340,
    ])

    // eslint-disable-next-line no-underscore-dangle
    const genHitsTpl = esapi.__get__('genHitsTpl')
    expect(genHitsTpl(hits_fill[0], 1493078460, true)).toEqual({
      max: {
        bit_rx: 0,
        bit_rx_ts: 0,
        bit_tx: 0,
        bit_tx_ts: 0,
        closed_flow_count: 0,
        closed_flow_count_ts: 0,
        flow_count: 0,
        flow_count_ts: 0,
        packet_rx: 0,
        packet_rx_ts: 0,
        packet_tx: 0,
        packet_tx_ts: 0,
      },
      sum: {
        bit_rx: 0,
        bit_tx: 0,
        closed_flow_count: 0,
        flow_count: 0,
        packet_rx: 0,
        packet_tx: 0,
      },
      tag: {
        _id: '192.168.8.20 9 3',
        epc_id: 9,
        ip: '192.168.8.20'
      },
      timestamp: 1493078460,
      template: 0
    })

    const aggsTimestampMap = getTimestampMap(aggs_fill, 'aggs').timestampMap
    const aggsTimestampArr = [...aggsTimestampMap.keys()]
    expect(aggsTimestampArr).toEqual([
      1493078400,
    ])

    expect(genFullTimestamp(_.min(aggsTimestampArr), timestamp)).toEqual([
      1493078400,
      1493078460,
      1493078520,
      1493078580,
      1493078340,
    ])
     // eslint-disable-next-line no-underscore-dangle
    const genAggsTpl = esapi.__get__('genAggsTpl')
    expect(genAggsTpl(aggs_fill[0], 1493078460, false)).toEqual({
      key: 1493078460000,
      key_as_string: '1493078460',
      doc_count: undefined,
      bit_rx: {
        value: undefined
      },
      bit_tx: {
        value: undefined
      },
      template: undefined
    })

    expect(esapi.fillTimestamp(hits_fill, timestamp, 'hits')).toEqual([
      {
        max: {
          bit_rx: 64715872,
          bit_rx_ts: 1493092341,
          bit_tx: 32326136,
          bit_tx_ts: 1493092341,
          closed_flow_count: 44398,
          closed_flow_count_ts: 1493092274,
          flow_count: 115597,
          flow_count_ts: 1493092380,
          packet_rx: 57021,
          packet_rx_ts: 1493092341,
          packet_tx: 57021,
          packet_tx_ts: 1493092341
        },
        sum: {
          bit_rx: 34466222112,
          bit_tx: 16946301468,
          closed_flow_count: 18457848,
          flow_count: 18457848,
          packet_rx: 29751872,
          packet_tx: 29833428
        },
        tag: {
          _id: '192.168.8.20 9 3',
          epc_id: 9,
          ip: '192.168.8.20'
        },
        timestamp: 1493078400
      },
      {
        max: {
          bit_rx: 4426528,
          bit_rx_ts: 1493209275,
          bit_tx: 271499061,
          bit_tx_ts: 1493209253,
          closed_flow_count: 4,
          closed_flow_count_ts: 1493209179,
          flow_count: 4,
          flow_count_ts: 1493209179,
          packet_rx: 8137,
          packet_rx_ts: 1493209275,
          packet_tx: 23069,
          packet_tx_ts: 1493209253
        },
        sum: {
          bit_rx: 872384288,
          bit_tx: 55308713696,
          closed_flow_count: 15,
          flow_count: 15,
          packet_rx: 1603277,
          packet_tx: 4701385
        },
        tag: {
          _id: '192.168.8.27 9 3',
          epc_id: 9,
          ip: '192.168.8.27'
        },
        timestamp: 1493078520
      },
      {
        max: {
          bit_rx: 0,
          bit_rx_ts: 0,
          bit_tx: 0,
          bit_tx_ts: 0,
          closed_flow_count: 0,
          closed_flow_count_ts: 0,
          flow_count: 0,
          flow_count_ts: 0,
          packet_rx: 0,
          packet_rx_ts: 0,
          packet_tx: 0,
          packet_tx_ts: 0,
        },
        sum: {
          bit_rx: 0,
          bit_tx: 0,
          closed_flow_count: 0,
          flow_count: 0,
          packet_rx: 0,
          packet_tx: 0,
        },
        tag: {
          _id: '192.168.8.20 9 3',
          epc_id: 9,
          ip: '192.168.8.20'
        },
        timestamp: 1493078460,
        template: 0
      },
      {
        max: {
          bit_rx: undefined,
          bit_rx_ts: undefined,
          bit_tx: undefined,
          bit_tx_ts: undefined,
          closed_flow_count: undefined,
          closed_flow_count_ts: undefined,
          flow_count: undefined,
          flow_count_ts: undefined,
          packet_rx: undefined,
          packet_rx_ts: undefined,
          packet_tx: undefined,
          packet_tx_ts: undefined
        },
        sum: {
          bit_rx: undefined,
          bit_tx: undefined,
          closed_flow_count: undefined,
          flow_count: undefined,
          packet_rx: undefined,
          packet_tx: undefined
        },
        tag: {
          _id: '192.168.8.20 9 3',
          epc_id: 9,
          ip: '192.168.8.20'
        },
        timestamp: 1493078580,
        template: undefined
      },
      {
        max: {
          bit_rx: undefined,
          bit_rx_ts: undefined,
          bit_tx: undefined,
          bit_tx_ts: undefined,
          closed_flow_count: undefined,
          closed_flow_count_ts: undefined,
          flow_count: undefined,
          flow_count_ts: undefined,
          packet_rx: undefined,
          packet_rx_ts: undefined,
          packet_tx: undefined,
          packet_tx_ts: undefined
        },
        sum: {
          bit_rx: undefined,
          bit_tx: undefined,
          closed_flow_count: undefined,
          flow_count: undefined,
          packet_rx: undefined,
          packet_tx: undefined
        },
        tag: {
          _id: '192.168.8.20 9 3',
          epc_id: 9,
          ip: '192.168.8.20'
        },
        timestamp: 1493078340,
        template: undefined
      },
    ])
    expect(esapi.fillTimestamp(aggs_fill, timestamp, 'aggs')).toEqual([
      {
        key: 1493078400000,
        key_as_string: '1493078400',
        doc_count: 1,
        bit_rx: {
          value: 1440
        },
        bit_tx: {
          value: 1440
        }
      },
      {
        key: 1493078460000,
        key_as_string: '1493078460',
        doc_count: undefined,
        bit_rx: {
          value: undefined
        },
        bit_tx: {
          value: undefined
        },
        template: undefined
      },
      {
        key: 1493078520000,
        key_as_string: '1493078520',
        doc_count: undefined,
        bit_rx: {
          value: undefined
        },
        bit_tx: {
          value: undefined
        },
        template: undefined
      },
      {
        key: 1493078580000,
        key_as_string: '1493078580',
        doc_count: undefined,
        bit_rx: {
          value: undefined
        },
        bit_tx: {
          value: undefined
        },
        template: undefined
      },
      {
        key: 1493078340000,
        key_as_string: '1493078340',
        doc_count: undefined,
        bit_rx: {
          value: undefined
        },
        bit_tx: {
          value: undefined
        },
        template: undefined
      },
    ])
  })
})

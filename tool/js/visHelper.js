import vis from 'vis'
import {
  merge
} from './tool'

const color = '#9ea6a8' // 字体颜色
const bgColor = '#212326'  // 背景色
const shadow = 'rgba(0, 0, 0, 0.3)' // 阴影
const chosenShadow = 'rgba(255, 255, 255, 0.1)'  // 选中阴影
const graphColor = { // 节点和连线颜色
  node: {
    default: {
      selected: {
        color: '#fff',
        border: '#434849',
        background: '#00a4de',
      },
      normal: {
        color: color,
        border: '#434849',
        background: '#212326',
      },
      hiden: '#499daa'
    },
    work: {
      selected: '#54d311',
      normal: '#3AA308',
      hiden: '#307a09',
    },
    warning: {
      selected: '#fcd515',
      normal: '#D1BA15',
      hiden: '#a58a02',
    },
    error: {
      selected: '#e21414',
      normal: '#9E1919',
      hiden: '#7c1515',
    },
  },
  edge: {
    default: {
      selected: '#4bd8ef',
      normal: {
        color: '#13ce66',
        hover: '#212326',
      },
      hiden: '#499daa'
    },
    work: {
      selected: '#54d311',
      normal: '#3AA308',
      hiden: '#307a09',
    },
    warning: {
      selected: '#fcd515',
      normal: '#D1BA15',
      hiden: '#a58a02',
    },
    error: {
      selected: '#e21414',
      normal: '#9E1919',
      hiden: '#7c1515',
    },
  },
  icon: {
    default: {
      selected: '#4bd8ef',
      normal: '#434849',
      hiden: '#499daa'
    },
    work: {
      selected: '#54d311',
      normal: '#3AA308',
      hiden: '#307a09',
    },
    warning: {
      selected: '#fcd515',
      normal: '#D1BA15',
      hiden: '#a58a02',
    },
    error: {
      selected: '#e21414',
      normal: '#9E1919',
      hiden: '#7c1515',
    },

  }
}

const icon = {
  internet: '\ue906',
  broadcast: '\ue907',
}

class Vis {
  _options = {
    autoResize: true,
    width: '100%',
    height: '100%',
    clickToUse: false,
    nodes: {
      shape: 'box',
      font: {
        color: color,
        size: 12,
      },
      color: {
        border: bgColor,
      },
      chosen: {
        node(values) {
          values.shadowColor = chosenShadow
        },
        label: true,
      },
      size: 25,
      widthConstraint: {
        minimum: 100,
        maximum: 120,
      },
      heightConstraint: {
        minimum: 25,
      },
      shadow: {
        enabled: true,
        color: shadow,
        size: 15,
      },
    },
    edges: {
      arrows: {}, // 连线出现箭头
      arrowStrikethrough: true,
      smooth: {
        type: 'horizontal',
        forceDirection: 'vertical',
        roundness: 0,
      },
      width: 1,
      shadow: {
        enabled: true,
        color: shadow,
        size: 5,
        x: 3,
        y: 3
      },
    },
    interaction: {
      hover: true,
      multiselect: true,
    },
    physics: {
      enabled: false,
    },
    groups: {},
  }
  _topoDom = ''
  _simulation = false
  _simulationOpen = false
  _graph = null
  _nodeDs = null
  _nodeState = {}
  _edgeDs = null
  _edgeState = {}
  _onClickHandler = null
  _onContextHandler = null
  _viewPosition = {}
  _highlightActive = false
  _liveColor = false
  _threshold = {
    work: 700,
    warning: 900,
    error: 1000,
  }

  static STATE = {
    NORMAL: 'normal',
    SELECTED: 'selected',
    HIDDEN: 'hidden',
  }

  constructor(topoDom, options = {}) {
    this._topoDom = topoDom
    this._formatOptions(options)
  }

  _formatOptions(options) {
    if (options.simulation) {
      this._simulation = true
      this._openSimulation()
    }
    this._liveColor = options.liveColor
    if (options.liveColor) {
      this._threshold = options.threshold
    }
    if (_.hasIn(options, 'height')) {
      this._options.height = options.height
    }
  }

  _getColor(type) {
    return (value, state = Vis.STATE.NORMAL) => {
      if (this._liveColor) {
        if (value === 0) {
          return graphColor[type].default[state]
        } else if (value < this._threshold.work) {
          return graphColor[type].work[state]
        } else if (value < this._threshold.warning) {
          return graphColor[type].warning[state]
        } else {
          return graphColor[type].error[state]
        }
      } else {
        return graphColor[type].default[state]
      }
    }
  }

  _genNodes(nodes) {
    let y = 0
    let tmp = nodes.map(node => {
      this._nodeState[node.id] = this._nodeState[node.id] || Vis.STATE.NORMAL
      let nodeColor = this._getColor('node')(node.value, node.state)
      let rtn = {
        id: node.id,
        rawInfo: node.rawInfo,
        label: node.label,
        group: node.group,
        rawValue: node.value,
        color: nodeColor,
        font: {
          color: nodeColor.color,
        },
        shape: node.shape.type,
        level: node.level,
        size: 30,
        x: node.x,
        y: node.y,
        hidden: node.hidden || false,
      }
      if (this._liveColor) {
        rtn.title = `流量：${node.value}<br>`
      }
      if (node.title) {
        rtn.title = node.title
      }
      if (node.shape.type === 'icon') {
        rtn.icon = {
          face: 'ysFont',
          code: icon[node.shape.name],
          size: node.shape.size || 30,
        }
      } else if (node.shape.type === 'image') {
        rtn.image = node.shape.image
        rtn.size = node.shape.size || 15
      }
      y = y < node.y ? node.y : y
      return rtn
    })
    this._options.height = y > 500 ? y + 'px' : this._options.height;
    return tmp
  }

  _genEdges(edges) {
    return edges.map(edge => {
      this._edgeState[edge.id] = this._edgeState[edge.id] || Vis.STATE.NORMAL
      let rtn = {
        id: edge.id,
        from: edge.from,
        to: edge.to,
        rawValue: edge.value,
        rawInfo: edge.rawInfo,
        color: this._getColor('edge')(edge.value, Vis.STATE.NORMAL),
        hidden: edge.hidden || false,
        chosen: {
          edge(values, id, selected, hovering) {
            values.width = 2
          },
        },
      }
      if (this._liveColor) {
        //
      }
      if (edge.title) {
        rtn.title = edge.title
      }
      return rtn
    })
  }

  _openSimulation() {
    this._simulationOpen = true
    this._options.physics = {
      repulsion: {
        centralGravity: 2,
        springLength: 60,
        springConstant: 0.05,
        nodeDistance: 100,
        damping: 0.2,
      },
      barnesHut: {
        gravitationalConstant: -600,
        damping: 0.1,
        springLength: 40,
        springConstant: 0.01,
        centralGravity: 0.3,
        avoidOverlap: 0.65,
      },
      solver: 'barnesHut',
      timestep: 0.5,
      minVelocity: 1,
      maxVelocity: 20,
    }
    this._options.edges.smooth = {
      type: 'continuous',
      forceDirection: 'none',
      roundness: 0,
    }
    this._graph && this._graph.setOptions(this._options)
  }

  _closeSimulation() {
    if (this._simulationOpen) {
      this._simulationOpen = false
      this._options.physics = {
        enabled: false
      }
      this._options.edges.smooth = {
        type: 'horizontal',
        forceDirection: 'vertical',
        roundness: 0,
      }
      this._graph.setOptions(this._options)
    }
  }

  _onClick = ({
    nodes,
    edges,
    event,
    pointer,
  }) => {
    if (nodes.length === 0 && edges.length === 0) {
      if (this._highlightActive) {
        this._highlightActive = false
        const nodesTmp = this._nodeDs.map(node => {
          this._nodeState[node.id] = Vis.STATE.NORMAL
          return {
            id: node.id,
            color: this._getColor('node')(node.value)[Vis.STATE.NORMAL],
            hidden: false,
          }
        })
        this._nodeDs.update(nodesTmp)
        const edgesTmp = this._edgeDs.map(edge => {
          this._edgeState[edge.id] = Vis.STATE.NORMAL
          return {
            id: edge.id,
            color: this._getColor('edge')(edge.value)[Vis.STATE.NORMAL],
            hidden: false,
          }
        })
        this._edgeDs.update(edgesTmp)
      }
    } else {
      this._highlightActive = true
      if (_.isFunction(this._onClickHandler)) {
        this._onClickHandler({
          nodes: this._nodeDs.get(nodes),
          edges: this._edgeDs.get(edges),
          event,
          pointer,
        })
      }
    }
  }

  _onContext = ({
    nodes,
    edges,
    event,
    pointer,
  }) => {
    if (_.isFunction(this._onContextHandler)) {
      this._onContextHandler({
        nodes,
        edges,
        event,
        pointer,
      })
    }
  }

  _onHoverNode = () => {
    this._topoDom.style.cursor = 'pointer'
  }

  _onBlurNode = () => {
    this._topoDom.style.cursor = 'default'
  }

  _onHoverEdge = () => {
    this._topoDom.style.cursor = 'pointer'
  }

  _onBlurEdge = () => {
    this._topoDom.style.cursor = 'default'
  }

  _onStabilizationDone = () => {
    this._closeSimulation()
  }

  _onDragStart = () => {
    this._closeSimulation()
  }

  _onDragEnd = () => {
    this._viewPosition = this._graph.getViewPosition()
  }

  _onZoom = params => {
    if (params.scale > 4) {
      this._graph.moveTo({
        scale: 4,
        position: this._viewPosition,
      })
    } else if (params.scale > 0.4) {
      this._viewPosition = this._graph.getViewPosition()
    } else {
      this._graph.moveTo({
        scale: 0.4,
        position: this._viewPosition,
      })
    }
  }

  render({ nodes = [], edges = [] }) {
    this._nodeDs = new vis.DataSet(this._genNodes(nodes))
    this._edgeDs = new vis.DataSet(this._genEdges(edges))
    this._graph = new vis.Network(this._topoDom, {
      nodes: this._nodeDs,
      edges: this._edgeDs,
    }, this._options)
    this._graph.on('click', this._onClick)
    this._graph.on('oncontext', this._onContext)
    this._graph.on('hoverNode', this._onHoverNode)
    this._graph.on('blurNode', this._onBlurNode)
    this._graph.on('hoverEdge', this._onHoverEdge)
    this._graph.on('blurEdge', this._onBlurEdge)
    this._graph.on('dragStart', this._onDragStart)
    this._graph.on('dragEnd', this._onDragEnd)
    this._graph.on('zoom', this._onZoom)
    this._viewPosition = this._graph.getViewPosition()
  }

  update({ nodes, edges }, simulation) {
    if (this._simulation) {
      this._openSimulation()
    }
    if (simulation === false) {
      this._closeSimulation()
    }
    const rmEdges = _.differenceBy(this._edgeDs.get(), edges, 'id')
    this._edgeDs.remove(rmEdges)
    const edgeData = this._genEdges(edges)
    this._edgeDs.update(edgeData)
    const rmNodes = _.differenceBy(this._nodeDs.get(), nodes, 'id')
    this._nodeDs.remove(rmNodes)
    const nodeData = this._genNodes(nodes)
    this._nodeDs.update(nodeData)
  }

  updateOptions(options) {
    merge(this._options.edges, options.edges)
    merge(this._options.nodes, options.nodes)
    merge(this._options.physics, options.physics)
  }

  on(name, handler) {
    if (_.isFunction(handler)) {
      if (name === 'click') {
        this._onClickHandler = handler
      } else if (name === 'context') {
        this._onContextHandler = handler
      }
    }
  }

  destroy() {
    this._nodeDs && this._nodeDs.clear()
    this._edgeDs && this._edgeDs.clear()
    if (this._graph) {
      this._graph.off('click')
      this._graph.off('oncontext')
      this._graph.off('hoverNode')
      this._graph.off('blurNode')
      this._graph.off('hoverEdge')
      this._graph.off('blurEdge')
      this._graph.off('dragStart')
      this._graph.off('dragEnd')
      this._graph.off('zoom')
    }
  }
}

export default Vis

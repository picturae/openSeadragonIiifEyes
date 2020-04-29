import { isUsableNumber, roundAt } from './utilities'
import imageEyes from 'imageEyes'

const $ = window.OpenSeadragon
let viewer
let options
let mouseTracker

const stdOptions = {
    info: '',
    viewer: null,
    callback: channelArray => console.log(channelArray.join()),
    sampleSize: 1,
}

const mouseHandler = function(event) {
    // canvas hover position
    console.log('x,y', event.position.x, event.position.y)
}

const sanitiseOptions = currOptions => {
    options = Object.assign({}, stdOptions, currOptions)
    if (!options.viewer || !options.info || !options.callback) return

    options.info = JSON.parse(options.info)
    if (options.info['@id']) {
        options.baseUrl = options.info['@id']
    }
    if (!options.baseUrl) return

    if (typeof options.callback !== 'function') return

    return options
}

const loader = async function(currOptions) {
    const options = sanitiseOptions(currOptions)
    if (!options) return
    viewer = options.viewer

    mouseTracker = new $.MouseTracker({
        element: viewer.canvas,
        moveHandler: $.delegate(this, mouseHandler),
    })

    var tlCount = 0
    viewer.addHandler('tile-loaded', function(tile) {
        console.log('tile-loaded  ', tile, tlCount++)
    })

    viewer.addHandler('tile-unloaded', function(tile) {
        console.log('tile-unloaded  ', tile)
    })

    // rubbish to get it build
    const eyesApi = await imageEyes(tile.url)

    //const eyesApi = await imageEyes(url)

    return eyesApi
}

export default loader

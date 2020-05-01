import { isUsableNumber, roundAt } from './utilities'
import { TileCollection } from './tileCollection'
import imageEyes from 'imageEyes'

const $ = window.OpenSeadragon
let viewer
let options
let tileCollection
let mouseTracker

const stdOptions = {
    info: '',
    viewer: null,
    callback: (xyArray, channelArray) => {
        console.log(xyArray.join())
        console.log(channelArray.join())
    },
    sampleSize: 1,
}

const mouseHandler = async function(event) {
    const mousePoint = new $.Point(event.position.x, event.position.y)
    const tile = tileCollection.find(mousePoint)

    if (!tile) return

    // hover position relatiev to the main image
    const tiledImage = viewer.world.getItemAt(0)
    let coordinate = tiledImage.viewerElementToImageCoordinates(mousePoint)
    coordinate = [Math.floor(coordinate.x), Math.floor(coordinate.y)]

    // get color data async
    const eyesApi = await imageEyes(tile.url)
    const color = eyesApi.getPixelColor(tile.point.x, tile.point.y) || [, ,]
    options.callback(coordinate, color)
}

const sanitiseOptions = customOptions => {
    const opts = Object.assign({}, stdOptions, customOptions)
    if (!opts.viewer || !opts.info || !opts.callback) return

    opts.info = JSON.parse(opts.info)
    if (opts.info['@id']) {
        opts.baseUrl = opts.info['@id'] + '/'
    } else if (opts.info.Image.Url) {
        opts.baseUrl = opts.info.Image.Url
    }
    if (!opts.baseUrl) return

    if (typeof opts.callback !== 'function') return

    return opts
}

const loader = function(customOptions) {
    options = sanitiseOptions(customOptions)
    if (!options) return
    viewer = options.viewer
    tileCollection = new TileCollection(
        options.baseUrl,
        options.info.width,
        options.info.height,
    )

    mouseTracker = new $.MouseTracker({
        element: viewer.canvas,
        moveHandler: $.delegate(this, mouseHandler),
    })

    viewer.addHandler('tile-loaded', function(tile) {
        tileCollection.add(tile.tile)
        // console.log('tile-loaded  ', tile, tile.tile.cacheKey)
    })

    viewer.addHandler('tile-unloaded', function(tile) {
        tileCollection.remove(tile.tile)
        // console.log('tile-unloaded  ', tile)
    })
}

export default loader

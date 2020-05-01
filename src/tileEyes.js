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
    callback: channelArray => console.log(channelArray.join()),
    sampleSize: 1,
}

const mouseHandler = function(event) {
    // canvas hover position
    console.log('x,y', event.position.x, event.position.y)

    const tiledImage = viewer.world.getItemAt(0)

    // hover position relatiev to the main image
    const largeImageHoverPosition = tiledImage.viewerElementToImageCoordinates(
        new $.Point(event.position.x, event.position.y),
    )
    console.log(
        'tiledImage.viewerElementToImageCoordinates',
        largeImageHoverPosition,
    )

    // size of the main image
    const largeImageSize = tiledImage.getContentSize()
    console.log('tiledImage.getContentSize()', largeImageSize)

    const offHorizontally =
        largeImageHoverPosition.x < 0 ||
        largeImageHoverPosition.x > largeImageSize.x
    const offVertically =
        largeImageHoverPosition.y < 0 ||
        largeImageHoverPosition.y > largeImageSize.y
    const isHovering = !offHorizontally && !offVertically

    console.log('isHovering', isHovering)

    if (!isHovering) return
    //find the right tile

    const tileUrl = tileCollection.find(largeImageHoverPosition)
    console.log('isHovering', isHovering)
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

    // rubbish to get it build
    const eyesApi = await imageEyes(tile.url)

    //const eyesApi = await imageEyes(url)

    return eyesApi
}

export default loader

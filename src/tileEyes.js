import { isUsableNumber, roundAt } from './utilities'
import imageEyes from 'imageEyes'

const $ = window.OpenSeadragon
let viewer
let options
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
    const tiledImage = viewer.world.getItemAt(0)

    // hover position relative to the main image
    const realHoverPosition = tiledImage.viewerElementToImageCoordinates(
        mousePoint,
    )
    // size of the main image
    const realSize = tiledImage.getContentSize()

    // test hovering the main image
    const offHorizontally =
        realHoverPosition.x < 0 || realHoverPosition.x > realSize.x
    const offVertically =
        realHoverPosition.y < 0 || realHoverPosition.y > realSize.y
    const isHovering = !offHorizontally && !offVertically

    if (!isHovering) return

    //find the right tile
    const coordinate = [
        Math.floor(realHoverPosition.x),
        Math.floor(realHoverPosition.y),
    ]
    const iiifPath = [
        `${coordinate[0] - options.sampleRadius},${coordinate[1] -
            options.sampleRadius},${options.sampleDiameter},${
            options.sampleDiameter
        }`,
        'full',
        0,
        `default.${options.fileFormat}`,
    ]

    const tileUrl = options.baseUrl + iiifPath.join('/')

    // get color data async
    const eyesApi = await imageEyes(tileUrl)
    const eyeDropper = options.sampleRadius
        ? eyesApi.getPixelColor
        : eyesApi.getDropColor
    const color = eyeDropper(
        options.sampleRadius,
        options.sampleRadius,
        options.sampleDiameter,
    )

    if (!color) return
    options.callback(coordinate, color)
}

const sanitiseOptions = customOptions => {
    const opts = Object.assign({}, stdOptions, customOptions)
    if (!opts.viewer || !opts.info || !opts.callback) return

    opts.info = JSON.parse(opts.info)
    if (opts.info['@id']) {
        opts.baseUrl = opts.info['@id'] + '/'
    }
    if (!opts.baseUrl) return

    try {
        opts.fileFormat = opts.info.profile[1].formats[0]
    } catch (err) {}
    if (!opts.fileFormat) return

    if (typeof opts.callback !== 'function') return

    if (!isUsableNumber(opts.sampleSize) || opts.sampleSize < 1) return
    opts.sampleRadius = Math.floor(opts.sampleSize / 2)
    opts.sampleDiameter = opts.sampleRadius * 2 + 1

    return opts
}

const loader = function(customOptions) {
    options = sanitiseOptions(customOptions)
    if (!options) return
    viewer = options.viewer
    mouseTracker = new $.MouseTracker({
        element: viewer.canvas,
        moveHandler: $.delegate(this, mouseHandler),
    })
}

export default loader

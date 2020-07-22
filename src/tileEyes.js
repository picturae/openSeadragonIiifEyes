import { isUsableNumber } from 'my-lib'
import imageEyes from 'image-eyes'

const $ = window.OpenSeadragon
let viewer
let options
let mouseTracker

/** Fallback callback to handle hovering
 * @param (number[2]) coordinate, [0] = x, [1] = y
 * @param (number[] | undefined) color, [0] = r, [1] = g, [2] = b | undefined (not hovering the image)
 */
const fallbackCallback = (xyArray, channelArray) => {
    if (xyArray) console.log(xyArray.join())
    if (channelArray) console.log(channelArray.join())
}

const standardOptions = {
    info: '',
    viewer: null,
    callback: fallbackCallback,
    sampleSize: 1,
}

/**
 * Handle the given callback
 * @member (number[2]) coordinate, [0] = x, [1] = y
 * @member (number[] | undefined) hovering color at image display | undefined
 */
const mouseHandler = async function(event) {
    const mousePoint = new $.Point(event.position.x, event.position.y)
    const tiledImage = viewer.world.getItemAt(0)

    if (!tiledImage) {
        // offer an opportunity to handle no-image
        options.callback(undefined, undefined)
        return
    }

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

    //find the right tile
    const coordinate = [
        Math.floor(realHoverPosition.x),
        Math.floor(realHoverPosition.y),
    ]

    if (!isHovering) {
        // offer an opportunity to handle not-hovering
        options.callback(coordinate, undefined)
        return
    }

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
    const color = options.sampleRadius
        ? eyesApi.getDropColor(
              options.sampleRadius,
              options.sampleRadius,
              options.sampleDiameter,
          )
        : eyesApi.getPixelColor(0, 0)

    if (!(color instanceof Array) || color.length === 0) {
        // offer an opportunity to handle failure
        options.callback(coordinate, null)
        return
    }

    options.callback(coordinate, color)
}

/**
 * Ensure some variables
 */
const sanitiseOptions = customOptions => {
    const opts = Object.assign({}, standardOptions, customOptions)
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

/**
 * Intake for viewer, tileSource, callback and sampleSize
 */
const loader = function(customOptions) {
    if (mouseTracker) mouseTracker.destroy()
    options = sanitiseOptions(customOptions)
    if (!options) return
    viewer = options.viewer
    mouseTracker = new $.MouseTracker({
        element: viewer.canvas,
        moveHandler: $.delegate(this, mouseHandler),
    })
}

export default loader

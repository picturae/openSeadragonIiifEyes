import tileEyes from './tileEyes'

const $ = window.OpenSeadragon

if (!$) {
    $ = require('openseadragon')
    if (!$) {
        throw new Error('OpenSeadragon is missing.')
    }
}

/*
 * Deliver API
 */
const index = async function(info, callback) {
    return await tileEyes(info, callback)
}

$.Viewer.prototype.eyes = function(options) {
    if (!this._eyes && typeof options === 'object') {
        options.viewer = this
        this._eyes = index(options)
    }

    return this._eyes
}

export default index

const TileCollection = function(baseUrl, width, height) {
    // colection of cacheKeys of loaded tiles
    // strings with {region}/{size}/{rotation}/{quality}.{format}
    // see https://iiif.io/api/image/2.0/#image-request-uri-syntax
    const collection = {}

    const add = function(tile) {
        const gridLocation = tile.cacheKey.replace(baseUrl + '/', '')
        const part = gridLocation.split('/')
        let region =
            part[0] === 'full' ? [0, 0, width, height] : part[0].split(',')
        let size =
            part[1] === 'full' ? [part[0][2], part[0][3]] : part[1].split(',')
        if (size[0] === undefined) size[0] = tile.sourceBounds.width
        if (size[1] === undefined) size[1] = tile.sourceBounds.height
        const name = part[3].split('.')
        collection[gridLocation] = {
            region: region,
            size: size,
            rotation: part[2],
            quality: name[0],
            format: name[1],
            scale: tile.sourceBounds.width / tile.size.x,
        }
        return
    }

    const remove = function(tile) {
        const gridLocation = tile.cacheKey.replace(baseUrl, '')
        delete collection[gridLocation]
    }

    const clear = function() {
        collection = {}
    }

    const find = function(point) {
        const hits = []
        let horizontalHit
        let verticalHit
        for (let [key, value] of Object.entries(collection)) {
            horizontalHit =
                value.region[0] < point.x &&
                value.region[0] + value.region[2] > point.x
            verticalHit =
                value.region[1] < point.y &&
                value.region[1] + value.region[3] > point.y
            if (horizontalHit && verticalHit) {
                hits.push(key)
                console.log(key)
            }
        }
        return hits[0]
    }

    return {
        add: add,
        remove: remove,
        clear: clear,
        find: find,
    }
}

export { TileCollection }

const TileCollection = function(baseUrl, width, height) {
    const collection = []

    const add = function(tile) {
        collection.push({
            position: tile.position,
            source: tile.sourceBounds,
            size: tile.size,
            scale: tile.size.x / tile.sourceBounds.width,
            url: tile.url,
        })
    }

    const remove = function(tile) {
        collection = collection.filter(item => item.url !== tile.url)
    }

    const find = function(point) {
        const hits = collection.filter(
            item =>
                item.position.x < point.x &&
                item.position.x + item.size.x > point.x &&
                item.position.y < point.y &&
                item.position.y + item.size.y > point.y,
        )

        if (hits.length) {
            // console.log(hits.length, '/', collection.length, ' >>>>>>  ', hits)

            hits.sort((a, b) => parseFloat(a.scale) - parseFloat(b.scale))
            // pick the most downscaled image
            const hit = hits.shift()
            hit.point = {
                x: Math.floor((point.x - hit.position.x) / hit.scale),
                y: Math.floor((point.y - hit.position.y) / hit.scale),
            }
            // console.log('=======', hit)
            return hit
        }
    }

    return {
        add: add,
        remove: remove,
        find: find,
    }
}

export { TileCollection }

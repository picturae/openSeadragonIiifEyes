window.onload = function() {
    const osdTileSource = {
        Image: {
            xmlns: 'http://schemas.microsoft.com/deepzoom/2008',
            Url:
                'http://openseadragon.github.io/example-images/highsmith/highsmith_files/',
            Format: 'jpg',
            Overlap: '2',
            TileSize: '256',
            Size: {
                Height: '9221',
                Width: '7026',
            },
        },
    }

    const testTileSource = {
        '@context': 'http://iiif.io/api/image/2/context.json',
        '@id':
            'https://pixel-test.picturae.com:3000/iiif/b/1/5e42abd23145fe003641f41b/7/4/5e5e6b3bbbdd9f0036947247',
        protocol: 'http://iiif.io/api/image',
        width: 8688,
        height: 5792,
        sizes: [
            { width: 135, height: 90 },
            { width: 271, height: 181 },
            { width: 543, height: 362 },
            { width: 1086, height: 724 },
            { width: 2172, height: 1448 },
            { width: 4344, height: 2896 },
        ],
        tiles: [
            { width: 256, height: 256, scaleFactors: [1, 2, 4, 8, 16, 32, 64] },
        ],
        profile: [
            'http://iiif.io/api/image/2/level1.json',
            {
                formats: ['jpg'],
                qualities: ['native', 'color', 'gray', 'bitonal'],
                supports: [
                    'regionByPct',
                    'regionSquare',
                    'sizeByForcedWh',
                    'sizeByWh',
                    'sizeAboveFull',
                    'rotationBy90s',
                    'mirroring',
                ],
                maxWidth: 5000,
                maxHeight: 5000,
            },
        ],
    }

    const localTileSource = {
        "@context" : "http://iiif.io/api/image/2/context.json",
        "@id" : "http://localhost:8080/iiif//Users/ovdz/Projects/pixel/pic-pixel-storage/data/8/b/5ea033e62ebf1fba7b4689b8/9/1/5ea043113b3d468693117119",
        "protocol" : "http://iiif.io/api/image",
        "width" : 8984,
        "height" : 6732,
        "sizes" : [
             { "width" : 140, "height" : 105 },
             { "width" : 280, "height" : 210 },
             { "width" : 561, "height" : 420 },
             { "width" : 1123, "height" : 841 },
             { "width" : 2246, "height" : 1683 },
             { "width" : 4492, "height" : 3366 }
        ],
        "tiles" : [
             { "width" : 256, "height" : 256, "scaleFactors" : [ 1, 2, 4, 8, 16, 32, 64 ] }
        ],
        "profile" : [
             "http://iiif.io/api/image/2/level1.json",
             {
                 "formats" : [ "jpg" ],
                 "qualities" : [ "native","color","gray" ],
                 "supports" : ["regionByPct","regionSquare","sizeByForcedWh","sizeByWh","sizeAboveFull","rotationBy90s","mirroring"]
             }
        ]
    }

    const $ = window.OpenSeadragon
    const viewer = $({
        id: 'openseadragon',
        prefixUrl:
            'https://cdn.jsdelivr.net/npm/openseadragon@2.4.1/build/openseadragon/images/',
        tileSources: [
            {
                tileSource: localTileSource,
            },
        ],
        gestureSettingsMouse: {
            flickEnabled: true,
        },
        animationTime: 0,
        springStiffness: 100,
    })

    let eyesApi
    const eyes = async () => {
        const url = localTileSource['@id'] + '/full/full/0/default.jpg'
        const options = {
            info: JSON.stringify(localTileSource),
        }
        eyesApi = await viewer.eyes(options)

        console.log('size ' + eyesApi.memoryUsage())
        console.log('a color ' + eyesApi.getPixelColor(70,53))
    }

    eyes()

}

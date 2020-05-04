#openSeadragonIiifEyes

openSeadragonIiifEyes exposes the genuine colordata of images to your IIIF served openseadragon  display, to serve scientific purposes. Unlike other eyedroppers, it samples the image and reads color value from there without color correction.

## Install

Install the package as npm package. Provided are
a umd-formatted file in the dist folder to require or just read
and an es-module in the module folder to import.

## Usage

When installed as node module,
and openSeadragon is opened,
this plugin is available in the viewer as 'eyes'.
You could invoke it like this:

    viewer.eyes({
        callback: (mouseCoord, color) => {
            ...
        },
        info: JSON.stringify(iiifTileSource),
        sampleSize: 11,
    })

The mouseCoordinate and color are arrays containing numbers.
When the configuration object is not correct, the plugin will silently fail.

## Demo

Drag and drop .../openSeadragonIiifEyes/demo/demo.html in a browser window

### Limitations

* The info.json must specify a default file format
* There is one image on the canvas
* The image is not rotated

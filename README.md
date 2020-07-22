# openSeadragonIiifEyes

openSeadragonIiifEyes exposes the genuine colordata of images to your IIIF served openseadragon  display, to serve scientific purposes. Unlike other eyedroppers, it samples the image and reads color value from there without the browser doing recalculations or corrections.

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
        callback: (xyCoord, color) => {
            ... your code ...
        },
        info: JSON.stringify(iiifTileSource),
        sampleSize: 11,
    })

The xyCoord and color are arrays containing numbers.
When the configuration object is not correct, the plugin will silently fail.

In case the original tileSource is not available,
you could get the tileSource through an event in the viewer:

    viewer.addHandler("open", function(event) {
        viewer.eyes({
            ...
            info: JSON.stringify(event.eventSource.source),
            ...
        })
    })

## Demo

Drag and drop .../openSeadragonIiifEyes/demo/demo.html in a browser window

### Limitations

* The info.json must specify a default file format
* Only the top image on the canvas is reviewed
* The image is not rotated

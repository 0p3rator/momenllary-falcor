// index.js
var falcorExpress = require('falcor-express');
var Router = require('falcor-router');
var cors = require('cors');

var imageService = require('./service/image-service');
var sequenceService = require('./service/sequence-service');
var imageHService = require('./service/imageH-service');

var express = require('express');
var app = express();
var clc = require('cli-color');


app.use('/model.json', cors(), falcorExpress.dataSourceRoute(function (req, res) {
    // create a Virtual JSON resource with single key ("greeting")
    return new Router([
        {
            // match a request for the key "greeting"
            route: "[{keys}]",
            // respond with a PathValue with the value of "Hello World."
            get: function (pathSet) {
                console.log(pathSet);
                return [
                    {path: ["greeting"], value: "Hello World1"},
                    {path: ["play"], value: "Don't"}];
            }
        },
        {
            route: 'imageByKey.[{keys:imageKey}].[{keys:props}]',
            get: function (pathSet) {
                // console.log(pathSet);
                return imageService
                    .getImageInfo(pathSet)
                    .then((imageInfo) => {
                        let result = []
                        for (key in imageInfo) {
                            var props = {path: [key], value: imageInfo[key]}
                            result.push(props)
                        }
                        // console.log(result)
                        return result;
                    })
                    .catch(err => console.log(err.stack))
            }
        },
        {
            route: 'sequenceByKey.[{keys:sequenceKey}].[{keys:props}]',
            get: function(pathSet) {
                console.log("Request sequenceByKey");
                let result = [];
                return sequenceService.getSequenceInfo(pathSet)
                    .then((sequenceInfo) => {
                        for (key in sequenceInfo){
                            let sequence = {path: [key], value: sequenceInfo[key]};
                            result.push(sequence);
                        }
                        return result;
                    })

            }
        },
        {
            route: 'imagesByH.[{keys:imagesH}].[{ranges:reqNum}].[{keys:props}]',
            get: function(pathSet) {
                console.log(clc.yellow("Start"));
                console.log(clc.red("imageH enter:"));
                console.log(pathSet["reqNum"])
                let result = [];
                return imageHService.getimageHInfo(pathSet)
                    .then((imagesHInfo) => {
                        for (key in imagesHInfo){
                            let imagesH = {path: [key], value: imagesHInfo[key]};
                            result.push(imagesH);
                        }
                        return result;
                    })
            }
        }
    ]);
}));

// serve static files from current directory
app.use(express.static(__dirname + '/'));

var server = app.listen(3300);

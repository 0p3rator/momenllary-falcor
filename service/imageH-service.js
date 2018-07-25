const db = require('../database/postgresql');
const clc = require('cli-color');
const imageService = require('./image-service');

var imageHSub = {
    "$type": "ref",
    "value": ["imageByKey", "MitF56kBYi4a0wt9-Xl82Q"]
}

module.exports = {

    getimageHInfo: (pathSet) => {
        var imageHInfo = {
            "imagesByH": {}
        }

        let imageKeys = [];
        const imagesHKey = pathSet["imagesH"];
        imageHInfo["imagesByH"][imagesHKey] = {};
        // console.log(imagesHKey);
        return db.query('select id from keyframes where ST_GeoHash(geom,7) = $1 limit 999',imagesHKey)
            .then(res => {
                imageHInfo["imageByKey"] = {};
                res.rows.map((row,index) => {
                    imageHSub["value"][1] = row["id"];
                    //收集image Keys
                    imageKeys.push(row["id"]);
                    imageHInfo["imagesByH"][imagesHKey][index] = JSON.parse(JSON.stringify(imageHSub));
                    return row;
                })
                var imageKeypathSet = [];
                imageKeypathSet["imageKey"] = imageKeys;
                imageKeypathSet["props"] = pathSet["props"];

                // console.log(imageKeypathSet);
                // console.log(clc.red(imageKeypathSet["props"]));
                return imageService.getImageInfo(imageKeypathSet)
                    .then(res => {
                        imageHInfo["imageByKey"] = res["imageByKey"];
                        imageHInfo["sequenceByKey"] = res["sequenceByKey"]
                    });
                // console.log(JSON.stringify(imageHInfo,null,4))
            })
            .then(res => {
                // console.log(clc.red(JSON.stringify(imageHInfo,null,2)))
                return imageHInfo;
            })
            .catch(err => {
                console.log(err.stack);
            })
    }
}


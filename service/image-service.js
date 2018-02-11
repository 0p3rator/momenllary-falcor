const clc = require('cli-color')
const db = require('../database/postgresql');
var Quaternion = require('../math/quaternion');


var image = {
    "atomic_scale": {
        "$type": "atom",
        "value": 0.4166163159315136
    },
    "c_rotation": {
        "$type": "atom",
        "value": [0.6914206311834217, -2.0507970098466672, 1.718235435702727]
    },
    // 航向角
    "ca": {
        "$type": "atom",
        "value": 143.06542110083512
    },
    //
    "calt": {
        "$type": "atom",
        "value": 1.1869385540485382
    },
    "captured_at": {
        "$type": "atom",
        "value": 1370509079741
    },
    //
    "cca": {
        "$type": "atom",
        "value": 144.25892857349493
    },
    //
    "cfocal": {
        "$type": "atom",
        "value": 0.8442266291127437
    },
    "cl": {
        "$type": "atom",
        "value": {"lon": 12.695587916673752, "lat": 56.04354372423004}
    },
    "height": {
        "$type": "atom",
        "value": 1200
    },
    "key": {
        "$type": "atom",
        "value": "zarcRdNFZwg3FkXNcsFeGw"
    },
    "l": {
        "$type": "atom",
        "value": {"lon": 12.695613, "lat": 56.0435303}
    },
    //
    "merge_cc": {
        "$type": "atom",
        "value": 1068231764744763600
    },
    //
    "merge_version": {
        "$type": "atom",
        "value": 8
    },
    //
    "orientation": {
        "$type": "atom",
        "value": 1
    },
    "user": {
        "$type": "ref",
        "value": ["userByKey", "zxVb9rBloUYNkWO3d-27Dg"]
    },
    "width": {
        "$type": "atom",
        "value": 1920
    },
    "sequence": {
        "$type": "ref",
        "value": ["sequenceByKey", "s5I5m7BvYykB677MpFnOIw"]
    }
}

var sequence = {
    "key": {
        "$type": "atom",
        "value": "s5I5m7BvYykB677MpFnOIw"
    },
    "username": {
        "$type": "atom"
    }
}

var user = {
    "zxVb9rBloUYNkWO3d-27Dg": {
        "key": {
            "$type": "atom",
            "value": "zxVb9rBloUYNkWO3d-27Dg"
        },
        "username": {
            "$type": "atom",
            "value": "changyu"
        }
    }
}



function extract_loc(position) {
    let indexStart = position.indexOf('(');
    let indexEnd = position.indexOf(')');
    let loc = position.substring(indexStart + 1, indexEnd);
    return loc.split(' ')
    console.log(clc.blue(loc))
}



module.exports = {
    getImageInfo: function(pathSet) {
        var imageInfo = {
            "imageByKey": {},
            "sequenceByKey": {},
            "userByKey": user
        }

        console.log("image-service");
        //images 的主键
        var imageKeys = pathSet.imageKey;
        console.log(clc.yellow(imageKeys));
        console.log(clc.blue(pathSet.props));
        let requiredProps = pathSet.props;
        let promiseArray = [];
        let sequenceInfo = {};

        imageKeys.forEach(imageKey => {
            // console.log(clc.yellow(imageKey));
            promiseArray.push(
                db.query('select keyframes.*, ST_AsText(geom) from keyframes where id = $1', [parseInt(imageKey)])
                .then(res => {
                    // console.log(res.rows[0]);
                    let row = res.rows[0];
                    let pos = row["st_astext"];
                    let sequenceKey = row["image_packet_id"]
                    //获取地理位置信息
                    cl = extract_loc(pos);
                    // console.log(image["cl"])
                    let imageTemp = JSON.parse(JSON.stringify(image));
                    // imageTemp["atomic_scale"]["value"] = 1000;
                    imageTemp["cl"]["value"] = {"lon": parseFloat(cl[0]), "lat": parseFloat(cl[1])};
                    // image["height"]["value"] = parseFloat(cl[2]);
                    imageTemp["sequence"]["value"][1] = sequenceKey;
                    imageTemp["key"]["value"] = imageKey;
                    let euler = {x:0,y:0,z:0}
                    let q = new Quaternion(row["qx"],row["qy"],row["qz"],row["qw"]);
                    q.toEuler(euler);
                    let angleAxis = {x:0,y:0,z:0};
                    q.toAxisAngle(angleAxis);
                    imageTemp.c_rotation.value = [angleAxis.x,angleAxis.y,angleAxis.z];
                    imageTemp.ca.value = euler.z * 57.3;
                    imageTemp.cca.value = euler.z * 57.3;
                    imageTemp.orientation = 1;
                    imageTemp["l"]["value"] = {"lon": parseFloat(cl[0]).toFixed(7), "lat": parseFloat(cl[1]).toFixed(7)};
                    console.log(clc.red(JSON.stringify(euler)));
                    console.log(clc.red(JSON.stringify(angleAxis)));


                    sequence["key"]["value"] = sequenceKey;
                    sequenceInfo[sequence["key"]["value"]] = JSON.parse(JSON.stringify(sequence));
                    // return imageTemp
                    //包含imageKey的image结构体
                    let imageInfoTemp = {}
                    imageInfoTemp[imageKey] = imageTemp;
                    return imageInfoTemp;
                })
                .then(
                    (image) => {
                        let requiredImage = {};
                        let imageKey = Object.keys(image)[0];
                        requiredImage[imageKey] = {}
                        requiredProps.map((prop) => {
                            // requiredImage[prop] = image[prop];
                            requiredImage[imageKey][prop] = image[imageKey][prop]
                        })
                        return requiredImage;
                    }
                )
            )
        })
        return Promise.all(promiseArray)
            .then((images) => {
                console.log(clc.red("I am here"));
                // console.log(images)
                // console.log(clc.red(JSON.stringify(images,null,2)))
                images.forEach(image => {
                    let imageKey = Object.keys(image)[0];
                    // imageInfo.imageByKey[image["key"]["value"]] = image;
                    imageInfo.imageByKey[imageKey] = image[imageKey];
                });
                //console.log(JSON.stringify(image, null,2));
                console.log(image.key);

                imageInfo.sequenceByKey = sequenceInfo;
                return imageInfo;
            })
    }
}


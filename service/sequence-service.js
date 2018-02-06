var db = require('../database/postgresql')
var clc = require('cli-color');

var sequencInfo = {
    "sequenceByKey":{}
};

var sequence = {
  /*  "key":{
        "$type": "atom",
        "value": ['time']
    },*/
    "keys": {
        "$type": "atom",
        "value": []
    }
}


module.exports = {
    getSequenceInfo: function(pathSet){
        let sequenceKey = pathSet.sequenceKey;
        console.log(clc.red(sequenceKey));

        return db.query('select id from keyframes where image_packet_id = $1', sequenceKey)
            .then(res => {
                sequence["keys"]["value"] = res.rows.map((row) => row["id"]);
                //console.log(sequence)
                sequencInfo.sequenceByKey[sequenceKey[0]] = sequence;
                return sequencInfo;
            })
            .catch(err => {
                console.log(err.stack)
            })


    }
}
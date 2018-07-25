module.exports = Qua2Mat3Rotate;
var rMat4 = require('three')
var three = require('three')

function Qua2Mat3Rotate(quat){

    var rMat4 = new three.Matrix4();

    rMat4.set(
        1, 0, 0, 0,
        0, 0, 1, 0,
        0, -1, 0, 0,
        0, 0, 0, 1);

    var mat4 = new three.Matrix4();
    mat4.makeRotationFromQuaternion(q);
    console.log(mat4);
    mat4 = rMat4.premultiply(mat4);
    console.log(mat4);

    var mat3 = new three.Matrix3();
    mat3.setFromMatrix4(mat4);
    //console.log(mat3);
}



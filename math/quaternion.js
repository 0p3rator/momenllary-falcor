module.exports = Quaternion;

function Quaternion(x,y,z,w){
    /**
     * @property {Number} x
     */
    this.x = x!==undefined ? x : 0;

    /**
     * @property {Number} y
     */
    this.y = y!==undefined ? y : 0;

    /**
     * @property {Number} z
     */
    this.z = z!==undefined ? z : 0;

    /**
     * The multiplier of the real quaternion basis vector.
     * @property {Number} w
     */
    this.w = w!==undefined ? w : 1;
}

/**
 * Convert the quaternion to euler angle representation. Order: YZX, as this page describes: http://www.euclideanspace.com/maths/standards/index.htm
 * @method toEuler
 * @param {Vec3} target
 * @param string order Three-character string e.g. "YZX", which also is default.
 */
Quaternion.prototype.toEuler = function(target,order){
    order = order || "YZX";

    var heading, attitude, bank;
    var x = this.x, y = this.y, z = this.z, w = this.w;

    switch(order){
        case "YZX":
            var test = x*y + z*w;
            if (test > 0.499) { // singularity at north pole
                heading = 2 * Math.atan2(x,w);
                attitude = Math.PI/2;
                bank = 0;
            }
            if (test < -0.499) { // singularity at south pole
                heading = -2 * Math.atan2(x,w);
                attitude = - Math.PI/2;
                bank = 0;
            }
            if(isNaN(heading)){
                var sqx = x*x;
                var sqy = y*y;
                var sqz = z*z;
                heading = Math.atan2(2*y*w - 2*x*z , 1 - 2*sqy - 2*sqz); // Heading
                attitude = Math.asin(2*test); // attitude
                bank = Math.atan2(2*x*w - 2*y*z , 1 - 2*sqx - 2*sqz); // bank
            }
            break;
        default:
            throw new Error("Euler order "+order+" not supported yet.");
    }

    target.y = heading;
    target.z = attitude;
    target.x = bank;
};
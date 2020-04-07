// This is a work of github user @aratama.

// TODO: 找个时间测量一下随机函数的输出取值范围和分布,自己写一个等(自)效(由)的把这个换了.

function randomInt(xors) {
    let t = xors.x ^ (xors.x << 11);
    xors.x = xors.y;
    xors.y = xors.z;
    xors.z = xors.w;
    return xors.w = (xors.w ^ (xors.w >>> 19)) ^ (t ^ (t >>> 8));
}

function random(xors) {
    return randomInt(xors) / 2147483648;
}

let seed = {
    x: (2147483648 * Math.random()) | 0,
    y: (2147483648 * Math.random()) | 0,
    z: (2147483648 * Math.random()) | 0,
    w: (2147483648 * Math.random()) | 0
};

function shuffle(xs) {
    let v = Object.assign({}, seed);
    xs = xs.slice();
    let ys = [];
    while (0 < xs.length) {
        let i = Math.abs(randomInt(v)) % xs.length;
        ys.push(xs[i]);
        xs.splice(i, 1);
    }
    return ys;
}


let xors = Object.assign({}, seed);
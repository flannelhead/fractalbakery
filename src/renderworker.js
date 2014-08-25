if (typeof PRODUCTION === 'undefined') PRODUCTION = false;
if (!PRODUCTION) {
    importScripts('complex.js', 'complexpolynomial.js', 'newton.js',
        'renderer.js');
}

onmessage = function(event) {
    var result = renderer.render(event.data.config, event.data.width,
        event.data.height, event.data.maxIter);
    postMessage(result, [result.buffer]);
};



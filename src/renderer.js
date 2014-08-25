var renderer = {
    render: function(config, width, height, givenMaxIter) {
        var buffer = new ArrayBuffer(4 * width * height),
            data = new Uint8ClampedArray(buffer);
        var reStep = (config.reMax - config.reMin) / (width - 1),
            imStep = (config.imMax - config.imMin) / (height  - 1),
            poly = ComplexPolynomial.fromRoots(config.roots.map(function(root) {
                return new Complex(root.root.Re, root.root.Im);
            })),
            deriv = poly.derivative(),
            field = [],
            c = 0, RGB, maxIter = 0,
            epsSq = config.eps * config.eps, shade;

        for (var i = 0; i < height; i++) {
            for (var j = 0; j < width; j++) {
                field.push(newton.iterate(new Complex(config.reMin + j * reStep,
                    config.imMin + i * imStep), poly, deriv, config.roots,
                    epsSq, config.maxIter));
                if (!givenMaxIter) {
                    maxIter = Math.max(maxIter, field[field.length - 1].iter);
                }
            }
        }

        if (givenMaxIter) maxIter = givenMaxIter;
        for (i = 0, len = field.length; i < len; i++) {
            RGB = renderer.HSVtoRGB(field[i].root.hue, 1,
                1 - field[i].iter / maxIter);
            data[c++] = RGB.R;
            data[c++] = RGB.G;
            data[c++] = RGB.B;
            data[c++] = 255;
        }

        return { buffer: buffer, maxIter: maxIter };
    },

    interpolate: function(imageData, ctx, width, height) {
        var newData = ctx.createImageData(width, height),
            dx = (imageData.width - 1) / (width - 1),
            dy = (imageData.height - 1) / (height - 1),
            c = 0, d = imageData.data, newD = newData.data;

        function indicesAndWeights(x, y) {
            var xOrig = x * dx, yOrig = y * dy,
                x1 = Math.floor(xOrig), x2 = x1 + 1,
                y1 = Math.floor(yOrig), y2 = y1 + 1,
                dx1 = xOrig - x1, dx2 = 1 - dx1,
                dy1 = yOrig - y1, dy2 = 1 - dy1;

            if (x2 >= imageData.width) x2 = x1;
            if (y2 >= imageData.height) y2 = y1;

            var ind11 = y1 * imageData.width + x1,
                ind12 = ind11 + x2 - x1,
                ind21 = y2 * imageData.width + x1,
                ind22 = ind21 + x2 - x1;

            return [
                { i: 4 * ind11, w: dy2 * dx2 },
                { i: 4 * ind12, w: dy2 * dx1 },
                { i: 4 * ind21, w: dy1 * dx2 },
                { i: 4 * ind22, w: dy1 * dx1 }
            ];
        }

        var w, n;
        for (var i = 0; i < height; i++) {
            for (var j = 0; j < width; j++) {
                w = indicesAndWeights(j, i);
                n = 4;
                while (n--) {
                    newD[c++] = d[w[0].i++] * w[0].w + d[w[1].i++] * w[1].w +
                        d[w[2].i++] * w[2].w + d[w[3].i++] * w[3].w;
                }
            }
        }

        return newData;
    },

    HSVtoRGB: function(H, S, V) {
        // http://en.wikipedia.org/wiki/HSL_and_HSV#Converting_to_RGB
        var C = V * S,
            Hprime = 6 * H,
            X = C * (1 - Math.abs(Hprime % 2 - 1)),
            m = V - C, RGB;

        if (Hprime < 1) RGB = { R: C, G: X, B: 0 };
        else if (Hprime < 2) RGB = { R: X, G: C, B: 0 };
        else if (Hprime < 3) RGB = { R: 0, G: C, B: X };
        else if (Hprime < 4) RGB = { R: 0, G: X, B: C };
        else if (Hprime < 5) RGB = { R: X, G: 0, B: C };
        else RGB = { R: C, G: 0, B: X };

        RGB.R += m;
        RGB.G += m;
        RGB.B += m;
        RGB.R *= 255;
        RGB.G *= 255;
        RGB.B *= 255;

        return RGB;
    }
};


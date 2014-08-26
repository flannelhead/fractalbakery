var renderer = {
    render: function(config, width, height, givenExposure) {
        var buffer = new ArrayBuffer(4 * width * height),
            data = new Uint8ClampedArray(buffer);
        var reStep = (config.reMax - config.reMin) / (width - 1),
            imStep = (config.imMax - config.imMin) / (height  - 1),
            poly = ComplexPolynomial.fromRoots(config.roots.map(function(root) {
                return new Complex(root.root.Re, root.root.Im);
            })),
            deriv = poly.derivative(),
            field = [],
            c = 0, RGB, exposure = 0,
            epsSq = config.eps * config.eps, shade;

        for (var i = 0; i < height; i++) {
            for (var j = 0; j < width; j++) {
                field.push(newton.iterate(new Complex(config.reMin + j * reStep,
                    config.imMin + i * imStep), poly, deriv, config.roots,
                    epsSq, config.maxIter));
                if (!givenExposure) {
                    exposure = Math.max(exposure, field[field.length - 1].iter);
                }
            }
        }

        if (givenExposure) exposure = givenExposure;
        var expReciprocal = 1 / exposure;
        for (i = 0, len = field.length; i < len; i++) {
            RGB = renderer.HSVtoRGB(field[i].root.hue, 1,
                1 - field[i].iter * expReciprocal);
            data[c++] = RGB.R;
            data[c++] = RGB.G;
            data[c++] = RGB.B;
            data[c++] = 255;
        }

        return { buffer: buffer, exposure: exposure };
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


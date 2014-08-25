var newton = {
    iterate: function(guess, poly, deriv, roots, epsSq, maxIter) {
        var root, z = guess, iter = 0;
        do {
            z = z.sub(poly.evaluate(z).div(deriv.evaluate(z)));
            root = newton.whichRoot(z, roots, epsSq);
            iter++;
        } while (!root && iter < maxIter);
        if (!root) {
            root = roots[0];
        } else {
            iter += Math.log(epsSq / root.previousDistance) /
                Math.log(root.distance / root.previousDistance);
        }

        return {
            root: root,
            iter: iter,
        };
    },

    whichRoot: function(z, roots, epsSq) {
        for (var i = 0, len = roots.length; i < len; i++) {
            roots[i].previousDistance = roots[i].distance;
            roots[i].distance = z.sub(roots[i].root).absSquared();
            if (roots[i].distance < epsSq) {
                return roots[i];
            }
        }
    }
};


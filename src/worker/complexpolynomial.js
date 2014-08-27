function ComplexPolynomial(coeffs) {
    this.coeffs = coeffs;
}

ComplexPolynomial.fromRoots = function(roots) {
    if (roots.length < 1) return undefined;

    var coeffs = [ new Complex(1, 0) ];
    for (var i = 0, nRoots = roots.length; i < nRoots; i++) {
        coeffs.splice(0, 0, new Complex(0, 0));
        for (var j = 0, len = coeffs.length - 1; j < len; j++) {
            coeffs[j] = coeffs[j].add(coeffs[j + 1].mul(roots[i].scale(-1)));
        }
    }
    return new ComplexPolynomial(coeffs);
};

ComplexPolynomial.prototype.evaluate = function(z) {
    var val = new Complex(0, 0), coeffs = this.coeffs;
    for (var i = coeffs.length - 1; i >= 0; i--) {
        val = val.mul(z).add(coeffs[i]);
    }
    return val;
};

ComplexPolynomial.prototype.derivative = function() {
    var coeffs = [];
    for (var i = 1, len = this.coeffs.length; i < len; i++) {
        coeffs.push(this.coeffs[i].scale(i));
    }
    return new ComplexPolynomial(coeffs);
};


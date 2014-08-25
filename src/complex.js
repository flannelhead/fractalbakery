function Complex(Re, Im) {
    this.Re = Re ? Re : 0;
    this.Im = Im ? Im : 0;
}

Complex.prototype.add = function(z) {
    return new Complex(this.Re + z.Re, this.Im + z.Im);
};

Complex.prototype.sub = function(z) {
    return new Complex(this.Re - z.Re, this.Im - z.Im);
};

Complex.prototype.mul = function(z) {
    return new Complex(this.Re * z.Re - this.Im * z.Im, this.Re * z.Im +
        this.Im * z.Re);
};

Complex.prototype.scale = function(a) {
    return new Complex(this.Re * a, this.Im * a);
};

Complex.prototype.div = function(z) {
    var oneOverAbsZ = 1 / z.absSquared();
    return new Complex((this.Re * z.Re + this.Im * z.Im) * oneOverAbsZ,
        (this.Im * z.Re - this.Re * z.Im) * oneOverAbsZ);
};

Complex.prototype.abs = function() {
    return Math.sqrt(this.absSquared());
};

Complex.prototype.absSquared = function() {
    return this.Re * this.Re + this.Im * this.Im;
};

Complex.prototype.arg = function() {
    return Math.atan2(this.Im, this.Re);
};


class Elem {
    constructor(input) {
        if(typeof(input) === "string") {
            if(input.indexOf("x") === -1) this.pow = 0;
            else if(input.indexOf("^") === -1) this.pow = 1;
            input = input.replace("^", "").split("x");
            this.coeff = new Frac(input[0]);
            if(this.pow === undefined) this.pow = parseInt(input[1]);
        }
        else {
            this.coeff = new Frac();
            this.pow = 0;
        }
    }

    copy() {
        let e = new Elem();
        e.coeff = this.coeff.copy();
        e.pow = this.pow;
        return e;
    }

    add(rhs) {
        this.coeff.add(rhs.coeff);
    }
    
    static add(a, b) {
        let r = a.copy();
        r.add(b);
        return r;
    }

    sub(rhs) {
        this.coeff.sub(rhs.coeff);
    }

    static sub(a, b) {
        let r = a.copy();
        r.sub(b);
        return r;
    }

    mult(rhs) {
        this.coeff.mult(rhs.coeff);
        this.pow += rhs.pow;
    }

    static mult(a, b) {
        let r = a.copy();
        r.mult(b);
        return r;
    }

    toLatex(first = false) {
        let l = "";
        if(!first && this.coeff.q > 0) l += "+";
        if(this.pow === 0 || this.coeff.q !== 0) {
            if(this.pow === 0 || this.coeff.q !== this.coeff.p) l += this.coeff.toLatex();
            if(this.pow !== 0) {
                l += "x";
                if(this.pow !== 1) l += "^" + this.pow.toString();
            }
        }
        return l;
    }

}

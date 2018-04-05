class Sequence {
    constructor(input) {
        if(typeof(input) === "string") {
            this.seq = [];
            this.seq.push(new Elem(input));
        }
        else if(input instanceof Elem) this.seq = [input];
        else this.seq = [];
    }

    copy() {
        let s = new Sequence();
        for(let elem of this.seq) s.seq.push(elem.copy());
        return s;
    }

    add(rhs) {
        for(let rhsElem of rhs.seq) {
            let added = false;
            for(let elem of this.seq) {
                if(elem.pow === rhsElem.pow) {
                    elem.add(rhsElem);
                    added = true;
                    break;
                }
            }
            if(!added) this.seq.push(rhsElem);
        }
    }
    
    static add(a, b) {
        let r = a.copy();
        r.add(b);
        return r;
    }

    sub(rhs) {
        for(let rhsElem of rhs.seq) {
            let subbed = false;
            for(let elem of this.seq) {
                if(elem.pow === rhsElem.pow) {
                    elem.sub(rhsElem);
                    subbed = true;
                    break;
                }
            }
            if(!subbed) {
                let negElem = rhsElem.copy();
                negElem.coeff.q = -negElem.coeff.q;
                this.seq.push(negElem);
            }
        }
    }

    static sub(a, b) {
        let r = a.copy();
        r.sub(b);
        return r;
    }

    mult(rhs) {
        const s = Sequence.mult(this, rhs);
        this.seq = [];
        for(let elem of s.seq) this.seq.push(elem.copy());
    }

    static mult(a, b) {
        let s = new Sequence();
        for(let bElem of b.seq) {
            for(let aElem of a.seq)
                s.add(new Sequence(Elem.mult(aElem, bElem)));
        }
        return s;
    }

    toLatex() {
        let l = "";
		let first = true;
		for(let elem of this.seq) {
			l += elem.toLatex(first);
			first = false;
        }
        return l;
    }

}
const Types = { 
	NUM: "num",
	OP: "op",
	BRAC: "brac"
};

const Operators = {
	ADD: '+',
	SUB: '-',
	MULT: '*'
};

const Brackets = {
	LFT: '(',
	RHT: ')'
};

function Type(elem) {
	if(typeof(elem) === "string" && elem.length === 1) {
		if(elem === Operators.ADD || elem === Operators.SUB ||
			elem === Operators.MULT || elem === Operators.DIV) return Types.OP;
		if(elem === Brackets.LFT || elem === Brackets.RHT) return Types.BRAC;
	}
	return Types.NUM;
};

class Formula {
	constructor(input) {
		this.form = [];
		if(typeof(input) === "string") {
			let prevType = Type(input[0]), curType, curStr = input[0]; 
			for(let i = 1; i < input.length; i++) {
				let c = input[i];
				curType = Type(c);

				if(curType !== prevType || curType !== Types.NUM) {
					if(prevType === Types.NUM) this.form.push(new Sequence(curStr));
					else this.form.push(curStr);

					curStr = c;
					prevType = curType;
				}
				else curStr += c;
			}
			if(prevType === Types.NUM) this.form.push(new Sequence(curStr));
			else this.form.push(curStr);	
		}
	}

	copy() {
		let f = new Formula();
		for(let elem of this.form) {
			if(Type(elem) === Types.NUM) f.form.push(elem.copy());
			else f.form.push(elem);
		}
		return f;
	}

	calculate(begin, end) {
		// Remove all brackets recursively
		const brackStk = [];
		let cur;
		for(let i = begin; i < end; i++) {
			cur = this.form[i];
			if(Type(cur) === Types.BRAC) {
				if(brackStk.length === 0 && cur === Brackets.RHT)
					throw "Invalid bracket placement";

				if(cur === Brackets.LFT) brackStk.push(i);
				else {
					const newBegin = brackStk.pop() + 1, newEnd = i;
					const originalLen = this.form.length;
					const res = this.calculate(newBegin, newEnd);
					const newLen = this.form.length;

					i = newBegin - 1;
					this.form[i] = res;
					this.form.splice(i + 1, 2);
					end -= 2 + (originalLen - newLen);
				}
			}
		} 

		// Multiplication
		for(let i = begin; i < end; i++) {
			cur = this.form[i];
			if(cur === Operators.MULT) {
				if(i === begin || i === end - 1 || 
					Type(this.form[i - 1]) !== Types.NUM ||
					Type(this.form[i + 1]) !== Types.NUM)
					throw "Invalid operand for operator \'*\'";
				
				const a = this.form[i - 1], b = this.form[i + 1];

				const res = Sequence.mult(a, b);

				i--;
				this.form[i] = res;
				this.form.splice(i + 1, 2);
				end -= 2;
			}
		}

		// Addition and subtraction
		for(let i = begin; i < end; i++) {
			cur = this.form[i];
			if(cur === Operators.ADD) {
				if(i === end - 1 || 
					Type(this.form[i - 1]) !== Types.NUM ||
					Type(this.form[i + 1]) !== Types.NUM)
					throw "Invalid operand for operator \'+\'";
				
				const a = (i === begin) ? (new Sequence("0")) : this.form[i - 1], 
					b = this.form[i + 1];

				const res = Sequence.add(a, b);

				const isOperator = i != begin;
				if(isOperator) i--;
				this.form[i] = res;
				this.form.splice(i + 1, 1);
				end--;
				// Only remove another element if it is actually and operator
				// and not just a plus sign
				if(isOperator) {
					this.form.splice(i + 1, 1);
					end--;
				}
			}
			else if(cur === Operators.SUB) {
				if(i === end - 1 || 
					Type(this.form[i - 1]) !== Types.NUM ||
					Type(this.form[i + 1]) !== Types.NUM)
					throw "Invalid operand for operator \'-\'";
				
				const a = (i === begin) ? (new Sequence("0")) : this.form[i - 1], 
					b = this.form[i + 1];

				const res = Sequence.sub(a, b);

				const isOperator = i != begin;
				if(isOperator) i--;
				this.form[i] = res;
				this.form.splice(i + 1, 1);
				end--;
				// Only remove another element if it is actually and operator
				// and not just a minus sign
				if(isOperator) {
					this.form.splice(i + 1, 1);
					end--;
				}

			}
		}

		return this.form[begin];
	}

	getResult() {
		const cp = this.copy();
		cp.calculate(0, cp.form.length);
		cp.form[0].seq.sort((a, b) => b.pow - a.pow);
		return cp.form[0].toLatex();
	}

	getLatex() {
		let l = "";
		for(let seq of this.form) {
			if(seq instanceof Sequence) l += seq.toLatex();
			else if(seq === "*") l += " \\times ";
			else l += seq;
		}
		return l;
	}
}
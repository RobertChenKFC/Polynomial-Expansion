let inputBox;
let errorDiv;
let formulaDiv;
let resultDiv;

function setup() {
	inputBox = select("#input");

	errorDiv = select("#error");
	
	MathJax.Hub.queue.Push(() => {
		formulaDiv = MathJax.Hub.getAllJax("formula")[0];
	});

	MathJax.Hub.queue.Push(() => {
		resultDiv = MathJax.Hub.getAllJax("result")[0];
	});
	
	inputBox.input(() => {
		try {
			const formula = new Formula(inputBox.value());

			const formulaStr = formula.getLatex();
			MathJax.Hub.queue.Push(["Text", formulaDiv, formulaStr]);	

			const resultStr = formula.getResult();
			MathJax.Hub.queue.Push(["Text", resultDiv, resultStr]);

			errorDiv.html("Nothing");	

			console.log("Done");
		}
		catch(e) {
			errorDiv.html(e);
		}
	});
}


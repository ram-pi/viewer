package solver;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

public class FormulaSolver {
	
	ScriptEngine js;

	public FormulaSolver() {
		js = new ScriptEngineManager().getEngineByName("javascript");
	}
	
	public Boolean solveFormula(String formula) throws ScriptException {
		return (Boolean) js.eval(formula);
	}
	
	public static void main(String[] args) throws ScriptException {
		FormulaSolver solver = new FormulaSolver();
		Boolean res = solver.solveFormula("((true||false)&&!((false)&&(true)))");
		System.out.println(res);
	}
}


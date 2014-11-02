package utils;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

public class FormulaSolver {
	public ScriptEngine js;
	
	public FormulaSolver() {
		js = new ScriptEngineManager().getEngineByName("javascript");
	}
	
	public Boolean solve(String formula) {
		try {
			return (Boolean) js.eval(formula);
		} catch (ScriptException e) {
			e.printStackTrace();
		}
		return false;
	}
	
	public static void main(String[] args) {
		FormulaSolver  fs = new FormulaSolver();
		System.out.println(fs.solve("(true&&false)||true"));
	}
}

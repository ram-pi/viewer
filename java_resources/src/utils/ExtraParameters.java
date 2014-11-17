package utils;

import ij.ImageStack;

public class ExtraParameters {
	private Double fa, lr;
	private ImageStack faStack, lrStack;
	
	public ExtraParameters(Double fa, ImageStack faStack, Double lr, ImageStack lrStack) {
		this.fa = fa;
		this.faStack = faStack;
		this.lr = lr;
		this.lrStack = lrStack;
	}

	public Double getFa() {
		return fa;
	}
	
	public Double getLr() {
		return lr;
	}

	public ImageStack getFaStack() {
		return faStack;
	}
	
	public ImageStack getLrStack() {
		return lrStack;
	}

	public void setLr(Double lr) {
		this.lr = lr;
	}

	public void setLrStack(ImageStack lrStack) {
		this.lrStack = lrStack;
	}

	public void setFa(Double fa) {
		this.fa = fa;
	}

	public void setFaStack(ImageStack faStack) {
		this.faStack = faStack;
	}
}

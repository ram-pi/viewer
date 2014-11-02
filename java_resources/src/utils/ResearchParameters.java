package utils;

import java.util.ArrayList;

import ij.ImageStack;

public class ResearchParameters {
	private String formula;
	private ImageStack volume;
	private ImageStack segmentation;
	private ArrayList<String> tokens;
	private ArrayList<Integer> allLabels;
	
	public ResearchParameters(String formula, ImageStack volume, ImageStack segmentation, ArrayList<String> tokens, ArrayList<Integer> allLabels) {
		this.formula = formula;
		this.volume = volume;
		this.segmentation = segmentation;
		this.tokens = tokens;
		this.allLabels = allLabels;
	}

	public String getFormula() {
		return formula;
	}

	public void setFormula(String formula) {
		this.formula = formula;
	}

	public ImageStack getVolumeStack() {
		return volume;
	}

	public void setVolume(ImageStack volume) {
		this.volume = volume;
	}

	public ImageStack getSegmentationStack() {
		return segmentation;
	}

	public void setSegmentation(ImageStack segmentation) {
		this.segmentation = segmentation;
	}

	public ArrayList<String> getTokens() {
		return tokens;
	}

	public void setTokens(ArrayList<String> tokens) {
		this.tokens = tokens;
	}

	public ArrayList<Integer> getAllLabels() {
		return allLabels;
	}

	public void setAllLabels(ArrayList<Integer> allLabels) {
		this.allLabels = allLabels;
	}
}

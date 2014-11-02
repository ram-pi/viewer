package stackScanner;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import stackScanner.interfaces.Scanner;
import utils.FormulaSolver;
import utils.ResearchParameters;
import ij.ImageStack;
import ij.process.ImageProcessor;

public class QueryStackSeeker extends Thread implements Scanner{
	
	private Thread runner;
	private String name;
	private ImageStack result;
	private FormulaSolver fs;
	private ResearchParameters rp;
	
	public QueryStackSeeker(String name, ResearchParameters rp) {
		this.name = name;
		this.rp = rp;
		this.fs = new FormulaSolver();
		this.result = new ImageStack(256, 256);
	}
	
	/* Slide All the slices in the stack and save them if they satisfied the formula after cleaning */ 
	public void scanningStack() {
		int counter = 0;
		for (int i = 1; i < rp.getSegmentationStack().getSize(); i++) {
			ImageProcessor ip = rp.getSegmentationStack().getProcessor(i);
			if (formulaSatisfied(ip)) {
				ImageProcessor sliceInVolume = rp.getVolumeStack().getProcessor(i);
				ImageProcessor cleanSlice = sliceCleaner(sliceInVolume, ip);
				result.addSlice(cleanSlice);
				counter++;
			}
		}
		System.out.println(counter + " slice found in " + name);
	}
	
	/* Takes in input a slice and give a slice where the pixels are not in the labels are put to zero */
	public ImageProcessor sliceCleaner(ImageProcessor volumeSlice, ImageProcessor segmentationSlice) {
		for (int i = 0; i < segmentationSlice.getWidth(); i++) {
			for (int j = 0; j < segmentationSlice.getHeight(); j++) {
				boolean goodPixel = false;
				for (Integer l : rp.getAllLabels()) {
					if (segmentationSlice.getPixelValue(i, j) == l) {
						goodPixel = true;
						break;
					}
				}
				if (!goodPixel)
					volumeSlice.putPixelValue(i, j, 0);
			}
		}

		return volumeSlice;
	}
	
	/* Verify if a slice satisfy the query */
	public Boolean formulaSatisfied(ImageProcessor ip) {
		Integer label;
		Map<String, Boolean> values = initializeMap();
		Set<String> keyset = values.keySet();

		for (int i = 0; i < ip.getWidth(); i++) {
			for (int j = 0; j < ip.getHeight(); j++) {
				label = (int) ip.getPixelValue(i, j);
				for (String key : keyset) {
					String[] pieces = key.split("_");
					for (int k = 0; k < pieces.length; k++) {
						if (label.toString().equals(pieces[k])) {
							values.put(key, true);
							break;
						}
					}
				}
			}
		}

		String tmpFormula = rp.getFormula();
		for (String key : keyset) {
			if (values.get(key) == true) {
				tmpFormula = tmpFormula.replace(key, "true");
			} else if (values.get(key) == false) {
				tmpFormula = tmpFormula.replace(key, "false");
			}
		}

		return fs.solve(tmpFormula);
	}
	
	private  Map<String, Boolean> initializeMap() {
		Map<String, Boolean> map = new HashMap<String, Boolean>();
		for (String string : rp.getTokens()) {
			map.put(string, false);
		}
		return map;
	}
	
	@Override
	public synchronized void start() {
		System.out.println("Thread " + name + " is running right now.");
		runner = new Thread(this);
		runner.start();
	}
	
	@Override
	public void run() {
		scanningStack();
	}
	
	public Thread getThread() {
		return runner;
	}
	
	public ImageStack getStack() {
		return result;
	}
}

package stackScanner;

import ij.ImageStack;
import ij.process.ImageProcessor;
import stackScanner.interfaces.Scanner;
import utils.ResearchParameters;

public class SimpleQueryStackSeeker extends Thread implements Scanner{

	private Thread runner;
	private String name;
	private ImageStack result;
	private ResearchParameters rp;
	
	public SimpleQueryStackSeeker(String name, ResearchParameters rp) {
		this.name = name;
		this.rp = rp;
		this.result = new ImageStack(256, 256);
	}
	
	@Override
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

	@Override
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

	@Override
	public Boolean formulaSatisfied(ImageProcessor ip) {
		/* It needs one orToken true to satisfy the formula */
		/* (1110_14116 AND 11105_1210) OR 4127_1001_2001 */
		
		for (String orToken : rp.getTokens()) {
			String[] andTokens = orToken.split("AND");
			/* Every andToken must to be true to satisfy the and condition */
			/* 1120_2101 AND 11101_3001_2001 */
			boolean allTrue = true;
			for (String andToken : andTokens) {
				boolean andConditionSatisfied = false;
				String[] labels = andToken.split("_");
				for (int i = 0; i < ip.getWidth(); i++) {
					for (int j = 0; j < ip.getHeight(); j++) {
						for (String label : labels) {
							if (ip.getPixelValue(i, j) == Integer.parseInt(label)) {
								andConditionSatisfied = true;
							}
						}
					}
				}
				if (!andConditionSatisfied) {
					allTrue = false;
					break;
				}
			} /* END AND TOKEN CONTROL */
			if (allTrue)
				return true;
		}
		return false;
	}

	@Override
	public ImageStack getStack() {
		return result;
	}
	
	public Thread getThread() {
		return runner;
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

}

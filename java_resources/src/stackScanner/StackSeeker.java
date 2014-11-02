package stackScanner;

import java.util.ArrayList;

import ij.ImageStack;
import ij.process.ImageProcessor;
import stackScanner.interfaces.Scanner;
import utils.ResearchParameters;

public class StackSeeker implements Scanner{
	private String name;
	private ResearchParameters rp;
	private ImageStack result;

	public StackSeeker(String name, ResearchParameters rp) {
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
	public ImageProcessor sliceCleaner(ImageProcessor volumeSlice,
			ImageProcessor segmentationSlice) {
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
		for (int i = 0; i < ip.getWidth(); i++) {
			for (int j = 0; j < ip.getHeight(); j++) {
				int label = (int) ip.getPixelValue(i, j);
				for (Integer l : rp.getAllLabels()) {
					if (label == l) {
						return true;
					}
				}
			}
		}
		return false;
	}

	public ImageStack getStack() {
		return result;
	}

	public void printAllLabels() {
		ArrayList<Integer> labels = new ArrayList<>();
		for (int i = 1; i < rp.getSegmentationStack().getSize(); i++) {
			ImageProcessor ip = rp.getSegmentationStack().getProcessor(i);
			for (int k = 0; k < ip.getWidth(); k++) {
				for (int j = 0; j < ip.getHeight(); j++) {
					Integer l = (int) ip.getPixelValue(k, j);
					if (!labels.contains(l))
						labels.add(l);
				}
			}
		}

		for (Integer integer : labels) {
			System.out.println(integer);
		}
	}
}

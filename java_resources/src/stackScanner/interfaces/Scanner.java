package stackScanner.interfaces;

import ij.ImageStack;
import ij.process.ImageProcessor;

public interface Scanner {
	public void scanningStack();
	public ImageProcessor sliceCleaner(ImageProcessor volumeSlice, ImageProcessor segmentationSlice);
	public Boolean formulaSatisfied(ImageProcessor ip);
	public ImageStack getStack();
}

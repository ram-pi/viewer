package transformation;

import ij.*;
import ij.process.*;

/**
 * This ImageJ PlugInFilter makes a right handed or optionally left handed
 * (arg = "AXIAL_LEFT") axial stack from an input stack.
 *
 *   Axial   Coronal  Sagital
 *    z        y       -x
 *   /        /        /
 *   -----x   -----x   -----y
 *  |        |        |
 *  |        |        |
 *  y       -z       -z
 * x goes from right-to-left
 * y goes from anterior-to-posterior
 * z goes from caudal-to-cephalic
 * The orientations may make less sense in non-radiologic applications.
 *
 * @author J. Anthony Parker, MD PhD <J.A.Parker@IEEE.org>
 * @version 30January2002
 *
 * @see ij.plugin.filter.PlugInFilter
 */
public class To_AxialV2 {
	private String arg;
	private ImagePlus imp;
	private ImageProcessor ip;
	private static final int AXIAL_RIGHT = 0, AXIAL_LEFT = 1,
							CORONAL_RIGHT = 2, CORONAL_LEFT = 3,
							SAGITAL_RIGHT = 4, SAGITAL_LEFT = 5;
	private static final int BYTE = 0, SHORT = 1, FLOAT = 2, COLOR = 3;
	private int ipType, inOrientation, outOrientation;
	private int wIn, hIn, sizeIn, w, h, size;
	private boolean flipHor = false, flipVer = false;
	private Object[] pixelsIn;
	private Object[] pixelsOut;
	private byte[][] pixelsB;
	private short[][] pixelsS;
	private float[][] pixelsF;
	private int[][] pixelsC;

	/**
	 * @param arg output format = "AXIAL_LEFT" for left handed
	 * @param imp ImagePlus
	 */
	public int setup(String arg, ImagePlus imp) {
		this.arg = arg.toLowerCase().trim();
		this.imp = imp;
		if(this.arg.equals("about"))
			{showAbout(); return 1;}
		if((this.arg.indexOf("axial")) >= 0 &&
								(this.arg.indexOf("left") >= 0))
			outOrientation = AXIAL_LEFT;
		else
			outOrientation = AXIAL_RIGHT;
		return 2;
	}

	/**
	 * @param ip currrent ImageProcessor from ImagePlus
	 */
	public ImagePlus run(ImageProcessor ip) {
//IJ.debugMode = true;
		wIn = imp.getWidth();
		hIn = imp.getHeight();
		sizeIn = imp.getStackSize();
		this.ip = ip;
//		if(!askOrientation()) return null;
		defaultOrientation();
		if(!processorType()) return null;
		// get input pixels
		pixelsIn = new Object[sizeIn];
		for(int n=0; n<sizeIn; n++)
			pixelsIn[n] = imp.getStack().getPixels(n+1);
		// convert
		for(int n=0; n<size; n++) {
			for(int j=0; j<h; j++)
				for(int i=0; i<w; i++) {
					int n2=0, j2=0, i2=0;
					switch (inOrientation) {
						case AXIAL_LEFT:
							n2 = size-1-n; j2 = j; i2 = i;
							break;
						case CORONAL_RIGHT:
							n2 = j; j2 = size-1-n; i2 = i;
							break;
						case CORONAL_LEFT:
							n2 = h-1-j; j2 = size-1-n; i2 = i;
							break;
						case SAGITAL_RIGHT:
							n2 = w-1-i; j2 = size-1-n; i2 = j;
							break;
						case SAGITAL_LEFT:
							n2 = i; j2 = size-1-n; i2 = j;
							break;
					}
					if(flipHor)
						i2 = wIn-1-i2;
					if(flipVer)
						j2 = hIn-1-j2;
					if(outOrientation==AXIAL_LEFT)
						n = size-1-n;
					switch (ipType) {
						case BYTE:
							pixelsB[n][j*w+i] = 
									((byte[]) pixelsIn[n2])[j2*wIn+i2];
							break;
						case SHORT:
							pixelsS[n][j*w+i] = 
									((short[]) pixelsIn[n2])[j2*wIn+i2];
							break;
						case FLOAT:
							pixelsF[n][j*w+i] = 
									((float[]) pixelsIn[n2])[j2*wIn+i2];
							break;
						case COLOR:
							pixelsC[n][j*w+i] = 
									((int[]) pixelsIn[n2])[j2*wIn+i2];
							break;
					}
				}	// end for i
		}	// end for n
		// make output
		ImageStack stackOut = new ImageStack(w, h);
		for(int n=0; n<size; n++) {
			ImageProcessor ipOut = ip.createProcessor(w, h);
			ipOut.setPixels(pixelsOut[n]);
			stackOut.addSlice("", ipOut);
		}
		ImagePlus impOut = new ImagePlus(imp.getTitle(), stackOut);
		//impOut.show();
		impOut.updateAndDraw();
		return impOut;
	}
	
	public void defaultOrientation() {
		inOrientation = CORONAL_LEFT;
		w = wIn; h = sizeIn; size = hIn;
	}

	private boolean processorType() {
		if(ip instanceof ByteProcessor) {
			ipType = BYTE;
			pixelsB = new byte[size][w*h];
			pixelsOut = (Object[]) pixelsB;
		} else if(ip instanceof ShortProcessor) {
			ipType = SHORT;
			pixelsS = new short[size][w*h];
			pixelsOut = (Object[]) pixelsS;
		} else if(ip instanceof FloatProcessor) {
			ipType = FLOAT;
			pixelsF = new float[size][w*h];
			pixelsOut = (Object[]) pixelsF;
		} else if(ip instanceof ColorProcessor) {
			ipType = COLOR;
			pixelsC = new int[size][w*h];
			pixelsOut = (Object[]) pixelsC;
		} else {
			IJ.error("Unknown processor type");
			return false;
		}
		return true;
	}

	void showAbout() {
		IJ.showMessage("About To_AxialTP",
		"This PlugInFilter makes an axial stack from a coronal or\n"+
		"sagital stack.  For a right handed stack:\n"+
		"    x goes from right-to-left\n"+
		"    y goes from anterior-to-posterior\n"+
		"    z goes from caudal-to-cephalic\n"+
		"Install with arguement \"AXIAL_LEFT\" to make a left handed\n"+
		"axial stack (cephalic-to-caudal).  These orientations may\n"+
		"make less sense in non-radiologic applications.\n"+
		"     Axial   Coronal  Sagital\n"+
		"      z        y       -x\n"+
		"     /        /        /\n"+
		"     -----x   -----x   -----y\n"+
		"    |        |        |\n"+
		"    |        |        |\n"+
		"    y       -z       -z"
		);
		return;
	}

}



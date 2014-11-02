package finders.interfaces;

import stackScanner.interfaces.Scanner;
import ij.ImagePlus;

public interface FinderInterface {
	public void loadFiles(String dir, String volume_filename, String aseg_filename);
	public ImagePlus getSagitalView(ImagePlus coronal);
	public ImagePlus getAxialView(ImagePlus coronal);
	public void performSearch() throws InterruptedException;
	public void getInfoFromFormula();
	public void settingSavingFolder(String savingFolder);
	public void saveResult(Scanner seekerCoronal, Scanner seekerSagital, Scanner seekerAxial, String name);
}

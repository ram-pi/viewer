package finders;

import java.util.ArrayList;

import stackScanner.StackSeeker;
import stackScanner.interfaces.Scanner;
import transformation.To_AxialV2;
import transformation.To_SagitalV2;
import utils.ResearchParameters;
import ij.IJ;
import ij.ImagePlus;
import ij.ImageStack;
import ij.nifti.Nifti_Reader;
import ij.nifti.Nifti_Writer;
import ij.process.ImageProcessor;
import finders.interfaces.FinderInterface;

public class SingleStructureFinder implements FinderInterface {

	private Nifti_Writer writer;
	private Nifti_Reader reader;
	private ImagePlus volume;
	private ImagePlus segmentation;
	private String formula;
	
	public ArrayList<Integer> allLabels;
	
	public String savingFolder;
	public ImagePlus result;
	
	public SingleStructureFinder(String formula) {
		this.writer = new Nifti_Writer();
		this.reader = new Nifti_Reader();
		this.result = new ImagePlus();
		this.formula = formula;
		this.allLabels = new ArrayList<>();
	}
	
	@Override
	public void loadFiles(String dir, String volume_filename, String aseg_filename) {
		volume = reader.load(dir, volume_filename);
		segmentation = reader.load(dir, aseg_filename);
		
	}

	@Override
	public ImagePlus getSagitalView(ImagePlus coronal) {
		To_SagitalV2 ts = new To_SagitalV2();
		ts.setup("sagital, left", coronal);
		ImageProcessor p1 = coronal.getStack().getProcessor(1);
		ImagePlus sagital = ts.run(p1);
		return sagital;
	}

	@Override
	public ImagePlus getAxialView(ImagePlus coronal) {
		To_AxialV2 ta = new To_AxialV2();
		ta.setup("axial, left", coronal);
		ImageProcessor p = coronal.getStack().getProcessor(1);
		ImagePlus axial = ta.run(p);
		return axial;
	}

	@Override
	public void performSearch() throws InterruptedException {
		ImageStack coronal = volume.getStack();
		ImageStack coronal_aseg = segmentation.getStack();
		ImageStack sagital = getSagitalView(volume).getStack();
		ImageStack sagital_aseg = getSagitalView(segmentation).getStack();
		ImageStack axial = getAxialView(volume).getStack();
		ImageStack axial_aseg = getAxialView(segmentation).getStack();
		
		ResearchParameters rpCoronal = new ResearchParameters(formula, coronal, coronal_aseg, null, allLabels);
		ResearchParameters rpSagital = new ResearchParameters(formula, sagital, sagital_aseg, null, allLabels);
		ResearchParameters rpAxial = new ResearchParameters(formula, axial, axial_aseg, null, allLabels);
		
		StackSeeker coronalStackSeeker = new StackSeeker("coronal", rpCoronal);
		StackSeeker sagitalStackSeeker = new StackSeeker("sagital", rpSagital);
		StackSeeker axialStackSeeker = new StackSeeker("axial", rpAxial);
		
		coronalStackSeeker.scanningStack();
		sagitalStackSeeker.scanningStack();
		axialStackSeeker.scanningStack();
		
		saveResult(coronalStackSeeker, sagitalStackSeeker, axialStackSeeker, "result.nii");
	}

	@Override
	public void getInfoFromFormula() {
		String[] pieces = formula.split("_");
		for (String piece : pieces) {
			allLabels.add(Integer.parseInt(piece));
		}
	}

	@Override
	public void settingSavingFolder(String savingFolder) {
		this.savingFolder = savingFolder;
	}

	@Override
	public void saveResult(Scanner seekerCoronal, Scanner seekerSagital, Scanner seekerAxial, String name) {
		if (seekerCoronal.getStack().getSize() != 0) {
			ImagePlus toSave = new ImagePlus();
			toSave.setStack(seekerCoronal.getStack());
			result.setStack(seekerCoronal.getStack());
			IJ.save(toSave, savingFolder + "coronal.gif");
		}
		if (seekerSagital.getStack().getSize() != 0) {
			ImagePlus toSave = new ImagePlus();
			result.setStack(seekerSagital.getStack());
			toSave.setStack(seekerSagital.getStack());
			IJ.save(toSave, savingFolder + "sagital.gif");
		}
		if (seekerAxial.getStack().getSize() != 0) {
			ImagePlus toSave = new ImagePlus();
			result.setStack(seekerAxial.getStack());
			toSave.setStack(seekerAxial.getStack());
			IJ.save(toSave, savingFolder + "axial.gif");
		}
		
		if (seekerCoronal.getStack().getSize() == 0 && seekerSagital.getStack().getSize() == 0 && seekerAxial.getStack().getSize() == 0)
			System.out.println("The research found nothing.");
		else
			writer.save(result, savingFolder, name);
	}
	
	public static void main(String[] args) throws InterruptedException {
		System.out.println("");
		SingleStructureFinder sf = new SingleStructureFinder(args[0]);
		sf.getInfoFromFormula();
		sf.loadFiles(args[1], args[3], args[2]);
		sf.settingSavingFolder(args[4]);
		sf.performSearch();	
	}

}

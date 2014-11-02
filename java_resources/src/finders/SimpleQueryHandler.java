package finders;

import java.util.ArrayList;

import ij.IJ;
import ij.ImagePlus;
import ij.ImageStack;
import ij.nifti.Nifti_Reader;
import ij.nifti.Nifti_Writer;
import ij.process.ImageProcessor;
import stackScanner.SimpleQueryStackSeeker;
import stackScanner.interfaces.Scanner;
import transformation.To_AxialV2;
import transformation.To_SagitalV2;
import utils.ResearchParameters;
import finders.interfaces.FinderInterface;

public class SimpleQueryHandler implements FinderInterface{

	private Nifti_Writer writer;
	private Nifti_Reader reader;
	private ImagePlus volume;
	private ImagePlus segmentation;

	private String formula;
	public ArrayList<String> labels;
	public ArrayList<String> tokens;
	public ArrayList<Integer> allLabels;

	public String savingFolder;
	public ImagePlus result;

	public SimpleQueryHandler(String formula) {
		this.formula = formula;
		this.writer = new Nifti_Writer();
		this.reader = new Nifti_Reader();
		this.result = new ImagePlus();
		this.allLabels = new ArrayList<>();
		this.tokens = new ArrayList<>();
	}

	@Override
	public void loadFiles(String dir, String volume_filename, String aseg_filename) {
		volume = reader.load(dir, volume_filename);
		segmentation = reader.load(dir, aseg_filename);

	}

	/* Returns a volume or a segmentation in sagital view, the input must be the coronal(default) view */
	public ImagePlus getSagitalView (ImagePlus ip) {
		To_SagitalV2 ts = new To_SagitalV2();
		ts.setup("sagital, left", ip);
		ImageProcessor p1 = ip.getStack().getProcessor(1);
		ImagePlus sagital = ts.run(p1);
		return sagital;
	}

	public ImagePlus getAxialView (ImagePlus ip) {
		To_AxialV2 ta = new To_AxialV2();
		ta.setup("axial, left", ip);
		ImageProcessor p = ip.getStack().getProcessor(1);
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
		
		ResearchParameters rpCoronal = new ResearchParameters(formula, coronal, coronal_aseg, tokens, allLabels);
		ResearchParameters rpSagital = new ResearchParameters(formula, sagital, sagital_aseg, tokens, allLabels);
		ResearchParameters rpAxial = new ResearchParameters(formula, axial, axial_aseg, tokens, allLabels);
		SimpleQueryStackSeeker seekerCoronal = new SimpleQueryStackSeeker("coronal", rpCoronal);
		SimpleQueryStackSeeker seekerSagital = new SimpleQueryStackSeeker("sagital", rpSagital);
		SimpleQueryStackSeeker seekerAxial = new SimpleQueryStackSeeker("axial", rpAxial);
		seekerCoronal.start();
		seekerSagital.start();
		seekerAxial.start();
		
		seekerAxial.getThread().join();
		seekerCoronal.getThread().join();
		seekerSagital.getThread().join();
		
		saveResult(seekerCoronal, seekerSagital, seekerAxial,"result.nii");
	}

	@Override
	public void getInfoFromFormula() {
		String[] orTokens = formula.split("OR");

		for (int i = 0; i < orTokens.length; i++) {
			tokens.add(orTokens[i]);
			String[] andTokens = orTokens[i].split("AND");
			for (String andLabels : andTokens) {
				String[] labels = andLabels.split("_");
				for (String l : labels) {
					allLabels.add(Integer.parseInt(l));
				}
			}	

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
		SimpleQueryHandler sqh = new SimpleQueryHandler(args[0]);
		sqh.getInfoFromFormula();
		sqh.loadFiles(args[1], args[3], args[2]);
		sqh.settingSavingFolder(args[4]);
		sqh.performSearch();
	}

}

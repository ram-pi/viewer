package finders;

import java.util.ArrayList;

import finders.interfaces.FinderInterface;
import stackScanner.QueryStackSeeker;
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

public class QueryHandler implements FinderInterface {

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

	public QueryHandler(String formula) {
		this.formula = formula;
		this.writer = new Nifti_Writer();
		this.reader = new Nifti_Reader();
		this.result = new ImagePlus();
	}
	
	/* Get all the useful information from the formula and put them into data structures */
	public void getInfoFromFormula() {
		tokens = new ArrayList<String>();
		labels = new ArrayList<String>();
		allLabels = new ArrayList<Integer>();
		
		String[] pieces = formula.split("[()'AND''OR']");
		for (int i = 0; i < pieces.length; i++) {
			if (!pieces[i].isEmpty()) {
				tokens.add(pieces[i]);
			}
		}
		for (String token : tokens) {
			String[] tmpParser = token.split("_");
			for (int i = 0; i < tmpParser.length; i++) {
				labels.add(tmpParser[i]);
				allLabels.add(Integer.parseInt(tmpParser[i]));
			}
		}
		formula = formula.replace("AND", "&&");
		formula = formula.replace("OR", "||");
		System.out.println(formula);
	}
	
	/* Load the file and its segmentation */
	public void loadFiles(String dir, String volume_filename, String aseg_filename) {
		volume = reader.load(dir, volume_filename);
		segmentation = reader.load(dir, aseg_filename);
	}
	
	/* Setting the savingFolder */
	public void settingSavingFolder(String savingFolder) {
		this.savingFolder = savingFolder;
	}
	
	/* Save the result as a nifti file */
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
	
	/* Search in the three stack orientation and collect the slices that satisfy the formula */
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
		QueryStackSeeker seekerCoronal = new QueryStackSeeker("coronal", rpCoronal);
		QueryStackSeeker seekerSagital = new QueryStackSeeker("sagital", rpSagital);
		QueryStackSeeker seekerAxial = new QueryStackSeeker("axial", rpAxial);
		seekerCoronal.start();
		seekerSagital.start();
		seekerAxial.start();
		
		seekerAxial.getThread().join();
		seekerCoronal.getThread().join();
		seekerSagital.getThread().join();
		
		saveResult(seekerCoronal, seekerSagital, seekerAxial,"result.nii");
		
	}
	
	public static void main(String[] args) throws InterruptedException {
		QueryHandler qh = new QueryHandler(args[0]);
		qh.getInfoFromFormula();
		qh.loadFiles(args[1], args[3], args[2]);
		qh.settingSavingFolder(args[4]);
		qh.performSearch();
	}
	
}

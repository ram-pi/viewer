package testing;

import org.junit.Test;

import finders.QueryHandler;
import finders.SimpleQueryHandler;
import finders.SingleStructureFinder;

public class BasicTest {

	@Test
	public void simpleStructureTest() throws InterruptedException {
		System.out.println("SingleStructureFinder...");
		SingleStructureFinder sf = new SingleStructureFinder("1177_2177_3177_4177_11172_12172_13172_14172");
		sf.getInfoFromFormula();
		sf.loadFiles("/Users/pierpaolo/git/viewer/images", "T3.nii.gz", "Segmentation/T3.nii.gz");
		sf.settingSavingFolder("/Users/pierpaolo/Desktop/tmp/gif/");
		sf.performSearch();
	}
	
	@Test
	public void simpleQueryTest() throws InterruptedException {
		System.out.println("SimpleQueryHandler...");
		SimpleQueryHandler sqh = new SimpleQueryHandler("1110_2110_3110_4110_11116_12116_13116_14116AND1137_2137_3137_4137_11105_12105_13105_14105OR1127_2127_3127_4127_11130_12130_13130_14130OR1001_2001");
		sqh.getInfoFromFormula();
		sqh.loadFiles("/Users/pierpaolo/git/viewer/images/", "T3.nii.gz", "Segmentation/T3.nii.gz");
		sqh.settingSavingFolder("/Users/pierpaolo/Desktop/tmp/gif/");
		sqh.performSearch();
	}
	
	@Test 
	public void queryHandlerTest() throws InterruptedException {
		System.out.println("QueryHandler...");
		QueryHandler qh = new QueryHandler("(1109_2109_3109_4109_11115_12115_13115_14115OR1020_1120_2020_2120_3120_4120_11124_12124_13124_14124)OR1115_2115_3115_4115_11119_12119_13119_14119AND(1132_2132_3132_4132_11138_12138_13138_14138OR1018_1118_2018_2118_3118_4118_11122_12122_13122_14122)OR1114_2114_3114_4114_11102_12102_13102_14102");
		qh.getInfoFromFormula();
		qh.settingSavingFolder("/Users/pierpaolo/Desktop/tmp/gif/");
		qh.loadFiles("/Users/pierpaolo/git/viewer/images/", "T3.nii.gz", "Segmentation/T3.nii.gz");
		qh.performSearch();
	}
	
}

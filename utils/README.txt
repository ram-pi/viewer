To load a new Nifti you have to put the segmentation into the DB.
To do this execute the command:
java -jar NiftiDBUpdate.jar DIRECTORY FILENAME
i.e.
java -jar NiftiDBUpdate.jar /Users/username/viewer/images/segmentation T1.nii.gz

To run the stand-alone finder you need to execute the command:
/usr/bin/java -jar QueryHandler.jar QUERY IMAGES_DIRECTORY SEGMENTATION_FILENAME VOLUME_FILENAME RESULT_DIRECTORY
i.e.
/usr/bin/java -jar /Users/pierpaolo/git/viewer/utils/QueryHandler.jar '1008_1134_2008_2134_3134_4134_11134_12134_13134_14134OR1110_2110_3110_4110_11116_12116_13116_14116' /Users/pierpaolo/git/viewer/images/ Segmentation/T3.nii.gz T3.nii.gz /Users/pierpaolo/git/viewer/1008_1134_2008_2134_3134_4134_11134_12134_13134_14134OR1110_2110_3110_4110_11116_12116_13116_14116_T3.nii.gz/
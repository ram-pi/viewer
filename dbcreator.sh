mysql -u root -e "create user 'spine'@'localhost' IDENTIFIED BY 'enips'; GRANT ALL PRIVILEGES ON *.* TO 'spine'@'localhost' WITH GRANT OPTION;" -p;
mysql --user=spine --password=enips -e "create database nifti;";
mysql --user=spine --password=enips -e "use nifti;";
mysql --user=spine --password=enips -e "create table nifti.pixel (name varchar(20) not null, perspective int not null, num int not null, label int not null, primary key(name, perspective, num, label));";
java -jar ./utils/NiftiDBUpdate.jar ./images/Segmentation/ T3.nii.gz;
node server.js;
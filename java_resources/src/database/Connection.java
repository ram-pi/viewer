package database;

import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

public class Connection {
	private java.sql.Connection connection;
	private ResultSet result;

	public void readDB () throws ClassNotFoundException, SQLException {
		Class.forName("com.mysql.jdbc.Driver");

		String url = "jdbc:mysql://localhost/nifti?" + "user=spine&password=enips";
		connection = DriverManager.getConnection(url);
	}

	/* Assume 0 coronal, 1 sagital, 2 axial */
	public void insertPixel(String name, int perspective, int num, int label) {
		try {
			String insert = "insert into nifti.pixel values (?, ?, ?, ?)";
			PreparedStatement ps = connection.prepareStatement(insert);
			ps.setString(1, name);
			ps.setInt(2, perspective);
			ps.setInt(3, num);
			ps.setInt(4, label);
			ps.executeUpdate();
		} catch (SQLException e) {
			System.out.println("error: " + e.getErrorCode() + "\n" + e.getMessage());
		}
	}
	
	public ArrayList<Integer> executeQuery(String name, int perspective, int num) {
		String query = "select label from pixel where name=? and perspective=? and num=?";
		PreparedStatement ps;
		ArrayList<Integer> labels = new ArrayList<>();
		try {
			ps = connection.prepareStatement(query);
			ps.setString(1, name);
			ps.setInt(2, perspective);
			ps.setInt(3, num);
			result = ps.executeQuery();
			if (result != null) {
				while(result.next()) {
					int label = result.getInt(1);
					labels.add(label);
				}
			}
		} catch (SQLException e) {
			System.out.println("error: " + e.getErrorCode() + "\n" + e.getMessage());
		}
		
		return labels;
		
	}

	public Connection() throws ClassNotFoundException, SQLException {
		this.result = null;
		this.readDB();
	}
	
	public static void main(String[] args) throws ClassNotFoundException, SQLException {
		Connection conn = new Connection();
		conn.executeQuery("T3.nii.gz", 1, 170);
	}
}

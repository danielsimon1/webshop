package webshop.test;

import java.io.File;


public class TestAusgabe {
	public static File startdir;

	public static File dir() {
		String userdir = System.getProperty("user.dir");
		startdir = new File(userdir);
		return startdir;
	}
	
	public static void main(String[]args){
		dir();
		System.out.println(startdir.getAbsolutePath());
	}
}

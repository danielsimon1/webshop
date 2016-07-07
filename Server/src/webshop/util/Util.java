package webshop.util;

import java.io.File;

public class Util {
	
	
	public static String deleteLastWhitespaces(String string){
		
		return string.trim();
	}
	
	
	public static File getDirectory() {
		String userdir = System.getProperty("user.dir");
		File startdir = new File(userdir);
		return startdir;
	}
}

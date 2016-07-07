package webshop.test;

import java.io.File;

import webshop.model.Article;

public class TestAusgabe {
	public static File startdir;

	public static void dir() {
		String userdir = System.getProperty("user.dir");
		startdir = new File(userdir);
	}
	
	public static void main(String[]args){
		dir();
		System.out.println(startdir.getAbsolutePath());
	}
}

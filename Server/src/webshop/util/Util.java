package webshop.util;

public class Util {
	public static String deleteAllWhitespaces(String string){
		return string.replaceAll("\\s","");
	}
	public static String deleteLastWhitespaces(String string){
		return string.trim();
	}
}

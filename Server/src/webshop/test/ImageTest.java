package webshop.test;

import java.awt.image.BufferedImage;
import java.awt.image.DataBufferByte;
import java.awt.image.WritableRaster;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;

import javax.imageio.ImageIO;

import com.sun.jersey.core.util.Base64;

import webshop.util.*;

public class ImageTest {

	public static void main(String[] args) {
		String imageName = Util.getDirectory().getAbsolutePath() + "\\resources\\trollface.jpg";
//		byte[] image = getBytes(imageName);
//		for (byte x : image) {
//			System.out.println(x);
//		}
		System.out.println(getEncodedBytes());
	}
	
	
	public static byte[] getImage(){
		String imageName = Util.getDirectory().getAbsolutePath() + "\\resources\\trollface.jpg";
		byte[] image = getBytes(imageName);
		
		return image;
	}
	
	public static String getEncodedBytes(){
		byte[] encoded_data = Base64.encode(getImage());
		String data_string = new String(encoded_data);
		String endString = "{\"image\":\"";
		endString+=data_string;
		endString+="\"}";
		return endString;
	}
	
	
	public static byte[] getBytes(String imageName) {

		try {
			File fi = new File(imageName);
			byte[] fileContent = Files.readAllBytes(fi.toPath());
			return fileContent;
		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;
	}

	// public static byte[] extractBytes(String ImageName) throws IOException {
	// // open image
	// File imgPath = new File(ImageName);
	// BufferedImage bufferedImage = ImageIO.read(imgPath);
	//
	// // get DataBufferBytes from Raster
	// WritableRaster raster = bufferedImage.getRaster();
	// DataBufferByte data = (DataBufferByte) raster.getDataBuffer();
	//
	// return (data.getData());
	// }
}

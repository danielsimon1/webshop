package webshop.model;

import java.util.ArrayList;

import org.json.JSONArray;
import org.json.JSONObject;

public class Article {
	public static final String ID = "ID";
	public static final String NAME = "Name";
	public static final String GENRE = "Genre";
	public static final String PRICE = "Preis";
	public static final String FSK = "FSK";
	public static final String PLATFORMS = "Plattformen";
	public static final String RELEASE = "Release";
	public static final String LANGUAGE = "Sprache";
	public static final String MINRAM = "minRam";
	public static final String MINPROCESSOR = "minProcessor";
	public static final String DESCRIPTION = "Beschreibung";
	public static final String REVIEW = "Rezensionen";
	public static final String GAMEBOY = "gameboy";
	public static final String OSX = "osx";
	public static final String PLAYSTATION = "ps";
	public static final String XBOX = "xbox";
	public static final String WINDOWS = "windows";
	public static final String IMAGE = "image";
	
	
	
	private String id;
	private String name;
	private String genre;
	private double price;
	private int fsk;
	private ArrayList<String> platforms;
	private String release;
	private String language;
	private int minRam;
	private double minProcessor;
	private String description;
	private ArrayList<Review> reviews;
	private String image;

	public Article() {

	}

	public Article(String id, String name, String genre, double price, int fsk, ArrayList<String> platforms,
			String release, String language, int minRam, double minProcessor,

			String description, ArrayList<Review> reviews, String image) {
		this.id = id;
		this.name = name;
		this.genre = genre;
		this.price = price;
		this.fsk = fsk;
		this.platforms = platforms;
		this.release = release;
		this.language = language;
		this.minRam = minRam;
		this.minProcessor = minProcessor;
		this.description = description;
		this.reviews = reviews;
		this.image = image;
	}
	
	public Article(String json) {
		platforms = new ArrayList<>();
		JSONObject obj = new JSONObject(json);
		platforms = new ArrayList<>();
		this.name = obj.getString(NAME);
		this.genre = obj.getString(GENRE);
		this.price = obj.getDouble(PRICE);
		this.fsk = obj.getInt(FSK);
		JSONArray arr = obj.getJSONArray(PLATFORMS);
		for (int i = 0; i < arr.length(); i++) {
			platforms.add(arr.getString(i));
		}
		this.release = obj.getString(RELEASE);
		this.language = obj.getString(LANGUAGE);
		this.minRam = obj.getInt(MINRAM);
		this.minProcessor = obj.getDouble(MINPROCESSOR);
		this.description = obj.getString(DESCRIPTION);
		JSONArray arrRev = obj.getJSONArray(REVIEW);
		for (int i = 0; i < arrRev.length(); i++) {
			reviews.add(new Review(arrRev.getString(i)));
		}
		this.image = obj.getString(IMAGE);

	}
	
	
	public String toJSON() {
		String json = "{"
				+ "\"" + ID +  "\": \"" + id + "\"," 
				+ "\"" + NAME + "\": \"" + name + "\"," 
				+ "\"" + GENRE + "\": \"" + genre +"\"," 
				+ "\"" + PRICE + "\": \"" + price + "\"," 
				+ "\"" + FSK + "\": \"" + fsk + "\"," 
				+ "\"" + PLATFORMS + "\": [";
		for(String x:platforms){
			json+="\"" + x + "\"";
			if(platforms.indexOf(x)!=platforms.size()-1)json+=",";
		}
		json+="],"			
				+ "\"" + RELEASE + "\": \"" + release + "\"," 
				+ "\"" + LANGUAGE + "\": \"" + language + "\"," 
				+ "\"" + MINRAM + "\": \"" + minRam + "\"," 
				+ "\"" + MINPROCESSOR + "\": \"" + minProcessor + "\"," 
				+ "\"" + DESCRIPTION + "\": \"" + description + "\"," 

				+ " \"" + REVIEW + "\": [" ;
		for(Review x:reviews){
			json += x.toJSON();
			if(reviews.indexOf(x)!=reviews.size()-1)json+=",";
		}
		json+="],";		

		json += "\"" + IMAGE + "\": \"" + image + "\"" ;


		json+="}";
		return json;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getGenre() {
		return genre;
	}

	public void setGenre(String genre) {
		this.genre = genre;
	}

	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}

	public int getFsk() {
		return fsk;
	}

	public void setFsk(int fsk) {
		this.fsk = fsk;
	}

	public ArrayList<String> getPlatforms() {

		return platforms;
	}

	public void setPlatforms(ArrayList<String> platforms) {
		this.platforms = platforms;
	}

	public String getRelease() {
		return release;
	}

	public void setRelease(String release) {
		this.release = release;
	}

	public String getLanguage() {
		return language;
	}

	public void setLanguage(String language) {
		this.language = language;
	}

	public int getMinRam() {
		return minRam;
	}

	public void setMinRam(int minRam) {
		this.minRam = minRam;
	}

	public double getMinProcessor() {
		return minProcessor;
	}

	public void setMinProcessor(double minProcessor) {
		this.minProcessor = minProcessor;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public ArrayList<Review> getReviews() {
		return reviews;
	}

	public void setReviews(ArrayList<Review> reviews) {
		this.reviews = reviews;
	}

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

}

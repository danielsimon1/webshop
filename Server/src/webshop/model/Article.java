package webshop.model;

import java.util.Date;

import org.json.JSONArray;
import org.json.JSONObject;

public class Article {
	String id;
	String name;
	String genre;
	double price;
	int fsk;
	String[] platforms;
	Date release;
	String language;
	int minRam;
	double minProcessor;
	// Image image;
	String description;
	Review[] reviews;

	public Article() {

	}

	public Article(String id, String name, String genre, double price, int fsk, String[] platforms, Date release,
			String language, int minRam, double minProcessor,

			String description, Review[] reviews) {
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
	}
	
	public Article(String json) {
		JSONObject obj = new JSONObject(json);
		this.id = obj.getString("ID");
		this.name = obj.getString("Name");
		this.genre = obj.getString("Genre");
		this.price = obj.getDouble("Preis");
		this.fsk = obj.getInt("fsk");
		JSONArray arr = obj.getJSONArray("platforms");
		this.platforms = new String[arr.length()];
		for (int i = 0; i < arr.length(); i++) {
			platforms[i] = arr.getString(i);
		}
		this.release = (Date) obj.get("release");
		this.language = obj.getString("language");
		this.minRam = obj.getInt("minRam");
		this.minProcessor = obj.getDouble("minProcessor");
		this.description = obj.getString("description");
		JSONArray arrRev = obj.getJSONArray("reviews");
		this.reviews = new Review[arrRev.length()];
		for (int i = 0; i < arrRev.length(); i++) {
			reviews[i] = new Review(arrRev.getString(i));
		}
		
	}
	public String toJSON() {
		String json = "{"
				+ "\"ID\": \"" + id + "\"," 
				+ " \"Name\": \"" + name + "\"," 
				+ " \"Genre\": \"" + genre +" \"," 
				+ " \"Preis\": \"" + price + " \"," 
				+ " \"\"FSK: \"" + fsk + "\","
				+ " \"platforms\": [";
		for(int i=0;i<platforms.length;i++){
			json+="\"" + platforms[i] + "\"";
			if(i!=platforms.length-1)json+=",";
		}
		json+="],"				
				+ " \"release\": \"" + release + "\","
				+ " \"language\": \"" + language + "\","
				+ " \"minRam\": \"" + minRam + "\","
				+ " \"minProcessor\": \"" + minProcessor + "\","
				+ " \"description\": \"" + description + "\","
				+ " \"reviews\": [" ;
		for(int i=0;i<reviews.length;i++){
			json+="\"" + reviews[i].toJSON() + "\"";
			if(i!=reviews.length-1)json+=",";
		}
		

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

	public String getPlatforms() {
		String allPlatforms = "";
		for(int i = 0;i<platforms.length-1;i++){
			allPlatforms+=platforms[i];
			if(i<platforms.length-2){
				allPlatforms+=",";
			}
		}
		return allPlatforms;
	}

	public void setPlatforms(String platforms) {
		this.platforms = null;
	}

	public Date getRelease() {
		return release;
	}

	public void setRelease(Date release) {
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

	public Review[] getReviews() {
		return reviews;
	}

	public void setReviews(Review[] reviews) {
		this.reviews = reviews;
	}

	

}

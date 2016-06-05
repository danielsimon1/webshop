package webshop.model;

import org.json.JSONObject;

public class Review {
	public static final String ID = "ID";
	public static final String IDARTICLE = "idArticle";
	public static final String STARS = "stars";
	public static final String AUTHOR = "Autor";
	public static final String TITLE = "Titel";
	public static final String MESSAGE = "Text";

	private String id;
	private String idArticle;
	private int stars;
	private String author;
	private String title;
	private String message;

	public Review() {

	}

	public Review(String json) {
		JSONObject obj = new JSONObject(json);
		this.id = obj.getString(ID);
		this.idArticle = obj.getString(IDARTICLE);
		this.stars = obj.getInt(STARS);
		this.author = obj.getString(AUTHOR);
		this.title = obj.getString(TITLE);
		this.message = obj.getString(MESSAGE);
	}

	public Review(String id, String idArticle, int stars, String author, String title, String message) {
		this.id = id;
		this.idArticle = idArticle;
		this.stars = stars;
		this.author = author;
		this.title = title;
		this.message = message;
	}

	public String toJSON() {
		String json = "{"
				+ "\"ID\": \"" + id + "\"," 
				+ "\"IDArticle\": \"" + idArticle + "\"," 
				+ " \"Sterne\": \"" + stars + "\"," 
				+ " \"Autor\": \"" + author +" \"," 
				+ " \"Titel\": \"" + title + " \"," 
				+ " \"Text\": \"" + message + "\""
				+ "}";
		return json;
	}
	
	public String getId() {
		return id;
	}
	
	public void setId(String id) {
		this.id = id;
	}
	
	public String getIdArticle() {
		return idArticle;
	}
	
	public void setIdArticle(String idArticle) {
		this.idArticle = idArticle;
	}
	
	public int getStars() {
		return stars;
	}
	
	public void setStars(int stars) {
		this.stars = stars;
	}
	
	public String getAuthor() {
		return author;
	}
	
	public void setAuthor(String author) {
		this.author = author;
	}
	
	public String getTitle() {
		return title;
	}
	
	public void setTitle(String title) {
		this.title = title;
	}
	
	public String getMessage() {
		return message;
	}
	
	public void setMessage(String message) {
		this.message = message;
	}
}

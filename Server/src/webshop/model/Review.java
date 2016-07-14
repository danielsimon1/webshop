package webshop.model;

import org.json.JSONObject;

public class Review {
	public static final String ID = "ID";
	public static final String IDARTICLE = "idArticle";
	public static final String STARS = "stars";
	public static final String AUTHOR = "Autor";
	public static final String TITLE = "Titel";
	public static final String MESSAGE = "Text";
	public static final String DATE = "Datum";

	private String id;
	private String idArticle;
	private int stars;
	private String author;
	private String title;
	private String message;
	private String date;


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
		this.date = obj.getString(DATE);
	}

	public Review(String id, String idArticle, int stars, String author, String title, String message, String date) {
		this.id = id;
		this.idArticle = idArticle;
		this.stars = stars;
		this.author = author;
		this.title = title;
		this.message = message;
		this.date = date;
	}

	public String toJSON() {
		String json = "{"
				+ "\"" + ID + "\": \"" + id + "\"," 
				+ "\"" + IDARTICLE + "\": \"" + idArticle + "\"," 
				+ "\"" + STARS + "\": \"" + stars + "\"," 
				+ "\"" + AUTHOR + "\": \"" + author +"\"," 
				+ "\"" + TITLE + "\": \"" + title + "\"," 
				+ "\"" + MESSAGE + "\": \"" + message + "\"," 
				+ "\"" + DATE + "\": \"" + date + "\""
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
	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}
}

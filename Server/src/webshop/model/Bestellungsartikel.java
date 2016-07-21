package webshop.model;

import org.json.JSONObject;

public class Bestellungsartikel {
	public static final String IDORDER = "idOrder";
	public static final String IDARTICLE = "idArticle";
	public static final String NAME = "Name";
	public static final String ANZAHL = "Anzahl";
	public static final String PRICE = "Preis";
	
	
	
	
	private String idOrder;
	private String idArticle;
	private String name;
	private int anzahl;
	private double price;

	public Bestellungsartikel() {

	}

	public Bestellungsartikel(String idOrder, String name, String idArticle, int anzahl, double price) {
		this.idOrder = idOrder;
		this.name = name;
		this.idArticle = idArticle;
		this.anzahl = anzahl;
		this.price = price;
	}

	public Bestellungsartikel(String json) {
		JSONObject obj = new JSONObject(json);
		this.idOrder = obj.getString(IDORDER);
		this.idArticle = obj.getString(IDARTICLE);
		this.name = obj.getString(NAME);
		this.anzahl = obj.getInt(ANZAHL);
		this.price = obj.getDouble(PRICE);
	}
	
	public Bestellungsartikel(JSONObject json) {
		
		this.idOrder = json.getString(IDORDER);
		
		this.idArticle = json.getString(IDARTICLE);
		while(this.idArticle.length()<4){
			this.idArticle = "0" + this.idArticle;
		}
		this.name = json.getString(NAME);
		this.anzahl = json.getInt(ANZAHL);
		this.price = json.getDouble(PRICE);
	}
	
	public String toJSON(){
		String json="{"
				+ "\"" + IDORDER + "\": \""+ idOrder +"\","
				+ "\"" + IDARTICLE + "\": \""+ idArticle +"\","
				+ "\"" + ANZAHL + "\": \"" + anzahl + "\","
				+ "\"" + PRICE + "\": \"" + price + "\","
				+ "\"" + NAME + "\": \"" + name + "\"}";
		return json;		
	}


	public String getIdOrder() {
		return idOrder;
	}

	public void setIdOrder(String idOrder) {
		this.idOrder = idOrder;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getIdArticle() {
		return idArticle;
	}

	public void setIdArticle(String idArticle) {
		this.idArticle = idArticle;
	}

	public int getAnzahl() {
		return anzahl;
	}

	public void setAnzahl(int anzahl) {
		this.anzahl = anzahl;
	}

	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}
	
}

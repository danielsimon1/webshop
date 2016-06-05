package webshop.model;

public class Bestellungsartikel {
	public static final String ID = "ID";
	public static final String IDORDER = "idOrder";
	public static final String NAME = "Name";
	public static final String IDARTICLE = "idArticle";
	public static final String ANZAHL = "Anzahl";
	public static final String PRICE = "Preis";
	
	
	
	
	private String id;
	private String idOrder;
	private String idArticle;
	private String name;
	private int anzahl;
	private double price;

	public Bestellungsartikel() {

	}

	public Bestellungsartikel(String id, String idOrder, String name, String idArticle, int anzahl, double price) {
		this.id = id;
		this.idOrder = idOrder;
		this.name = name;
		this.idArticle = idArticle;
		this.anzahl = anzahl;
		this.price = price;
	}

	public Bestellungsartikel(String json) {

	}
	
	public String toJSON(){
		String json="{"
				+ "\"" + ID + "\": \""+ id+"\","
				+ "\"" + IDARTICLE + "\": \""+ idArticle +"\","
				+ "\"" + ANZAHL + "\": \"" + anzahl + "\","
				+ "\"" + PRICE + "\": \"" + price + " \","
				+ "\"" + NAME + "\": \"" + name + "\"}";
		return json;		
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
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

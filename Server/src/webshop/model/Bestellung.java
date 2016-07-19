package webshop.model;

import java.util.ArrayList;



public class Bestellung {
	public static final String ID = "ID";
	public static final String IDUSER = "idUser";
	public static final String DATE = "Datum";
	public static final String PRICE = "Preis";
	public static final String ORDERARTICLES = "Bestellungsartikel";
	
	
	private String id;
	private String idUser;
	private String date;
	private double price;
	private ArrayList<Bestellungsartikel> liste;

	public Bestellung() {

	}

	public Bestellung(String id, String idUser, String date, double price, ArrayList<Bestellungsartikel> liste) {

		this.id = id;
		this.idUser = idUser;
		this.date = date;
		this.price = price;
		this.liste = liste;
	}

	public Bestellung(String json) {

	}

	public String toJSON() {
		String json = "{" 
				+ "\"" + ID + "\": \"" + id + "\"," 
				+ "\"" + IDUSER + "\": \"" + idUser + "\"," 
				+ "\"" + DATE + "\": \"" + date + "\"," 
				+ "\"" + PRICE + "\": \"" + price+ "\"," 
				+ "\"" + ORDERARTICLES + "\": [";
		for (Bestellungsartikel x:liste) {
			json += x.toJSON();
			if (liste.indexOf(x) != liste.size() - 1) {
				json += ",";
			}
		}
		json += "}";
		return json;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getIdUser() {
		return idUser;
	}

	public void setIdUser(String idUser) {
		this.idUser = idUser;
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}

	public ArrayList<Bestellungsartikel> getListe() {
		return liste;
	}

	public void setListe(ArrayList<Bestellungsartikel> bestellungsartikels) {
		this.liste = bestellungsartikels;
	}

}

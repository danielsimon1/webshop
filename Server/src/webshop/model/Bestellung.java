package webshop.model;

import java.util.Date;



public class Bestellung {
	String id;
	String idUser;
	Date date;
	int price;
	Bestellungsartikel[] liste;

	public Bestellung() {

	}

	public Bestellung(String id, Date date, int price, Bestellungsartikel[] liste) {

		this.id = id;
		this.date = date;
		this.price = price;
		this.liste = liste;
	}

	public Bestellung(String json) {

	}

	public String toJSON() {
		String json = "{" + "\"ID\": \"" + id + "\"," 
				+ " \"UserID\": \"" + idUser + "\"," 
				+ " \"Datum\": \"" + date + "\"," 
				+ " \"Preis\": \"" + price+ " \"," 
				+ " \"Bestellungsartikel\": [";
		for (int i = 0; i < liste.length; i++) {
			json += liste[i].toJSON();
			if (i != liste.length - 1) {
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

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public int getPrice() {
		return price;
	}

	public void setPrice(int price) {
		this.price = price;
	}

	public Bestellungsartikel[] getListe() {
		return liste;
	}

	public void setListe(Bestellungsartikel[] liste) {
		this.liste = liste;
	}

}

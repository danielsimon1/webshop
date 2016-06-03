package webshop.model;

public class Bestellungsliste {
	Bestellung[] liste;
	String idUser;
	public Bestellungsliste() {

	}

	public Bestellungsliste(Bestellung[] liste) {
		this.liste = liste;
	}

	public Bestellungsliste(String json) {

	}

	public String toJSON() {
		String json = "[";
		for (int i = 0; i < liste.length; i++) {
			json += liste[i].toJSON();
			if (i != liste.length - 1) {
				json += ",";
			}
		}
		json += "]";
		return json;
	}
	public String getUserID(){
		return idUser;
	}
}

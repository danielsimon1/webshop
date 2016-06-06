package webshop.model;

import java.util.ArrayList;

public class Bestellungsliste {
	private ArrayList<Bestellung> liste;
	private String idUser;
	public Bestellungsliste() {

	}

	public Bestellungsliste(ArrayList<Bestellung> liste) {
		this.liste = liste;
	}

	public Bestellungsliste(String json) {

	}

	public String toJSON() {
		String json = "[";
		for (Bestellung x:liste) {
			json += x.toJSON();
			if (liste.indexOf(x) != liste.size() - 1) {
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

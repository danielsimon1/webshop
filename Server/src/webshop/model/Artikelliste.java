package webshop.model;

public class Artikelliste {
	Article[] liste;

	public Artikelliste() {

	}

	public Artikelliste(Article[] liste) {
		this.liste = liste;
	}

	public Artikelliste(String json) {

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
}

package webshop.model;

import java.util.ArrayList;

public class Artikelliste {
	private ArrayList<Article> liste;

	public Artikelliste() {

	}

	public Artikelliste(ArrayList<Article> liste) {
		this.liste = liste;
	}

	public Artikelliste(String json) {

	}

	public String toJSON() {
		String json = "[";
		for (Article x:liste) {
			json += x.toJSON();
			if (liste.indexOf(x) != liste.size() - 1) {
				json += ",";
			}
		}
		json += "]";
		return json;
	}
}

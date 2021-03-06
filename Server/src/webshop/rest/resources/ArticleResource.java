package webshop.rest.resources;

import java.sql.SQLException;
import java.util.ArrayList;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

import webshop.db.Datenbank;
import webshop.model.Article;
import webshop.model.Artikelliste;

@Path("/article/get/{attribute}")
public class ArticleResource {
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public String getArticle(@PathParam("attribute") String attribute) {
		try {
			Artikelliste liste = new Artikelliste();
			if (attribute.equals("top")) {
				liste = Datenbank.getArticles("all");
				if(liste.getListe().size()<=5){
					return liste.toJSON();
				}
				Article[] arrArticle = new Article[5];
				ArrayList<Article> arrliste = liste.getListe();
				for (Article x : arrliste) {
					if (arrArticle[4] == null) {
						for (int i = 0; i < 5; i++) {
							if (arrArticle[i] == null) {
								arrArticle[i] = x;
								break;
							}
						}
					} else {
						if (x.getPrice() > arrArticle[4].getPrice()) {
							arrArticle[4] = x;
							int j = 4;
							while (j > 0 && arrArticle[j].getPrice() > arrArticle[j - 1].getPrice()) {
								Article temp = arrArticle[j];
								arrArticle[j] = arrArticle[j - 1];
								arrArticle[j - 1] = temp;
							}

						}
					}
				}
				ArrayList<Article> finalList = new ArrayList<>();
				for (Article x : arrArticle) {
					finalList.add(x);
				}
				if(finalList.size()<1){
					return "\"Hat nicht funktioniert\"";
				}
				Artikelliste finalArtikelliste =  new Artikelliste(finalList);
				
				return finalArtikelliste.toJSON();
			} else if (attribute.equals("new")) {
				liste = Datenbank.getArticles("all");
			} else {
				liste = Datenbank.getArticles(attribute);
				return liste.toJSON();
			}
		} catch (SQLException e) {
			e.printStackTrace();
			return "\"Artikel konnten nicht geladen werden\"";
		}
		return "\"Artikel konnten nicht geladen werden\"";
	}
}

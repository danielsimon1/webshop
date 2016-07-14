package webshop.rest.add;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

import webshop.db.Datenbank;
import webshop.model.Article;

@Path("article")
public class AddArticle {

	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public String addingArticle(String json) {
		Article article = new Article(json);
		return Datenbank.addArticle(article);
		
	}
}

package webshop.rest.resources;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

import webshop.db.Datenbank;

@Path("/article/{attribute}")
public class ArticleResource {
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public String getUser(@PathParam("attribute") String attribute) {
		return Datenbank.getArticles(attribute);
		
	}
}

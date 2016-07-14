package webshop.rest.add;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

import webshop.db.Datenbank;
import webshop.model.Review;


@Path("review")
public class AddReview {
	
	
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public String addingReview(String json) {
		Review review = new Review(json);
		return Datenbank.addReview(review);
	}
}

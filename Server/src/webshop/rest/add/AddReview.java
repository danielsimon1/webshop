package webshop.rest.add;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

import webshop.db.Datenbank;
import webshop.model.Review;


@Path("review")
public class AddReview {
	
	
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	public void addingReview(String json) {
		Datenbank.addReview(new Review(json));
	}
}

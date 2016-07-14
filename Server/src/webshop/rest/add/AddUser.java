package webshop.rest.add;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

import webshop.db.Datenbank;
import webshop.model.User;

@Path("user")
public class AddUser {

	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public String addingUser(String json) {
		User user = new User(json);
		return Datenbank.addUser(user);
	}
}

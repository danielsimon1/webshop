package webshop.rest.add;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

import webshop.db.Datenbank;
import webshop.model.User;

@Path("user")
public class AddUser {

	@POST
//	@Consumes(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.TEXT_PLAIN)
	@Produces(MediaType.TEXT_PLAIN)
	public String addingUser(String json) {
		User user = new User(json);
		if (Datenbank.doesUserAlreadyExists(user.getBenutzername())) {
			return "User existiert bereits";
		} else {
			Datenbank.addUser(user);
		}
		return "User wurde erfolgreich angelegt.";
	}
}

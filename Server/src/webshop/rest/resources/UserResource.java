package webshop.rest.resources;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;


import webshop.db.Datenbank;
import webshop.model.User;

@Path("/user/{username}")
public class UserResource {
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public String getUser(@PathParam("username") String username) {
		User user = Datenbank.getUser(username);
		return user.toJSON();
	}
}

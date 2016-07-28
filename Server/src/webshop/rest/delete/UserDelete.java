package webshop.rest.delete;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;


import webshop.db.Datenbank;

@Path("/user/get/{username}")
public class UserDelete {
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public String getUser(@PathParam("username") String username) {
		return Datenbank.getUser(username);
	}
}

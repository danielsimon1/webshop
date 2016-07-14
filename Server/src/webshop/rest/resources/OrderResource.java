package webshop.rest.resources;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

import webshop.db.Datenbank;

@Path("/order/{id}")
public class OrderResource {
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public String getUser(@PathParam("id") String id) {

		return Datenbank.getOrders(id);
	}
}

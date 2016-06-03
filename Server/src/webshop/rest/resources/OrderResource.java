package webshop.rest.resources;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

import webshop.db.Datenbank;
import webshop.model.Bestellungsliste;

@Path("/order/{id}")
public class OrderResource {
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public String getUser(@PathParam("id") String id) {
		Bestellungsliste liste = Datenbank.getOrders(id);

		return liste.toJSON();
	}
}

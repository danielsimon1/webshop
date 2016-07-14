package webshop.rest.add;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

import webshop.db.Datenbank;
import webshop.model.Bestellung;

@Path("/order/add")
public class AddOrder {

	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public String addingOrder(String json) {
		Bestellung bestellung = new Bestellung(json);
		return Datenbank.addOrder(bestellung);
	}
}

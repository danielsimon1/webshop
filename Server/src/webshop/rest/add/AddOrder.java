package webshop.rest.add;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

import webshop.db.Datenbank;
import webshop.model.Bestellung;

@Path("order")
public class AddOrder {

	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	public void addingOrder(String json) {
		Datenbank.addOrder(new Bestellung(json));
	}
}

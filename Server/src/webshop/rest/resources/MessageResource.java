package webshop.rest.resources;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

@Path("message")
public class MessageResource {
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public String message() {
		return "Yea! ";
	}
}
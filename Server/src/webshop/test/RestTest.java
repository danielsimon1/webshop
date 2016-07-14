package webshop.test;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

@Path("message")
public class RestTest {
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public String message() {
		return "Yea! ";
	}
}
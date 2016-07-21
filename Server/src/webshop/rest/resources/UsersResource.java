package webshop.rest.resources;

import java.sql.SQLException;
import java.util.ArrayList;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;


import webshop.db.Datenbank;
import webshop.model.User;

@Path("/users/get/")
public class UsersResource {
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public String getUsers() {
		try {
			ArrayList<User> userList = Datenbank.getUsers();
			if(userList!=null){
				return toJSON(userList);
			}else{
				return "\"keine User vorhanden\"";
			}
		} catch (SQLException e) {
			e.printStackTrace();
			return "\"User konnten nicht geladen werden\"";
		}
	}

	private String toJSON(ArrayList<User> userList) {
		String userListToJSON = "[";
		for(User x : userList){
			userListToJSON += x.toJSON() + ",";
		}
		char[] arrchar = new char[userListToJSON.length()-1];
		userListToJSON.getChars(0, userListToJSON.length()-1, arrchar, 0);
		userListToJSON = "";
		for(char x : arrchar){
			userListToJSON+=x;
		}
		
		userListToJSON += "]";	
		return userListToJSON;
	}
}

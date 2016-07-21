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
		int size = userList.size();
		for(int i=0;i<size;i++){
			userList.get(i).toJSON();
			if(i!=size-1){
				userListToJSON += ",";
			}
		}
		userListToJSON += "]";	
		return userListToJSON;
	}
}

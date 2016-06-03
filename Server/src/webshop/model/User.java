package webshop.model;

import org.json.JSONObject;

public class User {
	String benutzername;
	String email;
	String password;
	String id;
	String role;

	public User(String benutzername, String password, String email, String id,String role) {
		this.benutzername = benutzername;
		this.password = password;
		this.email = email;
		this.id = id;
		this.role = role;
	}
	

	public User(String json) {
		JSONObject obj = new JSONObject(json);
		this.benutzername = obj.getString("Benutzername");
		this.email = obj.getString("email");
		this.password = obj.getString("password");
//		this.id = createNewID();
	}

	public User() {
	}


	public void setBenutzername(String benutzername) {
		this.benutzername = benutzername;
	}


	public void setEmail(String email) {
		this.email = email;
	}


	public void setPassword(String password) {
		this.password = password;
	}


	public void setId(String id) {
		this.id = id;
	}


	public void setRole(String role) {
		this.role = role;
	}


	public String toJSON(){
		String json="{"
				+ "\"Benutzername\": \""+ benutzername+"\","
				+ " \"email\": \"" + email + "\","
				+ " \"password\": \"" + password + " \","
				+ " \"id\": \"" + id + "\","
				+ " \"Rolle\": \"" + role + "\"}";
		return json;
	}
	
	public String getBenutzername() {
		return benutzername;
	}
	
	public String getEmail() {
		return email;
	}
	
	public String getPassword() {
		return password;
	}
	
	public String getId() {
		return id;
	}
	
	public String getRole() {
		return role;
	}
}

package webshop.model;

import org.json.JSONObject;

public class User {
	public static final String ID = "ID";
	public static final String BENUTZERNAME = "Benutzername";
	public static final String PASSWORD = "Passwort";
	public static final String EMAIL = "E-Mail";
	public static final String ROLE = "Rolle";

	private String id;
	private String benutzername;
	private String password;
	private String email;
	private String role;

	public User() {
	
	}

	public User(String json) {
		JSONObject obj = new JSONObject(json);
		this.benutzername = obj.getString(BENUTZERNAME);
		this.email = obj.getString(EMAIL);
		this.password = obj.getString(PASSWORD);
		this.role = obj.getString(ROLE);
	}

	public User(String benutzername, String password, String email, String id, String role) {
		this.benutzername = benutzername;
		this.password = password;
		this.email = email;
		this.id = id;
		this.role = role;
	}

	public String toJSON(){
		String json="{"
				+ "\"" + BENUTZERNAME + "\": \""+ benutzername+"\","
				+ "\"" + EMAIL + "\": \"" + email + "\","
				+ "\"" + PASSWORD + "\": \"" + password + "\","
				+ "\"" + ID + "\": \"" + id + "\","
				+ "\"" + ROLE+ "\": \"" + role + "\"}";
		return json;
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

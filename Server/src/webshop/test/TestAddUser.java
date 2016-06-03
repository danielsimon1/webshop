package webshop.test;

import webshop.db.Datenbank;
import webshop.model.User;

public class TestAddUser {
	public static void main(String[] args) {
		Datenbank.connectToBD();
		// Datenbank.resetTables();
		User user = new User("Daniel", "secret", "h@gmail.com", "0001", "admin");
		if (Datenbank.doesUserAlreadyExists(user.getBenutzername())) {
			System.out.println("User existiert bereits.");
		} else {
			Datenbank.addUser(user);
		}
		System.out.println(Datenbank.getUser(user.getBenutzername()).toJSON());
		// User user2 = Datenbank.getUser("Matthias");
		// System.out.println(user2.toJSON());

		Datenbank.closeConnectionToDB();
	}
}

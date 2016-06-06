package webshop.test;

import webshop.db.Datenbank;
import webshop.model.User;

public class TestAddUser {
	public static void main(String[] args) {
		Datenbank.connectToBD();
		User user = new User("Daniel", "secret", "h@gmail.com", "0001", "admin");
		Datenbank.addUser(user);
		System.out.println(Datenbank.getUser(user.getBenutzername()));
		String user2 = Datenbank.getUser("Matthias");
		System.out.println(user2);

		Datenbank.closeConnectionToDB();
	}
}

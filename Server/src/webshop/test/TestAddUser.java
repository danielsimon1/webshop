package webshop.test;

import webshop.db.Datenbank;
import webshop.model.User;

public class TestAddUser {
	public static void main(String []args){
		Datenbank.connectToBD();
//		Datenbank.resetTables();
		User user = new User("Daniel", "h@gmail.com", "secret", "0001", "admin");
		Datenbank.addUser(user);
		
//		User user2 = Datenbank.getUser("Matthias");
//		System.out.println(user2.toJSON());
		
		
		Datenbank.closeConnectionToDB();
	}
}

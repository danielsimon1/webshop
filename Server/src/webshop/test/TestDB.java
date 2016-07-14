package webshop.test;

import webshop.db.Datenbank;

public class TestDB {

	public static void main(String[] args) {
		Datenbank.connectToBD();
		Datenbank.addArticle(TestObjekte.getTestArticle1());
		Datenbank.addReview(TestObjekte.getTestReview());
		Datenbank.addUser(TestObjekte.getTestUser());
		Datenbank.closeConnectionToDB();
	}

}

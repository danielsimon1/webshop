package webshop.test;

import webshop.db.Datenbank;
import webshop.model.Review;

public class TestDB {

	public static void main(String[] args) {
		Datenbank.connectToBD();
		Datenbank.closeConnectionToDB();
	}
	
	
	public static void insertTestData(){
		Datenbank.addArticle(TestObjekte.getTestArticle1());
		for(Review x:TestObjekte.getTestReview()){
			Datenbank.addReview(x);
		}
		Datenbank.addUser(TestObjekte.getTestUser());
		Datenbank.addOrder(TestObjekte.getTestOrder());
	}

}

package webshop.test;

import webshop.model.Article;

public class TestAusgabe {
	public static void main(String[]args){
		Article a = new Article();
		System.out.println(a.toJSON());
	}
}

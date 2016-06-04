package webshop.db;

import java.sql.*;

import webshop.model.*;
import webshop.util.Util;

public class Datenbank {

	private static final String ARTICLES = "articles";
	private static final String ORDERARTICLES = "orderArticles";
	private static final String ORDERS = "orders";
	private static final String PLATFORMS = "platforms";
	private static final String REVIEWS = "reviews";
	private static final String USERS = "users";

	private static Connection connection;
	private static User user;
	private static Statement statement;

	protected static void startDB() {

	}

	public static boolean connectToBD() {
		connection = null;

		try {
			connection = DriverManager.getConnection(
					"jdbc:hsqldb:file:D:/users/dsimon/Documents/datenbank-webshop; shutdown=true", "sa", "");
//			connection = DriverManager.getConnection(
//					"jdbc:hsqldb:file:C:/Users/MMU/Documents/Theorie-DHBW/2.Semester/Webengineering; shutdown=true",
//					"sa", "");
			statement = connection.createStatement();
			return true;

		} catch (SQLException e) {
			e.printStackTrace();
		}
		return false;

	}

	public static boolean closeConnectionToDB() {
		if (connection != null) {
			try {
				connection.close();
				System.out.println("Verbindung beendet");
				return false;
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		return true;

	}

	public static void resetTables(){
		deleteTables();
		createTables();
	}

	public static void addArticle(Article article) {
		try {
			String id = getNextID(ARTICLES);
	
			statement.executeUpdate("insert into " + ARTICLES + " values('" 
					+ id + "', '" 
					+ article.getName() + "', '" 
					+ article.getGenre() + "', '" 
					+ article.getPrice() + "', '" 
					+ article.getFsk() + "', '"
					+ article.getPlatforms() + "', '" 
					+ article.getRelease() + "', '" 
					+ article.getLanguage() + "', '"
					+ article.getMinRam() + "', '" 
					+ article.getMinProcessor() + "', '" 
					+ article.getDescription() + "')");
		} catch (SQLException e) {
			e.printStackTrace();
		}
	
	}

	public static void addOrderArticles(Bestellungsartikel[] liste, String idOrder) {
		try {
			
			for (int i = 0; i < liste.length - 1; i++) {
				Bestellungsartikel ba = liste[i];
				String id = getNextID(ORDERARTICLES);
	
				statement.executeUpdate("insert into " + ORDERARTICLES + " values('" 
						+ id + "', '" 
						+ idOrder + "', '" 
						+ ba.getName() + "', '" 
						+ ba.getIdArticle() + "', '" 
						+ ba.getAnzahl() + "', '" 
						+ ba.getPrice() + "')");
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

	public static void addOrder(Bestellung bestellung) {
		try {
			String id = getNextID(ORDERS);
	
			statement.executeUpdate("insert into " + ORDERS + " values('" 
					+ id + "', '" 
					+ bestellung.getIdUser() + "', '" 
					+ bestellung.getDate() + "', '" 
					+ bestellung.getPrice() + "')");
			addOrderArticles(bestellung.getListe(), bestellung.getId());
		} catch (SQLException e) {
			e.printStackTrace();
		}
	
	}
	
	public static void addPlatforms(String[] platforms){
		
	}

	public static void addReview(Review review) {
		try {
			String id = getNextID(REVIEWS);
	
			statement.executeUpdate("insert into " + REVIEWS + " values('" 
					+ id + "', '" 
					+ review.getIdArticle()	+ "', '" 
					+ review.getStars() + "', '" 
					+ review.getAuthor() + "', '" 
					+ review.getTitle() + "', '"
					+ review.getMessage() + "')");
		} catch (SQLException e) {
			e.printStackTrace();
		}
	
	}

	public static void addUser(User user) {
		try {
			String id = getNextID(USERS);
			statement.executeUpdate("insert into " + USERS + " values('" 
					+ id + "', '" 
					+ user.getBenutzername() + "', '" 
					+ user.getPassword() + "', '" 
					+ user.getEmail() + "', '" 
					+ user.getRole() + "')");
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

	public static Artikelliste getArticles(String attribute) {
		try {
			statement = connection.createStatement();
			ResultSet rs;
			int anzahl=0;
			if (attribute.equals("all")) {
				rs = getTable("select * from " +  ARTICLES);
				anzahl = getCount(ARTICLES);
			} else {
				rs = getTable("select * from " + ARTICLES + " where "+  Article.GENRE + " = '" + attribute + "'");
				ResultSet countrs = statement.executeQuery("select count(*) from " + ARTICLES + " where "+  Article.GENRE + " = '" + attribute + "'");
				anzahl = countrs.getInt(1);
			}
			Article[] artikelliste = new Article[anzahl];
			while(rs.next()){
				Article tempArtikel = new Article();
				tempArtikel.setId(Util.deleteLastWhitespaces(rs.getString(Article.ID)));
				tempArtikel.setName(Util.deleteLastWhitespaces(rs.getString(Article.NAME)));
				tempArtikel.setGenre(Util.deleteLastWhitespaces(rs.getString(Article.GENRE)));
				tempArtikel.setPrice(rs.getDouble(Article.PRICE));
				tempArtikel.setFsk(rs.getInt(Article.FSK));
				tempArtikel.setRelease(rs.getDate(Article.RELEASE));
				tempArtikel.setLanguage(Util.deleteLastWhitespaces(rs.getString(Article.LANGUAGE)));
				tempArtikel.setMinRam(rs.getInt(Article.MINRAM));
				tempArtikel.setMinProcessor(rs.getDouble(Article.MINPROCESSOR));
				tempArtikel.setDescription(Util.deleteLastWhitespaces(rs.getString(Article.DESCRIPTION)));
				
				tempArtikel.setReviews(getReviews(tempArtikel.getId()));
				
//				tempArtikel.setPlatforms(getPlatforms(tempArtikel.getId()));
				
				artikelliste[rs.getRow()-1]=tempArtikel;
			}
			return new Artikelliste(artikelliste);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return null;

	}

	public static Bestellungsliste getOrders(String id) {
		try {
			ResultSet rscount = getTable("select Count(*) from " + ORDERS + " where " + Bestellung.ID + " = '" + id + "'");
			Bestellung[] liste = new Bestellung[rscount.getInt(1)];
			ResultSet rs = getTable("select * from " + ORDERS + " where " + Bestellung.ID + " = '" + id + "'");
			for (int i = 0; rs.next(); i++) {
				Bestellung tempOrder = new Bestellung();
				tempOrder.setId(Util.deleteLastWhitespaces(rs.getString(Bestellung.ID)));
				tempOrder.setIdUser(Util.deleteLastWhitespaces(rs.getString(Bestellung.IDUSER)));
				tempOrder.setDate(rs.getDate(Bestellung.DATE));
				tempOrder.setPrice(rs.getInt(Bestellung.PRICE));

				tempOrder.setListe(getOrderArticles(tempOrder.getId()));
				liste[i]=tempOrder;
			}
			return new Bestellungsliste(liste);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return null;
	}

	public static Bestellungsartikel[] getOrderArticles(String idOrder) {
		try {
			ResultSet rscount = getTable("select Count(*) from " + ORDERARTICLES + " where " + Bestellungsartikel.ID + " = '" + idOrder + "'");
			Bestellungsartikel[] liste = new Bestellungsartikel[rscount.getInt(1)];
			ResultSet rs = getTable("select * from " + ORDERARTICLES + " where " + Bestellungsartikel.IDORDER + " = '" + idOrder + "'");
			for(int i = 0;rs.next();i++){
				Bestellungsartikel tempBestellungsartikel = new Bestellungsartikel();
				tempBestellungsartikel.setId(Util.deleteLastWhitespaces(rs.getString(Bestellungsartikel.ID)));
				tempBestellungsartikel.setIdOrder(Util.deleteLastWhitespaces(rs.getString(Bestellungsartikel.IDORDER)));
				tempBestellungsartikel.setIdArticle(Util.deleteLastWhitespaces(rs.getString(Bestellungsartikel.IDARTICLE)));
				tempBestellungsartikel.setAnzahl(rs.getInt(Bestellungsartikel.ANZAHL));
				tempBestellungsartikel.setPrice(rs.getDouble(Bestellungsartikel.PRICE));
				tempBestellungsartikel.setName(Util.deleteLastWhitespaces(rs.getString(Bestellungsartikel.NAME)));
				liste[i]= tempBestellungsartikel;
			}
			return liste;
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;

	}
	
	public static String[] getPlatforms(String idArticle){
		try {
			String[] platforms = new String[5];
			ResultSet rs = getTable("select * from platforms where ");
			while(rs.next()){
				if(rs.getBoolean("gameboy")){
				}
					
			}
			
			return platforms;
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return null;
		
	}

	public static Review[] getReviews(String id) {
		try {
			statement = connection.createStatement();
			Review[] reviews = new Review[getCount(ARTICLES)];
			
			ResultSet rs = getTable("select * from " + REVIEWS + " where " + Review.IDARTICLE + " = '" + id + "'");
			
			while(rs.next()){
				Review tempReview = new Review();
				tempReview.setId(Util.deleteLastWhitespaces(rs.getString(Review.ID)));
				tempReview.setIdArticle(Util.deleteLastWhitespaces(rs.getString(Review.IDARTICLE)));
				tempReview.setStars(rs.getInt(Review.STARS));
				tempReview.setAuthor(Util.deleteLastWhitespaces(rs.getString(Review.AUTHOR)));
				tempReview.setTitle(Util.deleteLastWhitespaces(rs.getString(Review.TITLE)));
				tempReview.setMessage(Util.deleteLastWhitespaces(rs.getString(Review.MESSAGE)));
				reviews[rs.getRow()-1] = tempReview;
			}
			
			
			
			return reviews;
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return null;
		
	}
	
	public static User getUser(String username) {
		try {
			user = new User();
			ResultSet rs = getTable("select * from " + USERS + " where " +  User.BENUTZERNAME + " = '" + username + "'");
			while (rs.next()) {
				user.setId(Util.deleteLastWhitespaces(rs.getString(User.ID)));
				user.setBenutzername(Util.deleteLastWhitespaces(rs.getString(User.BENUTZERNAME)));
				user.setPassword(Util.deleteLastWhitespaces(rs.getString(User.PASSWORD)));
				user.setEmail(Util.deleteLastWhitespaces(rs.getString(User.EMAIL)));
				user.setRole(Util.deleteLastWhitespaces(rs.getString(User.ROLE)));
			}

		} catch (SQLException e) {
			e.printStackTrace();
		}
		return user;
	}

	public static boolean doesUserAlreadyExists(String username) {
		try {
			statement = connection.createStatement();
			ResultSet rs = getTable("select " + User.BENUTZERNAME + " from " + USERS);

			while (rs.next()) {
				if (Util.deleteLastWhitespaces(rs.getString(User.BENUTZERNAME)).equals(username)) {
					return true;
				}
			}
			return false;
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return true;
	}

	public static boolean doesArticleAlreadyExists(String name) {
		try {
			statement = connection.createStatement();
			ResultSet rs = getTable("select " + Article.NAME + " from " + ARTICLES);

			while (rs.next()) {
				if (Util.deleteLastWhitespaces(rs.getString(Article.NAME)).equals(name)) {
					return true;
				}
			}
			return false;
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return true;
	}
	
	private static void deleteTables() {
		try {
			statement.executeUpdate("drop table if exists " + ARTICLES);
			statement.executeUpdate("drop table if exists " + ORDERARTICLES);
			statement.executeUpdate("drop table if exists " + ORDERS);
			statement.executeUpdate("drop table if exists " + PLATFORMS);
			statement.executeUpdate("drop table if exists " + REVIEWS);
			statement.executeUpdate("drop table if exists " + USERS);
	
		} catch (SQLException e) {
			e.printStackTrace();
		}
	
	}

	private static void createTables() {
		try {
			// Articles / Artikel
			statement.executeUpdate("create table if not exists " + ARTICLES + " ( "
					+ Article.ID +" char(4) NOT NULL ,  "
					+ Article.NAME + " char(60) NOT NULL,"
					+ Article.GENRE + " char(20) NOT NULL, " 
					+ Article.PRICE + " double NOT NULL, "
					+ Article.FSK + " int NOT NULL,  " 
					+ Article.PLATFORMS + " char(100) NOT NULL, " 
					+ Article.RELEASE + " date NOT NULL, "
					+ Article.RELEASE + " char(15) NOT NULL, " 
					+ Article.MINRAM + " int NOT NULL, " 
					+ Article.MINPROCESSOR + " double NOT NULL, "
					+ Article.DESCRIPTION + " char(8000) NOT NULL, " 
					+ "PRIMARY KEY (" + Article.ID + ")" + ");");
			// OrderArticles / BestellArtikel
			statement.executeUpdate("create table if not exists " + ORDERARTICLES + " ( " 
					+ Bestellungsartikel.ID + " char(4) not null,"
					+ Bestellungsartikel.IDORDER + " char(4) not null," 
					+ Bestellungsartikel.NAME + " char(60) not null," 
					+ Bestellungsartikel.IDARTICLE + " char(4) not null, "
					+ Bestellungsartikel.ANZAHL + " int not null, " 
					+ Bestellungsartikel.PRICE + " double not null, " + ");");
			// Orders / Bestellungen
			statement.executeUpdate("create table if not exists " + ORDERS + " ( " 
					+ Bestellung.ID + " char(4) not null," 
					+ Bestellung.IDUSER + " char(4) not null,"
					+ Bestellung.DATE + " timestamp not null," 
					+ Bestellung.PRICE + " int not null, " 
					+ "PRIMARY KEY (" + Bestellung.ID + ")" + ");");
			// Platforms / Plattformen
//			statement.executeUpdate("create table if not exists " + PLATFORMS + " ( " 
//					+ Article.ID + " char(4) not null,"
//					+ Article.GAMEBOY + " boolean not null," 
//					+ Article.OSX + " boolean not null," 
//					+ Article.PLAYSTATION + " boolean not null, "
//					+ Article.WINDOWS + " boolean not null, " 
//					+ Article.XBOX + " boolean not null, " + ");");
			statement.executeUpdate("create table if not exists " + PLATFORMS + " ( " 
					+ Article.ID + " char(4) not null,"
					+ Article.PLATFORMS + " char(10) not null, " + ");");
			// Reviews / Rezensionen
			statement.executeUpdate("create table if not exists " + REVIEWS + " ( " 
					+ Review.ID + " char(4) not null, "
					+ Review.IDARTICLE + " char(4) not null, " 
					+ Review.STARS + " int not null, " 
					+ Review.AUTHOR + " char(20), "
					+ Review.TITLE + " char(100), " 
					+ Review.MESSAGE + " char(1000), " 
					+ "PRIMARY KEY (" + Review.ID + ")" + ");");
			// User / Nutzer
			statement.executeUpdate("create table if not exists " + USERS + " ( " 
					+ User.ID + " char(4) NOT NULL ,  "
					+ User.BENUTZERNAME + " char(20) NOT NULL, " 
					+ User.PASSWORD + " char(20) NOT NULL, " 
					+ User.EMAIL + " char(60) NOT NULL,  "
					+ User.ROLE + " char(10) NOT NULL,  " 
					+ "PRIMARY KEY (" + User.ID + ")" + ");");
	
		} catch (SQLException e) {
			e.printStackTrace();
		}
	
	}

	private static String getNextID(String type){
		try {
			ResultSet rs = getTable("select ID from " + type);
			int max = 0;
			while (rs.next()) {
				String id = rs.getString("ID");
				int idInt = Integer.parseInt(id);
				if (idInt > max) {
					max = idInt;
				}
			}
			String nextID = "" + (max +1);
			while(nextID.length()<4){
				nextID = "0" + nextID;
			}
			return nextID;
			
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		
		return "0000";
	}
	
	private static ResultSet getTable(String querry) {
		try {
			statement = connection.createStatement();
			ResultSet rs = statement.executeQuery(querry);
			return rs;
		} catch (Exception e) {
			System.out.println(e);
			return null;
		}
	}
	
	private static int getCount(String tabelle){
		try {
			ResultSet countrs = statement.executeQuery("select count(*) from " + tabelle);
			return countrs.getInt(1);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return 0;
	}
	
}

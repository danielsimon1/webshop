package webshop.db;

import java.io.File;
import java.sql.*;
import java.util.ArrayList;
import java.util.ListIterator;

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

	
	public static File startdir;

	public static void dir() {
		String userdir = System.getProperty("user.dir");
		startdir = new File(userdir);
	}
	
	
	public static boolean connectToBD() {
		connection = null;
		dir();
		try {
			connection = DriverManager.getConnection(
					"jdbc:hsqldb:file:" + startdir.getAbsolutePath() + "; shutdown=true", "sa", "");
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
	
	public static String addArticle(Article article){
		if(Datenbank.doesArticleAlreadyExists(article.getName())){
			return "Artikel existiert bereits";
		}else{
			Datenbank.insertArticle(article);
			return "Artikel wurde erfolgreich hinzugefügt";
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
			insertOrderArticles(bestellung.getListe(), bestellung.getId());
		} catch (SQLException e) {
			e.printStackTrace();
		}
	
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

	public static String addUser(User user){
		if (Datenbank.doesUserAlreadyExists(user.getBenutzername())) {
			return "User existiert bereits";
		} else {
			Datenbank.insertUser(user);
			return "User wurde erfolgreich angelegt.";
		}
	}

	public static Artikelliste getArticles(String attribute) {
		try {
			statement = connection.createStatement();
			ResultSet rs;
			if (attribute.equals("all")) {
				rs = getTable("select * from " +  ARTICLES);
			} else {
				rs = getTable("select * from " + ARTICLES + " where "+  Article.GENRE + " = '" + attribute + "'");
			}
			ArrayList<Article> artikelliste = new ArrayList<>();
			while(rs.next()){
				Article tempArtikel = new Article();
				tempArtikel.setId(Util.deleteLastWhitespaces(rs.getString(Article.ID)));
				tempArtikel.setName(Util.deleteLastWhitespaces(rs.getString(Article.NAME)));
				tempArtikel.setGenre(Util.deleteLastWhitespaces(rs.getString(Article.GENRE)));
				tempArtikel.setPrice(rs.getDouble(Article.PRICE));
				tempArtikel.setFsk(rs.getInt(Article.FSK));
				tempArtikel.setRelease(rs.getString(Article.RELEASE));
				tempArtikel.setLanguage(Util.deleteLastWhitespaces(rs.getString(Article.LANGUAGE)));
				tempArtikel.setMinRam(rs.getInt(Article.MINRAM));
				tempArtikel.setMinProcessor(rs.getDouble(Article.MINPROCESSOR));
				tempArtikel.setDescription(Util.deleteLastWhitespaces(rs.getString(Article.DESCRIPTION)));
				
				tempArtikel.setReviews(getReviews(tempArtikel.getId()));
				
				tempArtikel.setPlatforms(getPlatforms(tempArtikel.getId()));
				
				tempArtikel.setImage(rs.getString(Article.IMAGE));
				artikelliste.add(tempArtikel);
			}
			return new Artikelliste(artikelliste);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return null;
	
	}

	public static Bestellungsliste getOrders(String id) {
		try {
			ArrayList<Bestellung> liste = new ArrayList<>();
			ResultSet rs = getTable("select * from " + ORDERS + " where " + Bestellung.ID + " = '" + id + "'");
			while (rs.next()) {
				Bestellung tempOrder = new Bestellung();
				tempOrder.setId(Util.deleteLastWhitespaces(rs.getString(Bestellung.ID)));
				tempOrder.setIdUser(Util.deleteLastWhitespaces(rs.getString(Bestellung.IDUSER)));
				tempOrder.setDate(rs.getString(Bestellung.DATE));
				tempOrder.setPrice(rs.getInt(Bestellung.PRICE));
	
				tempOrder.setListe(getOrderArticles(tempOrder.getId()));
				liste.add(tempOrder);
			}
			return new Bestellungsliste(liste);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return null;
	}

	public static String getUser(String username){
		if(doesUserAlreadyExists(username)){
			return selectUser(username).toJSON();
		}
		else{
			return "User existiert nicht";
		}
	}
	private static User selectUser(String username) {
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

	private static ArrayList<Bestellungsartikel> getOrderArticles(String idOrder) {
		try {
			ArrayList<Bestellungsartikel> liste = new ArrayList<>();
			ResultSet rs = getTable("select * from " + ORDERARTICLES + " where " + Bestellungsartikel.IDORDER + " = '" + idOrder + "'");
			while(rs.next()){
				Bestellungsartikel tempBestellungsartikel = new Bestellungsartikel();
				tempBestellungsartikel.setId(Util.deleteLastWhitespaces(rs.getString(Bestellungsartikel.ID)));
				tempBestellungsartikel.setIdOrder(Util.deleteLastWhitespaces(rs.getString(Bestellungsartikel.IDORDER)));
				tempBestellungsartikel.setIdArticle(Util.deleteLastWhitespaces(rs.getString(Bestellungsartikel.IDARTICLE)));
				tempBestellungsartikel.setAnzahl(rs.getInt(Bestellungsartikel.ANZAHL));
				tempBestellungsartikel.setPrice(rs.getDouble(Bestellungsartikel.PRICE));
				tempBestellungsartikel.setName(Util.deleteLastWhitespaces(rs.getString(Bestellungsartikel.NAME)));
				liste.add(tempBestellungsartikel);
			}
			return liste;
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;

	}
	
	private static ArrayList<String> getPlatforms(String idArticle){
		try {
			ArrayList<String> platforms = new ArrayList<>();
			ResultSet rs = getTable("select * from " + PLATFORMS + " where " + Article.ID + " = '" + idArticle + "'");
			while(rs.next()){
				platforms.add(rs.getString(Article.PLATFORMS));
			}
			return platforms;
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return null;
		
	}

	private static ArrayList<Review> getReviews(String id) {
		try {
			statement = connection.createStatement();
			ArrayList<Review> reviews = new ArrayList<>();
			
			ResultSet rs = getTable("select * from " + REVIEWS + " where " + Review.IDARTICLE + " = '" + id + "'");
			
			while(rs.next()){
				Review tempReview = new Review();
				tempReview.setId(Util.deleteLastWhitespaces(rs.getString(Review.ID)));
				tempReview.setIdArticle(Util.deleteLastWhitespaces(rs.getString(Review.IDARTICLE)));
				tempReview.setStars(rs.getInt(Review.STARS));
				tempReview.setAuthor(Util.deleteLastWhitespaces(rs.getString(Review.AUTHOR)));
				tempReview.setTitle(Util.deleteLastWhitespaces(rs.getString(Review.TITLE)));
				tempReview.setMessage(Util.deleteLastWhitespaces(rs.getString(Review.MESSAGE)));
				reviews.add(tempReview);
			}
			
			
			
			return reviews;
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return null;
		
	}
	
	private static void insertArticle(Article article) {
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
					+ article.getDescription() + "', '" 
					+ article.getImage() + "')");
			insertPlatforms(article.getPlatforms(),id);
		} catch (SQLException e) {
			e.printStackTrace();
		}
	
	}

	private static void insertOrderArticles(ArrayList<Bestellungsartikel> liste, String idOrder) {
		try {
			ListIterator<Bestellungsartikel> it =  liste.listIterator();
			while(it.hasNext()) {
				Bestellungsartikel ba = it.next();
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

	private static void insertPlatforms(ArrayList<String> platforms,String id){
		try {
			for(String x:platforms){
				statement.executeUpdate("insert into " + PLATFORMS + " values('" 
						+ id + "', '" 
						+ x + "')");
			}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	
	}

	private static void insertUser(User user) {
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

	private static boolean doesUserAlreadyExists(String username) {
		try {
			statement = connection.createStatement();
			ResultSet rs = getTable("select " + User.BENUTZERNAME + " from " + USERS);

			while (rs.next()) {
				if (Util.deleteLastWhitespaces(rs.getString(User.BENUTZERNAME)).equals(username)) {
					System.out.println("User existiert bereits.");
					return true;
				}
			}
			return false;
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return true;
	}

	private static boolean doesArticleAlreadyExists(String name) {
		try {
			statement = connection.createStatement();
			ResultSet rs = getTable("select " + Article.NAME + " from " + ARTICLES);

			while (rs.next()) {
				if (Util.deleteLastWhitespaces(rs.getString(Article.NAME)).equals(name)) {
					System.out.println("Artikel existiert bereits.");
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
					+ Article.RELEASE + " char(20) NOT NULL, "
					+ Article.LANGUAGE + " char(15) NOT NULL, " 
					+ Article.MINRAM + " int NOT NULL, " 
					+ Article.MINPROCESSOR + " double NOT NULL, "
					+ Article.DESCRIPTION + " char(8000) NOT NULL, " 
					+ Article.IMAGE + " clob NOT NULL, " 
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
					+ Bestellung.DATE + " char(40) not null," 
					+ Bestellung.PRICE + " int not null, " 
					+ "PRIMARY KEY (" + Bestellung.ID + ")" + ");");
			// Platforms / Plattformen
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
	
}

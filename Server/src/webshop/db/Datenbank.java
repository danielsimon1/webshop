package webshop.db;

import java.io.File;
import java.sql.*;
import java.util.ArrayList;
import java.util.Collections;
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
	private static Statement statement;

	
	private static File startdir;

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
		try {
			if(Datenbank.doesArticleAlreadyExists(article.getName())){
				return "\"Artikel existiert bereits\"";
			}else{
				Datenbank.insertArticle(article);
				return "\"Artikel wurde hinzugefügt\"";
			}
		} catch (Exception e) {
			e.printStackTrace();
			return "\"Artikel konnte nicht hinzugefügt werden\"";
		}
	}
	
	public static String addOrder(Bestellung bestellung) {
		try {
			String id = getNextID(ORDERS);
			bestellung.setId(id);
			statement.executeUpdate("insert into " + ORDERS + " values('" 
					+ id + "', '" 
					+ bestellung.getIdUser() + "', '" 
					+ bestellung.getDate() + "', '" 
					+ bestellung.getPrice() + "')");
			insertOrderArticles(bestellung.getListe(), bestellung.getId());
			return "\"Bestellung wurde hinzugefügt\"";
		} catch (SQLException | KeineNeueIDException e) {
			e.printStackTrace();
			return "\"Bestellung konnte nicht hinzugefügt werden\"";
		} 
	
	}

	public static String addReview(Review review) {
		try {
			statement.executeUpdate("delete from " + REVIEWS + " where " + Review.AUTHOR + " = '" + review.getAuthor() + "'");
			
			String id = getNextID(REVIEWS);
	
			statement.executeUpdate("insert into " + REVIEWS + " values('" 
					+ id + "', '" 
					+ review.getIdArticle()	+ "', '" 
					+ review.getStars() + "', '" 
					+ review.getAuthor() + "', '" 
					+ review.getTitle() + "', '"
					+ review.getMessage() + "', '"
					+ review.getDate() + "')");
			return "\"Rezension wurde hinzugefügt\"";
		} catch (SQLException | KeineNeueIDException e) {
			e.printStackTrace();
			return "\"Rezension konnte nicht hinzugefügt werden\"";
		}
	
	}

	public static String addUser(User user) {
		try {
			if (Datenbank.doesUserAlreadyExists(user.getBenutzername())) {
				return "\"User existiert bereits\"";	
			} else {
				Datenbank.insertUser(user);
				return "\"User wurde erfolgreich angelegt.\"";

			}
		} catch (SQLException | KeineNeueIDException e) {
			e.printStackTrace();
			return "\"User konnte nicht angelegt werden\"";
		}
	}

	public static Artikelliste getArticles(String attribute) throws SQLException {
		try {
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
				tempArtikel.setRelease(Util.deleteLastWhitespaces(rs.getString(Article.RELEASE)));
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

	public static String getOrders(String id) {
		try {
			ArrayList<Bestellung> liste = new ArrayList<>();
			ResultSet rs = getTable("select * from " + ORDERS + " where " + Bestellung.IDUSER + " = '" + id + "'");
			
			while (rs.next()) {
				Bestellung tempOrder = new Bestellung();
				tempOrder.setId(Util.deleteLastWhitespaces(rs.getString(Bestellung.ID)));
				tempOrder.setIdUser(Util.deleteLastWhitespaces(rs.getString(Bestellung.IDUSER)));
				tempOrder.setDate(Util.deleteLastWhitespaces(rs.getString(Bestellung.DATE)));
				tempOrder.setPrice(rs.getDouble(Bestellung.PRICE));
	
				tempOrder.setListe(getOrderArticles(tempOrder.getId()));
				liste.add(tempOrder);
			}
			return new Bestellungsliste(liste).toJSON();
		} catch (SQLException e) {
			e.printStackTrace();
			return "\"Bestellungen konnten nicht geladen werden\"";
		}
	}
	
	public static String getUser(String username) {
		try {
			User user = new User();
			ResultSet rs = getTable("select * from " + USERS + " where " +  User.BENUTZERNAME + " = '" + username + "'");
			
			while (rs.next()) {
				user.setId(Util.deleteLastWhitespaces(rs.getString(User.ID)));
				user.setBenutzername(Util.deleteLastWhitespaces(rs.getString(User.BENUTZERNAME)));
				user.setPassword(Util.deleteLastWhitespaces(rs.getString(User.PASSWORD)));
				user.setEmail(Util.deleteLastWhitespaces(rs.getString(User.EMAIL)));
				user.setRole(Util.deleteLastWhitespaces(rs.getString(User.ROLE)));
			}
			return user.toJSON();
	
		} catch (SQLException e) {
			e.printStackTrace();
			return "\"User konnten nicht geladen werden\"";
		}
	}
	
	public static ArrayList<User> getUsers()throws SQLException {
		try {
			ResultSet rs = getTable("select * from " + USERS);
			ArrayList<User> userList = new ArrayList<>();
			while (rs.next()) {
				User user = new User();
				user.setId(Util.deleteLastWhitespaces(rs.getString(User.ID)));
				user.setBenutzername(Util.deleteLastWhitespaces(rs.getString(User.BENUTZERNAME)));
				user.setPassword("");
				user.setEmail(Util.deleteLastWhitespaces(rs.getString(User.EMAIL)));
				user.setRole(Util.deleteLastWhitespaces(rs.getString(User.ROLE)));
				userList.add(user);
			}
			return userList;
	
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return null;
	}

	private static ArrayList<Bestellungsartikel> getOrderArticles(String idOrder) {
		try {
			ArrayList<Bestellungsartikel> liste = new ArrayList<>();
			ResultSet rs = getTable("select * from " + ORDERARTICLES + " where " + Bestellungsartikel.IDORDER + " = '" + idOrder + "'");
			while(rs.next()){
				Bestellungsartikel tempBestellungsartikel = new Bestellungsartikel();
				tempBestellungsartikel.setIdOrder(Util.deleteLastWhitespaces(rs.getString(Bestellungsartikel.IDORDER)));
				tempBestellungsartikel.setIdArticle(Util.deleteLastWhitespaces(rs.getString(Bestellungsartikel.IDARTICLE)));
				tempBestellungsartikel.setAnzahl(rs.getInt(Bestellungsartikel.ANZAHL));
				tempBestellungsartikel.setPrice(rs.getDouble(Bestellungsartikel.PRICE));
				tempBestellungsartikel.setName(Util.deleteLastWhitespaces(rs.getString(Bestellungsartikel.NAME)));
				liste.add(tempBestellungsartikel);
			}
			return liste;
		} catch (SQLException e) {
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
				tempReview.setDate(Util.deleteLastWhitespaces(rs.getString(Review.DATE)));
				reviews.add(tempReview);
			}
			
			
			
			return reviews;
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return null;
		
	}
	
	private static void insertArticle(Article article)throws SQLException,KeineNeueIDException{
			
		try{
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
		} catch (SQLException | KeineNeueIDException e) {
			e.printStackTrace();
		}
	}

	private static void insertOrderArticles(ArrayList<Bestellungsartikel> liste, String idOrder) {
		try {
			ListIterator<Bestellungsartikel> it =  liste.listIterator();
			while(it.hasNext()) {
				Bestellungsartikel ba = it.next();
	
				statement.executeUpdate("insert into " + ORDERARTICLES + " values('" 
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
			e.printStackTrace();
		}
	
	}

	private static boolean insertUser(User user) throws SQLException,KeineNeueIDException{
		try {
			String id = getNextID(USERS);
			statement.executeUpdate("insert into " + USERS + " values('" 
					+ id + "', '" 
					+ user.getBenutzername() + "', '" 
					+ user.getPassword() + "', '" 
					+ user.getEmail() + "', '" 
					+ user.getRole() + "')");
			return true;
		} catch (SQLException | KeineNeueIDException e) {
			e.printStackTrace();
			return false;
		}
	}

	private static boolean doesUserAlreadyExists(String username) throws SQLException {
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

	private static boolean doesArticleAlreadyExists(String name) throws SQLException {
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
			return false;
		}
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
					+ Bestellung.PRICE + " double not null, " 
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
					+ Review.DATE + " char(20), " 
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

	private static String getNextID(String type)throws KeineNeueIDException{
		try {
			ResultSet rs = getTable("select ID from " + type);
			ArrayList<Integer> list = new ArrayList<>();
			while (rs.next()) {
				String id = rs.getString("ID");
				int idAsInteger = Integer.parseInt(id);
				list.add(idAsInteger);
			}
			Collections.sort(list);
			int i=0;
			for(Integer x:list){
				if(x!=i){
					break;
				}
				i++;
			}
			String nextID = "" + i;
			while(nextID.length()<4){
				nextID = "0" + nextID;
			}
			return nextID;
			
		} catch (SQLException e) {
			e.printStackTrace();
			return null;
		}
		
		
	}
	
	private static ResultSet getTable(String querry) throws SQLException{
		try {
			statement = connection.createStatement();
			ResultSet rs = statement.executeQuery(querry);
			return rs;
		} catch (Exception e) {
			System.out.println(e);
			return null;
		}
	}

	private static void dir() {
		String userdir = System.getProperty("user.dir");
		startdir = new File(userdir);
	}

	public static String deleteUser(String username) {
		try {
			statement.executeUpdate("delete from " + USERS + " where " + User.BENUTZERNAME + " = '" + username + "'");
		} catch (SQLException e) {
			e.printStackTrace();
			return "\"User " + username + " wurde erfolgreich gelöscht.";
		}

		return "\"Hat nicht funktioniert\"";
	}

	
	
}

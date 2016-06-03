package webshop.db;

import java.sql.*;

import webshop.model.*;
import webshop.util.Util;

public class Datenbank {

	private static Connection connection;
	private static User user;
	private static Statement statement;

	protected static void startDB() {

	}

	public static boolean connectToBD() {
		connection = null;

		try {
			connection = DriverManager.getConnection(
					"jdbc:hsqldb:file:D:/users/dsimon/Documents/datenbank-webshop; shutdown=true",
					"sa", "");
//			connection = DriverManager.getConnection(
//					"jdbc:hsqldb:file:C:/Users/MMU/Documents/Theorie-DHBW/2.Semester/Webengineering; shutdown=true",
//					"sa", "");
			statement = connection.createStatement();
			return true;

		} catch (SQLException e) {
			e.printStackTrace();
		}
		// finally {
		// if (connection != null) {
		// try {
		// connection.close();
		// System.out.println("Connection closed.");
		// } catch (SQLException e) {
		// e.printStackTrace();
		// }
		// }
		// }
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

	public static void deleteTables() {
		try {
			statement.executeUpdate("drop table if exists users");
			statement.executeUpdate("drop table if exists articles");
			statement.executeUpdate("drop table if exists reviews");
			statement.executeUpdate("drop table if exists orders");
			statement.executeUpdate("drop table if exists orderArticles");

		} catch (SQLException e) {
			e.printStackTrace();
		}

	}

	public static void createTables() {
		try {
			// User
			statement.executeUpdate("CREATE TABLE if not exists users ( " + "id char(4) NOT NULL ,  "
					+ "benutzername char(20) NOT NULL, " + "password char(20) NOT NULL, " + "email char(60) NOT NULL,  "
					+ "role char(10) NOT NULL,  " + "PRIMARY KEY (id)" + ");");
			// Artikel
			statement.executeUpdate("CREATE TABLE if not exists articles ( " + "id char(4) NOT NULL ,  "
					+ "Name char(60) NOT NULL,  " + "Genre char(20) NOT NULL, " + "Preis double NOT NULL, "
					+ "fsk int NOT NULL,  " + "platforms char(100) NOT NULL, " + "release date NOT NULL, "
					+ "language char(15) NOT NULL, " + "minRam int NOT NULL, " + "minProcessor double NOT NULL, "
					+ "description char(8000) NOT NULL, " + "PRIMARY KEY (id)" + ");");
			// Reviews
			statement.executeUpdate("create table if not exists reviews ( " + "id char(4) not null, "
					+ "idArticle char(4) not null, " + "stars int not null, " + "author char(20), "
					+ "title char(100), " + "message char(1000), " + "PRIMARY KEY (id)" + ");");
			// Bestellungen
			statement.executeUpdate(
					"create table if not exists orders ( " + "id char(4) not null," + "idUser char(4) not null,"
							+ "date timestamp not null," + "preis int not null, " + "PRIMARY KEY (id)" + ");");
			// BestellArtikel
			statement.executeUpdate("create table if not exists orderArticles ( " + "id char(4) not null,"
					+ "idOrder char(4) not null," + "Name char(60) not null," + "idArticle char(4) not null, "
					+ "Anzahl int not null, " + "preis double not null, " + "PRIMARY KEY (id)" + ");");

		} catch (SQLException e) {
			e.printStackTrace();
		}

	}
	
	public static void resetTables(){
		deleteTables();
		createTables();
	}

	public static Artikelliste getArticles(String attribute) {
		try {
			statement = connection.createStatement();
			ResultSet rs;
			ResultSet countrs;
			if (attribute.equals("all")) {
				rs = getTable("select * from articles");
				countrs = statement.executeQuery("select count(*) from articles");
			} else {
				rs = getTable("select * from articles where genre = '" + attribute + "'");
				countrs = statement.executeQuery("select count(*) from articles where genre = '" + attribute + "'");
			}
			Article[] artikelliste = new Article[countrs.getInt(1)];
			while(rs.next()){
				Article tempArtikel = new Article();
				tempArtikel.setId(Util.deleteLastWhitespaces(rs.getString("id")));
				tempArtikel.setName(Util.deleteLastWhitespaces(rs.getString("Name")));
				tempArtikel.setGenre(Util.deleteLastWhitespaces(rs.getString("genre")));
				tempArtikel.setPrice(rs.getDouble("preis"));
				tempArtikel.setFsk(rs.getInt("fsk"));
				tempArtikel.setPlatforms(Util.deleteLastWhitespaces(rs.getString("platforms")));
				tempArtikel.setRelease(rs.getDate("release"));
				tempArtikel.setLanguage(Util.deleteLastWhitespaces(rs.getString("language")));
				tempArtikel.setMinRam(rs.getInt("minRam"));
				tempArtikel.setMinProcessor(rs.getDouble("minProcessor"));
				tempArtikel.setDescription(Util.deleteLastWhitespaces(rs.getString("description")));
				tempArtikel.setReviews(getReviews(tempArtikel.getId()));
				artikelliste[rs.getRow()-1]=tempArtikel;
			}
			return new Artikelliste(artikelliste);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return null;

	}

	public static Bestellungsliste getOrders(String id) {
		return null;
	}

	public static Review[] getReviews(String id) {
		try {
			statement = connection.createStatement();
			ResultSet countrs = statement.executeQuery("select count(*) from articles");
			Review[] reviews = new Review[countrs.getInt(1)];
			
			ResultSet rs = getTable("select * from reviews where idArticle = '" + id + "'");
			
			while(rs.next()){
				Review tempReview = new Review();
				tempReview.setId(Util.deleteLastWhitespaces(rs.getString("id")));
				tempReview.setIdArticle(Util.deleteLastWhitespaces(rs.getString("idArticle")));
				tempReview.setStars(rs.getInt("stars"));
				tempReview.setAuthor(Util.deleteLastWhitespaces(rs.getString("author")));
				tempReview.setTitle(Util.deleteLastWhitespaces(rs.getString("title")));
				tempReview.setMessage(Util.deleteLastWhitespaces(rs.getString("message")));
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
			ResultSet rs = getTable("select * from users where Benutzername = '" + username + "'");
			while (rs.next()) {
				user.setId(Util.deleteLastWhitespaces(rs.getString("id")));
				user.setBenutzername(Util.deleteLastWhitespaces(rs.getString("benutzername")));
				user.setPassword(Util.deleteLastWhitespaces(rs.getString("password")));
				user.setEmail(Util.deleteLastWhitespaces(rs.getString("email")));
				user.setRole(Util.deleteLastWhitespaces(rs.getString("role")));

			}

		} catch (SQLException e) {
			e.printStackTrace();
		}
		return user;
	}

	public static void addArticle(Article article) {
		try {
			String id = getNextID("articles");

			statement.executeUpdate("insert into articles values('" + id + "', '" + article.getName()
					+ "', '" + article.getGenre() + "', '" + article.getPrice() + "', '" + article.getFsk() + "', '"
					+ article.getPlatforms() + "', '" + article.getRelease() + "', '" + article.getLanguage() + "', '"
					+ article.getMinRam() + "', '" + article.getMinProcessor() + "', '" + article.getDescription()
					+ "')");
		} catch (SQLException e) {
			e.printStackTrace();
		}

	}

	public static void addReview(Review review) {
		try {
			String id = getNextID("reviews");

			statement.executeUpdate("insert into reviews values('" + id + "', '" + review.getIdArticle()
					+ "', '" + review.getStars() + "', '" + review.getAuthor() + "', '" + review.getTitle() + "', '"
					+ review.getMessage() + "')");
		} catch (SQLException e) {
			e.printStackTrace();
		}

	}

	public static void addOrder(Bestellung bestellung) {
		try {
			String id = getNextID("orders");

			statement.executeUpdate("insert into orders values('" + id + "', '" + bestellung.getIdUser()
					+ "', '" + bestellung.getDate() + "', '" + bestellung.getPrice() + "')");
			addOrderArticles(bestellung.getListe(), bestellung.getId());
		} catch (SQLException e) {
			e.printStackTrace();
		}

	}

	public static void addOrderArticles(Bestellungsartikel[] liste, String idOrder) {
		try {
			
			for (int i = 0; i < liste.length - 1; i++) {
				Bestellungsartikel ba = liste[i];
				String id = getNextID("orderArticles");

				statement.executeUpdate(
						"insert into orderarticles values('" + id + "', '" + idOrder + "', '" + ba.getName()
								+ "', '" + ba.getIdArticle() + "', '" + ba.getAnzahl() + "', '" + ba.getPrice() + "')");

			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

	public static void addUser(User user) {
		try {
			String id = getNextID("users");
			statement.executeUpdate("insert into users values('" + id + "', '" + user.getBenutzername()
					+ "', '" + user.getPassword() + "', '" + user.getEmail() + "', '" + user.getRole() + "')");
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

	public static boolean doesUserAlreadyExists(String username) {
		try {
			statement = connection.createStatement();
			ResultSet rs = getTable("select benutzername from users");

			while (rs.next()) {
				if (Util.deleteLastWhitespaces(rs.getString("benutzername")).equals(username)) {
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
			ResultSet rs = getTable("select name from articles");

			while (rs.next()) {
				if (Util.deleteLastWhitespaces(rs.getString("name")).equals(name)) {
					return true;
				}
			}
			return false;
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return true;
	}
	
	private static String getNextID(String type){
		try {
			ResultSet rs = getTable("select id from " + type);
			int max = 0;
			while (rs.next()) {
				String id = rs.getString("id");
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

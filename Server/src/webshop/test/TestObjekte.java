package webshop.test;

import java.sql.Date;
import java.util.ArrayList;

import webshop.model.Article;
import webshop.model.Review;
import webshop.model.User;

public class TestObjekte {
	
	public static Article getTestArticle() {
		ArrayList<String> platforms = new ArrayList<>();
		platforms.add(Article.PLAYSTATION);
		platforms.add(Article.WINDOWS);
		platforms.add(Article.XBOX);
		platforms.add(Article.OSX);
		
		Date release = new Date(2007, 06, 12);
		String description = "Im Herbst 2009 kehrt Entwickler Infinity Ward mit Call of Duty: Modern Warfare 2 auf die Bildschirme zurück. "
				+ "Das wohl am sehnlichsten erwartete Spiel des Jahresist die Fortsetzung zu Call of Duty 4: Modern Warfare, dem wohl meistverkauften Ego-Actionspiel aller Zeiten. "
				+ "Modern Warfare 2 setzt die packende Saga mitbeispielloser Action fort und konfrontiert die Spieler mit einer neuen Bedrohung, welche die Welt an den Rand des Zusammenbruchs bringen könnte."
				+ "Eines der vielen Highlights von Call of Duty: Modern Warfare 2 ist der Soundtrack. Der legendäre Hans Zimmer, Academy Award-, Golden Globe- und Grammy-Preisträger, war für diesen federführend verantwortlich."
				+ "Der Titel knüpft direkt an den Plot des Blockbusters Call of Duty 4: Modern Warfare an, der weltweit bleibenden Eindruck hinterließ "
				+ "(14 Millionen verkaufte Exemplare, „Das am häufigsten gespielte Online-Videospiel aller Zeiten“ (Guinness World Records 2009), "
				+ "mehr als 50 Auszeichnungen zum Spiel des Jahres, darunter Console Game of the Year und Overall Game of the Year 2007 der Academy of Interactive Arts & Science). "
				+ "Spezialeinsätze im Kooperations-Modus. Es gibt einen neuen Zweispieler-Modus, der sich entweder online oder im Splitscreen spielen lässt, und ganz neue Spielerfahrungen bietet:"
				+ "Spezialeinsätze, welche die Spieler in zeitbasierte Missionen entsenden"
				+ "Steige als Spieler auf und schalte neue, ständig schwierigere Spezialeinsätze frei"
				+ "Die Einsätze beinhalten Highlights der Solo-Kampagne, Fan-Favoriten aus Call of Duty 4 und vollkommen neue, exklusive Einsätze"

				+ "Die Neuerfindung des Multiplayers"
				+ "Modern Warfare 2 legt die Messlatte für Online-Multiplayer-Erfahrungen noch höher und bietet neue Fähigkeiten, Anpassungsmöglichkeiten und Modi, z. B.:"
				+ "Anpassungsfähige Killstreaks:"

				+ "    AC130" + "    Sentry Gun" + "    Ferngesteuerte Drohnen" + "    Versorgungspakete"

				+ "Auszeichnungen (Einsatzreporte)" + "Create-a-Class beinhaltet:" + "1. Ergänzende Waffen"

				+ "    Maschinenpistolen" + "    Schrotflinten" + "    Handfeuerwaffen" + "    Raketenwerfer"

				+ "2. Taktische Einsatzschilder" + "3. Equipment"

				+ "    Wurfmesser" + "    Energieschilder" + "    Taktische Landungen"

				+ "4. Perk-Upgrades" + "5. Bling (zweifache Ausrüstungsoption)"

				+ "Über den Entwickler: Infinity Ward"
				+ "Infinity Ward, Inc. ist ein US-amerikanischer Spieleentwickler. Das Unternehmen wurde im August 2001 von 22 ehemaligen Entwicklern des Spiels Medal of Honor Allied Assault gegründet. "
				+ "Die erste Veröffentlichung von Infinity Ward war Call of Duty, das zahlreiche Auszeichnungen als bestes Spiel gewann und neue Maßstäbe für zukünftige First Person Action Games setzte.";
		Article article = new Article("0000", "Call of Duty: Modern Warfare 2", "Shooter", 9.99, 18, platforms, release,
				"Deutsch ", 2, 2.2, description, null);
		return article;
	}
	
	public static Review getTestReview(){
		return 	new Review("0000", "0000", 5, "Matze", "beschtes Spiel", "wirklich gut gemacht von Infinity Ward");
	}
	
	public static User getTestUser(){
		return new User("Matthias", "secret", "m@gmail.com", "0000", "admin");
	}
}

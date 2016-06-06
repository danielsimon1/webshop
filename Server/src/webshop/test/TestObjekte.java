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
		@SuppressWarnings("deprecation")
		Date release = new Date(22, 2, 2);
		String description = "Im Herbst 2009 kehrt Entwickler Infinity Ward mit Call of Duty: Modern Warfare 2 auf die Bildschirme zur�ck. "
				+ "Das wohl am sehnlichsten erwartete Spiel des Jahresist die Fortsetzung zu Call of Duty 4: Modern Warfare, dem wohl meistverkauften Ego-Actionspiel aller Zeiten. "
				+ "Modern Warfare 2 setzt die packende Saga mitbeispielloser Action fort und konfrontiert die Spieler mit einer neuen Bedrohung, welche die Welt an den Rand des Zusammenbruchs bringen k�nnte."
				+ "Eines der vielen Highlights von Call of Duty: Modern Warfare 2 ist der Soundtrack. Der legend�re Hans Zimmer, Academy Award-, Golden Globe- und Grammy-Preistr�ger, war f�r diesen federf�hrend verantwortlich."
				+ "Der Titel kn�pft direkt an den Plot des Blockbusters Call of Duty 4: Modern Warfare an, der weltweit bleibenden Eindruck hinterlie� "
				+ "(14 Millionen verkaufte Exemplare, �Das am h�ufigsten gespielte Online-Videospiel aller Zeiten� (Guinness World Records 2009), "
				+ "mehr als 50 Auszeichnungen zum Spiel des Jahres, darunter Console Game of the Year und Overall Game of the Year 2007 der Academy of Interactive Arts & Science). "
				+ "Spezialeins�tze im Kooperations-Modus. Es gibt einen neuen Zweispieler-Modus, der sich entweder online oder im Splitscreen spielen l�sst, und ganz neue Spielerfahrungen bietet:"
				+ "Spezialeins�tze, welche die Spieler in zeitbasierte Missionen entsenden"
				+ "Steige als Spieler auf und schalte neue, st�ndig schwierigere Spezialeins�tze frei"
				+ "Die Eins�tze beinhalten Highlights der Solo-Kampagne, Fan-Favoriten aus Call of Duty 4 und vollkommen neue, exklusive Eins�tze"

				+ "Die Neuerfindung des Multiplayers"
				+ "Modern Warfare 2 legt die Messlatte f�r Online-Multiplayer-Erfahrungen noch h�her und bietet neue F�higkeiten, Anpassungsm�glichkeiten und Modi, z. B.:"
				+ "Anpassungsf�hige Killstreaks:"

				+ "    AC130" + "    Sentry Gun" + "    Ferngesteuerte Drohnen" + "    Versorgungspakete"

				+ "Auszeichnungen (Einsatzreporte)" + "Create-a-Class beinhaltet:" + "1. Erg�nzende Waffen"

				+ "    Maschinenpistolen" + "    Schrotflinten" + "    Handfeuerwaffen" + "    Raketenwerfer"

				+ "2. Taktische Einsatzschilder" + "3. Equipment"

				+ "    Wurfmesser" + "    Energieschilder" + "    Taktische Landungen"

				+ "4. Perk-Upgrades" + "5. Bling (zweifache Ausr�stungsoption)"

				+ "�ber den Entwickler: Infinity Ward"
				+ "Infinity Ward, Inc. ist ein US-amerikanischer Spieleentwickler. Das Unternehmen wurde im August 2001 von 22 ehemaligen Entwicklern des Spiels Medal of Honor Allied Assault gegr�ndet. "
				+ "Die erste Ver�ffentlichung von Infinity Ward war Call of Duty, das zahlreiche Auszeichnungen als bestes Spiel gewann und neue Ma�st�be f�r zuk�nftige First Person Action Games setzte.";
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

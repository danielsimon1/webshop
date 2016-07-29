#Webshop

Achtung: Die Anwendung ist nur unter einem Windows-Betriebssystem lauffähig!

## Vorbereitungen

###Datenbank

Zuerst muss die HSQL-Datenbank eingerichtet werden.

Diese steht [hier](https://sourceforge.net/projects/hsqldb/files/) zum Download bereit.

Des Weiteren wird die aktuelleste Java-Version benötigt.

Entpacken und öffnen Sie nun den heruntergeladenen Ordner und navigieren Sie zu `hsqldb-[version]/hsqldb/bin` und führen Sie `runManagerSwing.bat` aus.
Es öffnet sich ein Fenster, um eine Verbindung mit einer Datenbank herzustellen.

1. Wählen Sie unter `Setting Name` einen beliebigen Namen
2. Wählen Sie unter `type` den Typen `HSQL Database Engine Standalone`
3. Geben Sie unter `path` den Pfad zum Server-Ordner der Anwendung an. Beispiel: `jdbc:hsqldb:file:D:\users\enes\Documents\webshop\Server`
4. Ändern Sie nichts an den übrigen Einstellungen
5. Bestätigen Sie Ihre Eingaben mit einem Klick auf `Ok`
6. Schließen Sie nun den HSQL Database Manager, um dem Server den Zugriff auf die Datenbank zu ermöglichen.
7. Führen Sie die Datei `dbsetup.jar` im Ordner `Server` aus. Klicken Sie auf `Connect to DB`, anschließend auf `Tabellen resetten` und auf `Testdaten einfügen`.
8. Schließen Sie das Fenster.

###Server
Öffnen Sie die Datei `serverjar.jar` im Ordner `Server` und klicken Sie bei dem sich öffnenden Fenster den Knopf `Server starten`. Nun läuft der Server auf dem localhost mit dem Port 8080.

###Web-Anwendung
Da der Zugriff auf einen anderen Server als der eigene von Browsern standardmäßig blockiert wird (same origin policy), muss diese Sicherheitseinstellung übergangen werden. Auf dem Google Chrome funktioniert das folgendermaßen:

1. Erstellen Sie eine neue Verknüpfung für Google Chrome und wählen Sie einen aussagekräftigen Namen (z.B. `Google Chrome disabled web security`).
2. Öffnen Sie die Eigenschaften der neuen Verknüpfung und fügen Sie bei `Ziel` am Ende ein Leerzeichen und dann  `--disable-web-security --user-data-dir` ein.<br>
Dieses kann dann beispielsweise so aussehen: `D:\Users\enes\AppData\Local\Google\Chrome\Application --disable-web-security --user-data-dir`

Bitte beachten Sie: Diese Einstellungen sollten nicht beim Surfen verwendet werden, da sie ein Sicherheitsrisiko darstellen!

Die Anwendung ist auf allen gängigen Browsern lauffähig, wenn die same origin policy deaktiviert wurde.

## Anwendung starten
Stellen Sie sicher, dass der Server läuft.

Starten Sie dann den Browser mit ausgeschalteter same origin policy. Navigieren Sie im Windows Explorer zum Speicherort der Anwendung und öffnen Sie im `dist/` Ordner die Datei `index.html`.

Testen Sie die Anwendung, indem Sie auf das Bild von Modern Warfare 2 klicken. Es sollte sich eine Seite mit den Details zum Spiel öffnen. Dann sind die Anwendung und die Datenbank ordnungsgemäß verbunden.
## Benutzung
Die Testdaten enthalten ein Spiel mit der ID 0 und einen User mit Admin-Rechten mit dem Benutzernamen `Matthias` und dem Passwort `secret`.

##Struktur
Der Java-Quellcode des Servers sowie die kompilierten JAR-Dateien befinden sich im `Server`-Ordner.

Die einzelnen HTML-, JavaScript- und CSS-Dateien sowie Bilder befinden sich im `src`-Ordner. Diese wurde zusammengefügt und mit den verwendeten 3rd party libraries zu einer lauffähigen Anwendung kombiniert. Diese befindet sich im `dist`-Ordner.

## Funktionen
* User-Registration (Alle)
* User-Login (User, Admin)
* User-Logout (User, Admin)
* User-Verwaltung(Admin)
* Artikel anlegen (Admin)
* Artikel ansehen (Alle)
* Bewertungen ansehen (Alle)
* Rezension schreiben (User, Admin)
* Artikel in den Warenkorb legen (Alle)
* Bestellung absenden (User, Admin)
* Bestellungen einsehen (User, Admin)

### Entwickler:

Daniel Simon, Matthias Müller, Enes Orhan
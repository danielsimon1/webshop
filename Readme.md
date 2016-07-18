#Webshop

Achtung: Die Anwendung ist nur unter einem Windows-Betriebssystem lauffähig!

## Vorbereitungen

###Datenbank

Zuerst muss die Datenbank eingerichtet werden.

Diese steht [hier](https://sourceforge.net/projects/hsqldb/files/) zum Download bereit.

Entpacken und öffnen Sie nun den heruntergeladenen Ordner und navigieren Sie zu `hsqldb-[version]/hsqldb/bin` und führen Sie `runManagerSwing.bat` aus.
Es öffnet sich ein Fenster, um eine Verbindung mit einer Datenbank herzustellen.

1. Wählen Sie unter `Setting Name` einen beliebigen Namen
2. Wählen Sie unter `type` den Typen `HSQL Database Engine Standalone`
3. Geben Sie unter `path` den Pfad zum Server-Ordner der Anwendung an. Beispiel: `jdbc:hsqldb:file:D:\users\enes\Documents\webshop\Server`
4. Ändern Sie nichts an den übrigen Einstellungen
5. Bestätigen Sie Ihre Eingaben mit einem Klick auf `Ok`

Wurden alle Einstellungen richtig vorgenommen, erscheinen nun links im HSQL Database Manager die einzelnen Tabellen der Datenbank.

###Server
Schließen Sie nun den HSQL Database Manager, um dem Server den Zugriff auf die Datenbank zu ermöglichen.

Öffnen Sie die JAR-Datei und klicken Sie bei dem sich öffnenden Fenster den Knopf `Server starten`. Nun läuft der Server auf dem localhost mit dem Port 8080.

###Web-Anwendung
Da der Zugriff auf einen anderen Server als der eigene von Browsern standardmäßig blockiert wird (same origin policy), muss diese Sicherheitseinstellung übergangen werden. Auf dem Google Chrome funktioniert das folgendermaßen:

1. Erstellen Sie eine neue Verknüpfung für Google Chrome und wählen Sie einen aussagekräftigen Namen (z.B. `Google Chrome disabled web security`).
2. Öffnen Sie die Eigenschaften der neuen Verknüpfung und fügen Sie bei `Ziel` am Ende ein Leerzeichen und dann  `--disable-web-security --user-data-dir` ein.<br>
Dieses kann dann beispielsweise so aussehen: `D:\Users\enes\AppData\Local\Google\Chrome\Application --disable-web-security --user-data-dir`

Bitte beachten Sie: Diese Einstellungen sollten nicht beim Surfen verwendet werden, da sie ein Sicherheitsrisiko darstellen!

## Anwendung starten
Starten Sie den Browser mit ausgeschalteter same origin policy. Navigieren Sie im Windows Explorer zum Speicherort der Anwendung und öffnen Sie im `dist/` Ordner die Datei `index.html`.

### Entwickler:

Daniel Simon, Matthias Müller

Others: Enes Orhan
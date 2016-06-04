package webshop.frame;

import java.awt.*;
import java.awt.event.*;
import java.io.IOException;

import javax.swing.*;

import webshop.db.Datenbank;
import webshop.rest.*;

public class ServerFrame extends JFrame {

	/**
	 * 
	 */
	private static final long serialVersionUID = -6315566547156813007L;

	private static Container c;
	private static JLabel text;
	private static JLabel statusDB;
	private static JLabel message;
	private static JButton serverButton;
	private static JButton resetTablesButton;
	private static JButton connectToDBButton;
	private static JButton closeConnectionTuDBButton;
	private static boolean serverStarted = false;
	private static boolean connectedToDB = false;

	public ServerFrame() {

		c = getContentPane();
		c.setLayout(new FlowLayout());

		text = new JLabel("Das hier ist der Server des Webshops.");
		c.add(text);

		serverButton = new JButton("Server starten");
		serverButton.setFont(new Font("Hallo", Font.ITALIC, 20));
		serverButton.addActionListener(new ActionListener() {

			@Override
			public void actionPerformed(ActionEvent e) {
				try {
					if (serverStarted == false) {
						Datenbank.connectToBD();
						RestServer.startServer();
						serverButton.setText("Server anhalten");
						serverStarted = true;
					} else {
						RestServer.stopServer();
						Datenbank.closeConnectionToDB();
						serverButton.setText("Server starten");
						serverStarted=false;
					}
				} catch (IllegalArgumentException | IOException e1) {
					e1.printStackTrace();
				}
			}
		});
		c.add(serverButton);

		resetTablesButton = new JButton("Tabellen reseten");
		resetTablesButton.setFont(new Font("Hallo", Font.ITALIC, 20));
		resetTablesButton.addActionListener(new ActionListener() {

			@Override
			public void actionPerformed(ActionEvent e) {
				try {
					if (connectedToDB == true) {
						Datenbank.resetTables();
						message.setText("Tabellen wurden erstellt");

					} else {
						message.setText("Bitte Verbindung mit Datenbank herstellen");
					}
				} catch (IllegalArgumentException e1) {
					e1.printStackTrace();
				}
			}
		});
		c.add(resetTablesButton);

		

		connectToDBButton = new JButton("mit Datenbank verbinden");
		connectToDBButton.setFont(new Font("Hallo", Font.ITALIC, 20));
		connectToDBButton.addActionListener(new ActionListener() {

			@Override
			public void actionPerformed(ActionEvent e) {
				try {
					if (!connectedToDB) {
						connectedToDB = Datenbank.connectToBD();
						message.setText("");
						if (connectedToDB) {
							statusDB.setText("Status Datenbank:  ist verbunden");
						} else {
							statusDB.setText("Status Datenbank:  es konnte nicht verbunden werden");
						}
					}
				} catch (IllegalArgumentException e1) {
					e1.printStackTrace();
				}
			}
		});
		c.add(connectToDBButton);

		closeConnectionTuDBButton = new JButton("Verbindung beenden");
		closeConnectionTuDBButton.setFont(new Font("Hallo", Font.ITALIC, 20));
		closeConnectionTuDBButton.addActionListener(new ActionListener() {

			@Override
			public void actionPerformed(ActionEvent e) {
				try {
					if (connectedToDB) {
						connectedToDB = Datenbank.closeConnectionToDB();

						if (!connectedToDB) {
							statusDB.setText("Status Datenbank: keine Verbindung");
						} else {
							statusDB.setText("Status Datenbank: Verbindung konnte nicht beendet werden");
						}
					}
				} catch (IllegalArgumentException e1) {
					e1.printStackTrace();
				}
			}
		});
		c.add(closeConnectionTuDBButton);

		statusDB = new JLabel("Status Datenbank: keine Verbindung");
		c.add(statusDB);

		message = new JLabel("");
		c.add(message);
	}

	public static void startFrame() {
		ServerFrame frame = new ServerFrame();
		frame.setTitle("Server Webshop");
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		frame.setLocation(1000, 50);
		frame.setSize(400, 900);
		frame.setVisible(true);
	}

}

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
	private static JLabel statusServer;
	private static JLabel message;
	private static JButton serverButton;
	private static boolean serverStarted = false;

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
						if (Datenbank.connectToBD()) {
							RestServer.startServer();
							serverButton.setText("Server anhalten");
							serverStarted = true;
							statusServer.setText("Server läuft");

						} else {
							statusServer.setText("Datenbankverbindung konnte nicht hergestellt werden");
						}

					} else {
						RestServer.stopServer();
						Datenbank.closeConnectionToDB();
						serverButton.setText("Server starten");
						serverStarted = false;
						statusServer.setText("Server läuft nicht");
					}
				} catch (IllegalArgumentException | IOException e1) {
					e1.printStackTrace();
				}
			}
		});
		c.add(serverButton);

		message = new JLabel("");
		c.add(message);

		statusServer = new JLabel("Server läuft nicht");
		c.add(statusServer);
	}

	public static void startFrame() {
		ServerFrame frame = new ServerFrame();
		frame.setTitle("Server Webshop");
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		frame.setLocation(1000, 50);
		frame.setSize(400, 900);
		frame.setVisible(true);
		frame.addWindowListener(new WindowListener() {

			@Override
			public void windowOpened(WindowEvent e) {
				// TODO Auto-generated method stub

			}

			@Override
			public void windowIconified(WindowEvent e) {
				// TODO Auto-generated method stub

			}

			@Override
			public void windowDeiconified(WindowEvent e) {
				// TODO Auto-generated method stub

			}

			@Override
			public void windowDeactivated(WindowEvent e) {
				// TODO Auto-generated method stub

			}

			@Override
			public void windowClosing(WindowEvent e) {
				Datenbank.closeConnectionToDB();
				RestServer.stopServer();


			}

			@Override
			public void windowClosed(WindowEvent e) {
				Datenbank.closeConnectionToDB();
				RestServer.stopServer();

			}

			@Override
			public void windowActivated(WindowEvent e) {

			}
		});
	}

}

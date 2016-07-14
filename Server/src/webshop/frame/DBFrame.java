package webshop.frame;

import java.awt.*;
import java.awt.event.*;
import java.io.IOException;

import javax.swing.*;

import webshop.db.Datenbank;
import webshop.rest.*;

public class DBFrame extends JFrame {

	/**
	 * 
	 */
	private static final long serialVersionUID = -6315566547156813007L;

	private static Container c;
	private static JLabel text;
	private static JLabel message;
	private static JButton resetTablesButton;

	public DBFrame() {

		c = getContentPane();
		c.setLayout(new FlowLayout());

		text = new JLabel("Das hier ist der Server des Webshops.");
		c.add(text);

		resetTablesButton = new JButton("Tabellen reseten");
		resetTablesButton.setFont(new Font("Hallo", Font.ITALIC, 20));
		resetTablesButton.addActionListener(new ActionListener() {

			@Override
			public void actionPerformed(ActionEvent e) {
				try {
					if(Datenbank.connectToBD()){
						Datenbank.resetTables();
						message.setText("Tabellen wurden resetet");
						
					}


				} catch (IllegalArgumentException e1) {
					e1.printStackTrace();
				}
			}
		});
		c.add(resetTablesButton);

		

		message = new JLabel("");
		c.add(message);
	}

	public static void startFrame() {
		DBFrame frame = new DBFrame();
		frame.setTitle("Server Webshop");
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		frame.setLocation(1000, 50);
		frame.setSize(400, 900);
		frame.setVisible(true);
	}

}

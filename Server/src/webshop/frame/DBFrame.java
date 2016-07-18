package webshop.frame;

import java.awt.*;
import java.awt.event.*;
import java.io.IOException;

import javax.swing.*;

import webshop.db.Datenbank;
import webshop.rest.*;
import webshop.test.TestObjekte;

public class DBFrame extends JFrame {

	/**
	 * 
	 */
	private static final long serialVersionUID = -6315566547156813007L;

	private static Container c;
	private static JLabel text;
	private static JLabel message;
	private static JButton connectToDBButton;
	private static JButton resetTablesButton;
	private static JButton insertTestDataButton;
	private static boolean connected = false;

	public DBFrame() {

		c = getContentPane();
		c.setLayout(new FlowLayout());

		text = new JLabel("Das hier ist der Server des Webshops.");
		c.add(text);

		connectToDBButton = new JButton("Connect to DB");
		connectToDBButton.setFont(new Font("Hallo", Font.ITALIC, 20));
		connectToDBButton.addActionListener(new ActionListener() {
			
			@Override
			public void actionPerformed(ActionEvent e) {
				if(!connected){
					Datenbank.connectToBD();
					connected = true;
				}
			}
		});
		c.add(connectToDBButton);
		
		
		resetTablesButton = new JButton("Tabellen reseten");
		resetTablesButton.setFont(new Font("Hallo", Font.ITALIC, 20));
		resetTablesButton.addActionListener(new ActionListener() {

			@Override
			public void actionPerformed(ActionEvent e) {
				try {
					if(connected){
						Datenbank.resetTables();
						message.setText("Tabellen wurden resetet");
						
					}


				} catch (IllegalArgumentException e1) {
					e1.printStackTrace();
				}
			}
		});
		c.add(resetTablesButton);

		insertTestDataButton = new JButton("Testdaten einfügen");
		insertTestDataButton.setFont(new Font("Hallo", Font.ITALIC, 20));
		insertTestDataButton.addActionListener(new ActionListener() {

			@Override
			public void actionPerformed(ActionEvent e) {
				try {
					if(connected){
						Datenbank.addArticle(TestObjekte.getTestArticle1());
					}


				} catch (IllegalArgumentException e1) {
					e1.printStackTrace();
				}
			}
		});
		c.add(insertTestDataButton);

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
				
			}
			
			@Override
			public void windowClosed(WindowEvent e) {
				Datenbank.closeConnectionToDB();
			}
			
			@Override
			public void windowActivated(WindowEvent e) {
				
			}
		});
	}

}

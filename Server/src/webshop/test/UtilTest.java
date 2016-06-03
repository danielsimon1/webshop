package webshop.test;

import static org.junit.Assert.*;

import org.junit.Test;

import webshop.util.Util;

public class UtilTest {
	@Test
	public void areTheLastWhitespacesDeleted(){
		assertTrue("Hallo".equals(Util.deleteLastWhitespaces("Hallo       ")));
	}
}

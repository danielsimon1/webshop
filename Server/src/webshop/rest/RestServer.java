package webshop.rest;

import java.io.IOException;


import com.sun.jersey.api.container.httpserver.HttpServerFactory;

import com.sun.net.httpserver.HttpServer;


@SuppressWarnings("restriction")
public class RestServer {
	static HttpServer server;

	public static void startServer() throws IllegalArgumentException, IOException {
		server = HttpServerFactory.create("http://localhost:8080/rest");
		server.start();
	}

	public static void stopServer() {
		server.stop(0);
		System.out.println("Server has been stopped.");
	}

}

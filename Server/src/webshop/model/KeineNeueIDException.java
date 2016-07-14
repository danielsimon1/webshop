package webshop.model;

public class KeineNeueIDException extends Exception {
	/**
	 * 
	 */
	private static final long serialVersionUID = 3888367938782064138L;

	public KeineNeueIDException(){
		super("Es konnte keine neue ID erstellt werden.");
	}
	
	public KeineNeueIDException(String message){
		super(message);
	}

}

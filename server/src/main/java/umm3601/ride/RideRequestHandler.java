package umm3601.ride;

import org.bson.Document;
import spark.Request;
import spark.Response;

public class RideRequestHandler {

  private final RideController rideController;

  public RideRequestHandler(RideController rideController) {
    this.rideController = rideController;
  }

  /**
   * Method called from Server when the 'api/rides' endpoint is received.
   * This handles the request received and the response that will be sent back.
   *
   * @param req the HTTP request
   * @param res the HTTP response
   * @return an array of rides in JSON formatted String
   */
  public String getRides(Request req, Response res) {
    res.type("application/json");
    return rideController.getRides();
  }

  public String addNewRide(Request req, Response res) {
    res.type("application/json");

    Document newRide = Document.parse(req.body());

    String driver = newRide.getString("driver");
    String notes = newRide.getString("notes");
    int seatsAvailable = newRide.getInteger("seatsAvailable");
    String origin = newRide.getString("origin");
    String destination = newRide.getString("destination");
    String departureTime = newRide.getString("departureTime");
    String departureDate = newRide.getString("departureDate");

    System.err.println("Adding new ride [driver=" + driver + ", notes=" + notes + " seatsAvailable=" + seatsAvailable
      + " origin=" + origin + " destination=" + destination + " departureTime=" + departureTime + " departureDate="
      + departureDate + ']');
    return rideController.addNewRide(driver, notes, seatsAvailable, origin, destination, departureTime, departureDate);
  }
}

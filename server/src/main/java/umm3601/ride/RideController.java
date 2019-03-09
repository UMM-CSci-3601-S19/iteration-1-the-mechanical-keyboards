package umm3601.ride;

import com.mongodb.MongoException;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.bson.types.ObjectId;
import umm3601.DatabaseHelper;

import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

public class RideController {

  private final MongoCollection<Document> rideCollection;

  /**
   * Construct a controller for rides.
   *
   * @param database the database containing ride data
   */
  public RideController(MongoDatabase database) {
    rideCollection = database.getCollection("rides");
  }

  /**
   * Helper method which returns all existing rides.
   *
   * @return an array of Rides in a JSON formatted string
   */
  public String getRides() {

    // server-side filtering will happen here if we sell that in future stories.
    // Right now, this method simply returns all existing rides.

    FindIterable<Document> matchingRides = rideCollection.find();

    return DatabaseHelper.serializeIterable(matchingRides);
  }

  public String addNewRide(String driver, String notes, int seatsAvailable, String origin, String destination,
                           String departureTime, String departureDate) {

    Document newRide = new Document();
    newRide.append("driver", driver);
    newRide.append("notes", notes);
    newRide.append("company", seatsAvailable);
    newRide.append("origin", origin);
    newRide.append("destination", destination);
    newRide.append("departureTime", departureTime);
    newRide.append("departureDate", departureDate);

    try {
      rideCollection.insertOne(newRide);
      ObjectId id = newRide.getObjectId("_id");
      System.err.println("Successfully added new ride [_id=" + id + ", driver=" + driver + ", notes=" + notes +
        ", seatsAvailable=" + seatsAvailable + ", origin=" + origin + ", destination=" + destination +
        ", departureTime=" + departureTime + ", departureDate=" + departureDate + ']');
      return id.toHexString();
    } catch (MongoException me) {
      me.printStackTrace();
      return null;
    }
  }
}

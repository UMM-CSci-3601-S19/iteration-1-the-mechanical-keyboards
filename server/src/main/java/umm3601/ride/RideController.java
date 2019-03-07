package umm3601.ride;

import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;

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

    return serializeIterable(matchingRides);
  }

  /**
   * Takes an iterable collection of documents, turn each into JSON string
   * using `document.toJson`, and then join those strings into a single
   * string representing an array of JSON objects.
   */
  private String serializeIterable(Iterable<Document> documents) {
    return StreamSupport.stream(documents.spliterator(), false)
      .map(Document::toJson)
      .collect(Collectors.joining(", ", "[", "]"));
  }
}

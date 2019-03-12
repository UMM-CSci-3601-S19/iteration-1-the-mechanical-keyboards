package umm3601.ride;

import com.mongodb.BasicDBObject;
import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.*;
import org.bson.types.ObjectId;
import org.junit.Before;
import org.junit.Test;
import umm3601.DatabaseHelper;
import umm3601.user.UserControllerSpec;

import java.util.*;
import java.util.stream.Collectors;

import static org.junit.Assert.*;
import static umm3601.DatabaseHelper.parseJsonArray;

public class RideControllerSpec {
  private RideController rideController;
  private ObjectId ellisRideId;

  @Before
  public void clearAndPopulateDB() {
    MongoClient mongoClient = new MongoClient();
    MongoDatabase db = mongoClient.getDatabase("test");
    MongoCollection<Document> rideDocuments = db.getCollection("rides");
    rideDocuments.drop();
    List<Document> testRides = new ArrayList<>();
    testRides.add(Document.parse("{\n" +
      "                    driver: \"Colt\",\n" +
      "                    seats_available: 3,\n" +
      "                    start_location: \"Morris Campus, Gay Hall\",\n" +
      "                    end_location: \"Twin Cities\"\n" +
      "                    departure_date: \"Wednesday the 15th of March\",\n" +
      "                    departure_time: \"5:00PM\",\n" +
      "                }"));
    testRides.add(Document.parse("{\n" +
      "                    driver: \"Avery\",\n" +
      "                    seats_available: 13,\n" +
      "                    start_location: \"534 e 5th St, Morris MN 56261\",\n" +
      "                    end_location: \"Culver's, Alexandria\"\n" +
      "                    departure_date: \"5/15/19\",\n" +
      "                    departure_time: \"3:30pm\",\n" +
      "                }"));
    testRides.add(Document.parse("{\n" +
      "                    driver: \"Michael\",\n" +
      "                    seats_available: 1,\n" +
      "                    start_location: \"On campus\",\n" +
      "                    end_location: \"Willies\"\n" +
      "                    departure_date: \"\",\n" +
      "                    departure_time: \"5pm\",\n" +
      "                }"));

    ellisRideId = new ObjectId();
    BasicDBObject ellisRide = new BasicDBObject("_id", ellisRideId);
    ellisRide = ellisRide.append("driver", "Ellis")
      .append("seats_available", 2)
      .append("start_location", "Casey's General Store")
      .append("end_location", "Perkin's")
      .append("departure_date", "March 17th")
      .append("departure_time", "");

    rideDocuments.insertMany(testRides);
    rideDocuments.insertOne(Document.parse(ellisRide.toJson()));

    rideController = new RideController(db);
  }

  private static String getDriver(BsonValue val) {
    BsonDocument ride = val.asDocument();
    return ((BsonString) ride.get("driver")).getValue();
  }

  @Test
  public void getAllRides() {
    Map<String, String[]> emptyMap = new HashMap<>();
    String jsonResult = rideController.getRides(emptyMap);
    BsonArray rides = parseJsonArray(jsonResult);

    assertEquals("Should be 4 rides", 4, rides.size());
    List<String> drivers = rides
      .stream()
      .map(RideControllerSpec::getDriver)
      .sorted()
      .collect(Collectors.toList());
    List<String> expectedDrivers = Arrays.asList("Avery", "Colt", "Ellis", "Michael");
    assertEquals("Drivers should match", expectedDrivers, drivers);
  }

  @Test
  public void addRide(){
    String newId = rideController.addNewRide("Dave Roberts", "I talk a lot about math", 2,
      "Shopko", "UMM Science Building Parking Lot", "5PM", "5/13/19");

    assertNotNull("Add new ride should return true when ride is added,", newId);
    Map<String, String[]> argMap = new HashMap<>();
    argMap.put("driver", new String[]{"Dave Roberts"});
    String jsonResult = rideController.getRides(argMap);
    BsonArray docs = parseJsonArray(jsonResult);

    List<String> driverName = docs
      .stream()
      .map(RideControllerSpec::getDriver)
      .sorted()
      .collect(Collectors.toList());
    assertEquals("Should return name of new driver", "Dave Roberts", driverName.get(2));
  }

  @Test
  public void getDriverByRideId() {
    String jsonResult = rideController.getRide(ellisRideId.toHexString());
    Document ellis = Document.parse(jsonResult);
    assertEquals("Name should match", "Ellis", ellis.get("driver"));
    String noJsonResult = rideController.getRide(new ObjectId().toString());
    assertNull("No driver name should match", noJsonResult);

  }
}

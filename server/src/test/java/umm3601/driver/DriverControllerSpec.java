package umm3601.driver;

import com.mongodb.BasicDBObject;
import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.*;
import org.bson.codecs.*;
import org.bson.codecs.configuration.CodecRegistries;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.json.JsonReader;
import org.bson.types.ObjectId;
import org.junit.Before;
import org.junit.Test;

import java.util.*;
import java.util.stream.Collectors;

import static org.junit.Assert.*;

/**
 * JUnit tests for the DriverController.
 * <p>
 * Created by mcphee on 22/2/17.
 */
public class DriverControllerSpec {
  private DriverController driverController;
  private ObjectId jonsId;

  @Before
  public void clearAndPopulateDB() {
    MongoClient mongoClient = new MongoClient();
    MongoDatabase db = mongoClient.getDatabase("test");
    MongoCollection<Document> driverDocuments = db.getCollection("rides");
    driverDocuments.drop();
    List<Document> testDrivers = new ArrayList<>();
    testDrivers.add(Document.parse("{\n" +
      "                    driver: \"Nic McPhee\",\n" +
      "                    seat_num: 3,\n" +
      "                    start_location: \"Gay Hall\",\n" +
      "                    end_location: \"Willie\'s\"\n" +
      "                    departure_date: \"2019-03-21\",\n" +
      "                    departure_time: \"08:15:00\",\n" +
      "                }"));
    testDrivers.add(Document.parse("{\n" +
      "                    driver: \"Jon Rivers\",\n" +
      "                    seat_num: 1,\n" +
      "                    start_location: \"The Met Lounge\",\n" +
      "                    end_location: \"111 East 4th St.\"\n" +
      "                    departure_date: \"2019-05-25\",\n" +
      "                    departure_time: \"15:00:00\",\n" +
      "                }"));
    testDrivers.add(Document.parse("{\n" +
      "                    driver: \"Ruffus Clang\",\n" +
      "                    seat_num: 2,\n" +
      "                    start_location: \"222 West 5th St\",\n" +
      "                    end_location: \"Casey\'s\"\n" +
      "                    departure_date: \"2020-05-27\",\n" +
      "                    departure_time: \"19:30:00\",\n" +
      "                }"));

    jonsId = new ObjectId();
    BasicDBObject jon = new BasicDBObject("_id", jonsId);
    jon = jon.append("driver", "Jon")
      .append("seat_num", 3)
      .append("start_location", "Willie\'s")
      .append("end_location", "Old No 1")
      .append("departure_date", "2019-05-05")
      .append("departure_time", "20:00:00");


    driverDocuments.insertMany(testDrivers);
    driverDocuments.insertOne(Document.parse(jon.toJson()));

    // It might be important to construct this _after_ the DB is set up
    // in case there are bits in the constructor that care about the state
    // of the database.
    driverController = new DriverController(db);
  }

  // http://stackoverflow.com/questions/34436952/json-parse-equivalent-in-mongo-driver-3-x-for-java
  private BsonArray parseJsonArray(String json) {
    final CodecRegistry codecRegistry
      = CodecRegistries.fromProviders(Arrays.asList(
      new ValueCodecProvider(),
      new BsonValueCodecProvider(),
      new DocumentCodecProvider()));

    JsonReader reader = new JsonReader(json);
    BsonArrayCodec arrayReader = new BsonArrayCodec(codecRegistry);

    return arrayReader.decode(reader, DecoderContext.builder().build());
  }

  private static String getDriver(BsonValue val) {
    BsonDocument doc = val.asDocument();
    return ((BsonString) doc.get("driver")).getValue();
  }

  @Test
  public void getAllDrivers() {
    Map<String, String[]> emptyMap = new HashMap<>();
    String jsonResult = driverController.getDrivers(emptyMap);
    BsonArray docs = parseJsonArray(jsonResult);

    assertEquals("Should be 4 drivers", 4, docs.size());
    List<String> driver_names = docs
      .stream()
      .map(DriverControllerSpec::getDriver)
      .sorted()
      .collect(Collectors.toList());
    List<String> expectedNames = Arrays.asList("Nic McPhee", "Jon Rivers", "Ruffus Clang", "Jon");
    assertEquals("Names should match", expectedNames, driver_names);
  }

  @Test
  public void getDriversWhoHave3Seats() {
    Map<String, String[]> argMap = new HashMap<>();
    argMap.put("seat_num", new String[]{"3"});
    String jsonResult = driverController.getDrivers(argMap);
    BsonArray docs = parseJsonArray(jsonResult);

    assertEquals("Should be 1 driver", 2, docs.size());
    List<String> driver_names = docs
      .stream()
      .map(DriverControllerSpec::getDriver)
      .sorted()
      .collect(Collectors.toList());
    List<String> expectedNames = Arrays.asList("Nic McPhee, Jon");
    assertEquals("Names should match", expectedNames, driver_names);
  }

  @Test
  public void getJonById() {
    String jsonResult = driverController.getDriver(jonsId.toHexString());
    Document jon = Document.parse(jsonResult);
    assertEquals("Driver name should match", "Jon", jon.get("driver"));
    String noJsonResult = driverController.getDriver(new ObjectId().toString());
    assertNull("No driver name should match", noJsonResult);

  }

  @Test
  public void addDriverTest() {
    String newId = driverController.addNewDriver("Bing Man", 2, "Common Cup", "Old No 1", "2020-02-03", "14:13:55");

    assertNotNull("Add new driver should return true when driver is added,", newId);
    Map<String, String[]> argMap = new HashMap<>();
    argMap.put("start_location", new String[]{"Common Cup"});
    String jsonResult = driverController.getDrivers(argMap);
    BsonArray docs = parseJsonArray(jsonResult);

    List<String> driver_name = docs
      .stream()
      .map(DriverControllerSpec::getDriver)
      .sorted()
      .collect(Collectors.toList());
    assertEquals("Should return driver name of new driver", "Bing Man", driver_name.get(0));
  }

  @Test
  public void getDriverByStartLocation() {
    Map<String, String[]> argMap = new HashMap<>();
    //Mongo in DriverController is doing a regex search so can just take a Java Reg. Expression
    //This will search the company starting with an I or an F
    argMap.put("start_location", new String[]{"[W,G]"});
    String jsonResult = driverController.getDrivers(argMap);
    BsonArray docs = parseJsonArray(jsonResult);
    assertEquals("Should be 3 drivers", 2, docs.size());
    List<String> driver_name = docs
      .stream()
      .map(DriverControllerSpec::getDriver)
      .sorted()
      .collect(Collectors.toList());
    List<String> expectedName = Arrays.asList("Nic McPhee", "Jon");
    assertEquals("Driver names should match", expectedName, driver_name);

  }


}

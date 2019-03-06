package umm3601.ride;

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
 * JUnit tests for the RiderController.
 * <p>
 * Created by mcphee on 22/2/17.
 */
public class RideControllerSpec {
  private RideController rideController;
  private ObjectId samsId;

  @Before
  public void clearAndPopulateDB() {
    MongoClient mongoClient = new MongoClient();
    MongoDatabase db = mongoClient.getDatabase("test");
    MongoCollection<Document> riderDocuments = db.getCollection("rides");
    riderDocuments.drop();
    List<Document> testRiders = new ArrayList<>();
    testRiders.add(Document.parse("{\n" +
      "                    driver: \"Nic McPhee\",\n" +
      "                    seat_num: 3,\n" +
      "                    start_location: \"Gay Hall\",\n" +
      "                    end_location: \"Willie's\"\n" +
      "                    departure_date: \"\"\n" +
      "                    departure_time: \"chris@this.that\"\n" +
      "                }"));
    testRiders.add(Document.parse("{\n" +
      "                    name: \"Pat\",\n" +
      "                    age: 37,\n" +
      "                    company: \"IBM\",\n" +
      "                    email: \"pat@something.com\"\n" +
      "                }"));
    testRiders.add(Document.parse("{\n" +
      "                    name: \"Jamie\",\n" +
      "                    age: 37,\n" +
      "                    company: \"Frogs, Inc.\",\n" +
      "                    email: \"jamie@frogs.com\"\n" +
      "                }"));

    samsId = new ObjectId();
    BasicDBObject sam = new BasicDBObject("_id", samsId);
    sam = sam.append("name", "Sam")
      .append("age", 45)
      .append("company", "Frogs, Inc.")
      .append("email", "sam@frogs.com");


    riderDocuments.insertMany(testRiders);
    riderDocuments.insertOne(Document.parse(sam.toJson()));

    // It might be important to construct this _after_ the DB is set up
    // in case there are bits in the constructor that care about the state
    // of the database.
    riderController = new RiderController(db);
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

  private static String getName(BsonValue val) {
    BsonDocument doc = val.asDocument();
    return ((BsonString) doc.get("name")).getValue();
  }

  @Test
  public void getAllRiders() {
    Map<String, String[]> emptyMap = new HashMap<>();
    String jsonResult = riderController.getRiders(emptyMap);
    BsonArray docs = parseJsonArray(jsonResult);

    assertEquals("Should be 4 riders", 4, docs.size());
    List<String> names = docs
      .stream()
      .map(RiderControllerSpec::getName)
      .sorted()
      .collect(Collectors.toList());
    List<String> expectedNames = Arrays.asList("Chris", "Jamie", "Pat", "Sam");
    assertEquals("Names should match", expectedNames, names);
  }

  @Test
  public void getRidersWhoAre37() {
    Map<String, String[]> argMap = new HashMap<>();
    argMap.put("age", new String[]{"37"});
    String jsonResult = riderController.getRiders(argMap);
    BsonArray docs = parseJsonArray(jsonResult);

    assertEquals("Should be 2 riders", 2, docs.size());
    List<String> names = docs
      .stream()
      .map(RiderControllerSpec::getName)
      .sorted()
      .collect(Collectors.toList());
    List<String> expectedNames = Arrays.asList("Jamie", "Pat");
    assertEquals("Names should match", expectedNames, names);
  }

  @Test
  public void getSamById() {
    String jsonResult = riderController.getRider(samsId.toHexString());
    Document sam = Document.parse(jsonResult);
    assertEquals("Name should match", "Sam", sam.get("name"));
    String noJsonResult = riderController.getRider(new ObjectId().toString());
    assertNull("No name should match", noJsonResult);

  }

  @Test
  public void addRiderTest() {
    String newId = riderController.addNewRider("Brian", 22, "umm", "brian@yahoo.com");

    assertNotNull("Add new rider should return true when rider is added,", newId);
    Map<String, String[]> argMap = new HashMap<>();
    argMap.put("age", new String[]{"22"});
    String jsonResult = riderController.getRiders(argMap);
    BsonArray docs = parseJsonArray(jsonResult);

    List<String> name = docs
      .stream()
      .map(RiderControllerSpec::getName)
      .sorted()
      .collect(Collectors.toList());
    assertEquals("Should return name of new rider", "Brian", name.get(0));
  }

  @Test
  public void getRiderByCompany() {
    Map<String, String[]> argMap = new HashMap<>();
    //Mongo in RiderController is doing a regex search so can just take a Java Reg. Expression
    //This will search the company starting with an I or an F
    argMap.put("company", new String[]{"[I,F]"});
    String jsonResult = riderController.getRiders(argMap);
    BsonArray docs = parseJsonArray(jsonResult);
    assertEquals("Should be 3 riders", 3, docs.size());
    List<String> name = docs
      .stream()
      .map(RiderControllerSpec::getName)
      .sorted()
      .collect(Collectors.toList());
    List<String> expectedName = Arrays.asList("Jamie", "Pat", "Sam");
    assertEquals("Names should match", expectedName, name);

  }


}

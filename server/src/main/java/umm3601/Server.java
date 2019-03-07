package umm3601;

import com.mongodb.MongoClient;
import com.mongodb.client.MongoDatabase;
import spark.Request;
import spark.Response;
import umm3601.ride.RideController;
import umm3601.ride.RideRequestHandler;
import umm3601.user.UserController;
import umm3601.user.UserRequestHandler;

import static spark.Spark.*;
import static spark.debug.DebugScreen.enableDebugScreen;

public class Server {
  private static final String databaseName = "dev";
  private static final int serverPort = 4567;

  public static void main(String[] args) {

    configureSpark();

    // DATABASE
    MongoClient mongoClient = new MongoClient();
    MongoDatabase database = mongoClient.getDatabase(databaseName);

    // CONTROLLERS & REQUEST HANDLERS
    UserController userController = new UserController(database);
    UserRequestHandler userRequestHandler = new UserRequestHandler(userController);
    RideController rideController = new RideController(database);
    RideRequestHandler rideRequestHandler = new RideRequestHandler(rideController);

    // Redirects for the home page
    redirect.get("", "/");
    redirect.get("/", "http://localhost:9000");

    // USER ENDPOINTS
    get("api/users", userRequestHandler::getUsers);
    get("api/users/:id", userRequestHandler::getUserJSON);
    post("api/users/new", userRequestHandler::addNewUser);

    // RIDE ENDPOINTS
    get("api/rides", rideRequestHandler::getRides);
  }

  // Enable GZIP for all responses
  private static void addGzipHeader(Request request, Response response) {
    response.header("Content-Encoding", "gzip");
  }

  private static void configureSpark() {

    port(serverPort);
    enableDebugScreen();

    // Specify where assets like images will be "stored"
    staticFiles.location("/public");

    options("/*", (request, response) -> {

      String accessControlRequestHeaders = request.headers("Access-Control-Request-Headers");
      if (accessControlRequestHeaders != null) {
        response.header("Access-Control-Allow-Headers", accessControlRequestHeaders);
      }

      String accessControlRequestMethod = request.headers("Access-Control-Request-Method");
      if (accessControlRequestMethod != null) {
        response.header("Access-Control-Allow-Methods", accessControlRequestMethod);
      }

      return "OK";
    });

    before((request, response) -> response.header("Access-Control-Allow-Origin", "*"));

    // Called after each request to insert the GZIP header into the response.
    // This causes the response to be compressed _if_ the client specified
    // in their request that they can accept compressed responses.
    // There's a similar "before" method that can be used to modify requests
    // before they they're processed by things like `get`.
    after("*", Server::addGzipHeader);

    // Handle "404" file not found requests:
    notFound((req, res) -> {
      res.type("text");
      res.status(404);
      return "Sorry, we couldn't find that!";
    });
  }
}

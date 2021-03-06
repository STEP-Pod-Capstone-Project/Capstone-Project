package com.google.sps.servlets;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import com.google.sps.data.VolumeData;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import static org.mockito.Mockito.when;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

public class SearchServletTest {

  @Mock
  HttpServletRequest request;

  @Mock
  HttpServletResponse response;

  private SearchServlet searchServlet;
  private String jsonResponse;
  private static final String ARTIFICIAL_BOOK_1 = "{\"id\":\"ABCD\",\"volumeInfo\":{\"title\":\""
      + "BookTitle1\",\"authors\":[],\"description\":\"Book 1 description\",\"averageRating\":2,\""
      + "imageLinks\":{\"thumbnail\":\"Book1Link\", \"extraLarge\":\"Book1ExtraLarge\"},"
      + "\"canonicalVolumeLink\":\"canonical volume link 1\"},\"accessInfo\":{\"webReaderLink\":"
      + "\"webreader 1 link\"}}";
  private static final String ARTIFICIAL_BOOK_2 = "{\"id\":\"EFGH\",\"volumeInfo\":{\"title\":\""
      + "BookTitle2\",\"authors\":[\"Thomas\",\"Robert\"],\"description\":\"Book 2 description\",\""
      + "averageRating\":4.5,\"imageLinks\":{\"thumbnail\":\"Book2Link\"},\"canonicalVolumeLink\":\""
      + "canonical volume link 2\"},\"accessInfo\":{\"webReaderLink\":\"webreader 2 link\"}}";
  private static final String ARTIFICIAL_BOOK_3 = "{\"id\":\"IJKL\",\"volumeInfo\":{\"title\":\""
      + "BookTitle3\",\"authors\":[\"John\"],\"description\":\"Book 3 description\",\"averageRating\""
      + ":3.5,\"imageLinks\":{\"thumbnail\":\"Book3Link\"},\"canonicalVolumeLink\":\""
      + "canonical volume link 3\"},\"accessInfo\":{\"webReaderLink\":\"webreader 3 link\"}}";
  private static final String ARTIFICIAL_JSON_RESPONSE = String.format("{\"items\":[%s,%s,%s]}", ARTIFICIAL_BOOK_1,
      ARTIFICIAL_BOOK_2, ARTIFICIAL_BOOK_3);

  @Before
  public void setup() {
    searchServlet = new SearchServlet();
    MockitoAnnotations.initMocks(this);
    jsonResponse = servletSearchByQuery(0);
  }

  public String servletSearchByQuery(int numResults) {
    when(request.getParameter("searchTerm")).thenReturn("Lord of the Flies");

    if (numResults > 0) {
      when(request.getParameter("maxResults")).thenReturn(Integer.toString(numResults));
    }

    return performDoGet(request);
  }

  public String servletSearchById() {
    when(request.getParameter("gbookId")).thenReturn("5QRZ4z6A1WwC");

    return performDoGet(request);
  }

  public String servletInvalidSearch() {
    // Pass gbookId and searchTerm which should not be a valid API call
    Map<String, String[]> parameters = new HashMap<>();
    parameters.put("searchTerm", new String[] { "Lord of the Flies" });
    parameters.put("gbookId", new String[] { "5QRZ4z6A1WwC" });
    when(request.getParameterMap()).thenReturn(parameters);
    when(request.getParameter("searchTerm")).thenReturn(parameters.get("searchTerm")[0]);
    when(request.getParameter("gbookId")).thenReturn(parameters.get("searchTerm")[0]);

    return performDoGet(request);
  }

  public String performDoGet(HttpServletRequest request) {
    StringWriter sw = new StringWriter();
    PrintWriter pw = new PrintWriter(sw);

    String result = "";
    try {
      when(response.getWriter()).thenReturn(pw);
      searchServlet.doGet(request, response);
      result = sw.getBuffer().toString().trim();
    } catch (IOException e) {
      e.printStackTrace();
    }

    return result;
  }

  /**
   * Checks whether all fields in VolumeData are their default values. If there
   * are any default values, return false.
   * 
   * @param book the VolumeData object
   * @return false if any default values
   */
  public boolean checkPopulatedVolumeDataObject(VolumeData book) {
    return book.getID() != null && book.getTitle() != null && book.getAuthors() != null && book.getDescription() != null
        && book.getAvgRating() != 0 && book.getCanonicalVolumeLink() != null && book.getThumbnailLink() != null
        && book.getWebReaderLink() != null;
  }

  @Test
  public void ensureDefaultNumberOfBooksInResponse() {
    // Response should contain the number of default results, since there was no
    // parameter included

    JsonElement data = JsonParser.parseString(jsonResponse);
    JsonArray books = data.getAsJsonArray();
    int expectedResults = SearchServlet.DEFAULT_MAX_RESULTS;

    Assert.assertEquals(expectedResults, books.size());
  }

  @Test
  public void ensureCustomNumberOfBooksInResponse() {
    // Response should contain number of results in the query parameter

    int numResults = 10;
    String customJsonResponse = servletSearchByQuery(numResults);
    JsonElement data = JsonParser.parseString(customJsonResponse);
    JsonArray books = data.getAsJsonArray();
    int expectedResults = numResults;

    Assert.assertEquals(expectedResults, books.size());
  }

  @Test
  public void checkConvertResponseToVolumeDataGeneratesCorrectQuantityOfObjects() {
    Collection<VolumeData> books = SearchServlet.convertResponseToVolumeData(ARTIFICIAL_JSON_RESPONSE);
    int expectedBookQuantity = 3;

    Assert.assertEquals(expectedBookQuantity, books.size());
  }

  @Test
  public void checkConvertResponseToVolumeDataPopulatesObjects() {
    Collection<VolumeData> books = SearchServlet.convertResponseToVolumeData(ARTIFICIAL_JSON_RESPONSE);

    boolean allPopulated = books.stream().allMatch(book -> checkPopulatedVolumeDataObject(book));

    Assert.assertTrue(allPopulated);
  }

  @Test
  public void IndividualArtificialBookJsonIsProperlyConverted() {
    // Response should contain a single book since it is searching by id

    String customJsonResponse = servletSearchById();
    JsonElement data = JsonParser.parseString(customJsonResponse);
    JsonArray books = data.getAsJsonArray();
    int expectedNumberOfBooks = 1;

    Assert.assertEquals(expectedNumberOfBooks, books.size());
  }

  @Test
  public void checkIndividualBookJsonIsProperlyConverted() {
    JsonElement bookJson = JsonParser.parseString(ARTIFICIAL_BOOK_1);
    VolumeData volume = SearchServlet.individualBookToVolumeData(bookJson);

    Assert.assertTrue(checkPopulatedVolumeDataObject(volume));
  }

  @Test
  public void checkBookJsonPrioritizesLargestThumbnailSize() {
    JsonElement bookJson = JsonParser.parseString(ARTIFICIAL_BOOK_1);
    VolumeData volume = SearchServlet.individualBookToVolumeData(bookJson);
    String expectedThumbnailLink = "Book1ExtraLarge";

    Assert.assertEquals(expectedThumbnailLink, volume.getThumbnailLink());
  }

  @Test
  public void checkErrorCodeWhenIncorrectParametersSent() {
    String responseString = servletInvalidSearch();

    Assert.assertTrue(responseString.isEmpty());
  }
}
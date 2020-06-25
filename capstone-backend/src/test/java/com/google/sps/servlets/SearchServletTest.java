package com.google.sps.servlets;
 
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.sps.data.VolumeData;
import com.google.sps.servlets.SearchServlet;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.Collection;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.mock;
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
  private JsonParser parser = new JsonParser();
  private static final String artificialJsonResponse = "{\"items\": [{\"id\":\"ABCDEFG\",\"volumeInfo\":" +
    "{\"title\":\"BookTitle\",\"authors\":[\"Name1\",\"Name2\"],\"imageLinks\":{\"thumbnail\":" +
    "\"link\"}}},{\"id\":\"LMNOP\",\"volumeInfo\":{\"title\":\"BookTitle2\",\"authors\":" +
    "[\"Name1\"],\"imageLinks\":{\"thumbnail\":\"Book2Link\"}}},{\"id\":\"PQRST\",\"volumeInfo\":" +
    "{\"title\":\"BookTitle3\",\"authors\":[],\"imageLinks\":{\"thumbnail\":\"Book3Link\"}}}]}";

  @Before
  public void setup() {
    searchServlet = new SearchServlet();
    MockitoAnnotations.initMocks(this);
    jsonResponse = populateServletResponse(0);
  }

  public String populateServletResponse(int numResults) {
    when(request.getParameter("searchTerm")).thenReturn("Lord of the Flies");

    if(numResults > 0) {
      when(request.getParameter("maxResults")).thenReturn(Integer.toString(numResults));
    }
    
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

  @Test
  public void ensureJsonResponseIsInCorrectFormat() {
    // Response should be an array of JSON objects, in the form of:
    // [{book1Info}, {book2Info}...]
    
    Assert.assertEquals(jsonResponse.charAt(0), '[');
    Assert.assertEquals(jsonResponse.charAt(jsonResponse.length() - 1), ']');

    Assert.assertEquals(jsonResponse.charAt(1), '{');
    Assert.assertEquals(jsonResponse.charAt(jsonResponse.length() - 2), '}');
  }

  @Test
  public void ensureDefaultNumberOfBooksInResponse() {
    // Response should contain the number of default results, since there was no parameter included
    
    JsonElement data = parser.parse(jsonResponse);
    JsonArray books = data.getAsJsonArray();
    int expectedResults = SearchServlet.DEFAULT_MAX_RESULTS;

    Assert.assertEquals(expectedResults, books.size());
  }

  @Test
  public void ensureCustomNumberOfBooksInResponse() {
    // Response should contain number of results in the query parameter
    
    int numResults = 10;
    String customJsonResponse = populateServletResponse(numResults);
    JsonElement data = parser.parse(customJsonResponse);
    JsonArray books = data.getAsJsonArray();
    int expectedResults = numResults;

    Assert.assertEquals(expectedResults, books.size());
  }

  @Test
  public void checkConvertResponseToVolumeDataGeneratesCorrectQuantityOfObjects() {
    Collection<VolumeData> books = SearchServlet.convertResponseToVolumeData(artificialJsonResponse);
    int expectedBookQuantity = 3;

    Assert.assertEquals(expectedBookQuantity, books.size());
  }

  @Test
  public void checkConvertResponseToVolumeDataPopulatesObjects() {
    Collection<VolumeData> books = SearchServlet.convertResponseToVolumeData(artificialJsonResponse);
    
    boolean anyNotPopulated = books.stream()
      .anyMatch( book -> book.getID() != null ||
      book.getTitle() != null || 
      book.getAuthors() != null ||
      book.getDescription() != null ||
      book.getThumbnailLink() != null);

    Assert.assertTrue(anyNotPopulated);
  }
}
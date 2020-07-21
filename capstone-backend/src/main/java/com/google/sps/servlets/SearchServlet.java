// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps.servlets;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.sps.data.VolumeData;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.Reader;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Collection;
import java.util.stream.Collectors;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Servlet that returns search data from the Google Books API. */
@WebServlet("/api/search")
public class SearchServlet extends HttpServlet {

  public final static int DEFAULT_MAX_RESULTS = 5;

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
response.setHeader("Access-Control-Allow-Credentials", "true");
response.setHeader("Access-Control-Allow-Origin", "https://3000-bfda3bef-a7ee-4ff4-91c6-c56fa0a00eba.ws-us02.gitpod.io");
response.setHeader("Set-Cookie", "cross-site-cookie=name; SameSite=None; Secure");

    String fullOutput = "";
    String formattedURL = "";

    if (request.getParameter("gbookId") != null) {
      if (request.getParameterMap().size() > 1) {
        System.err.println("Error: No other parameter can be sent with a gbookId");
        response.sendError(HttpServletResponse.SC_BAD_REQUEST);
        return;
      }
      // make formatted url
      String gbookId = request.getParameter("gbookId");

      formattedURL = String.format("https://www.googleapis.com/books/v1/volumes/%s?country=US", gbookId);

    } else if (request.getParameter("searchTerm") != null || !request.getParameter("searchTerm").isEmpty()) {
      int parameterLength = request.getParameterMap().size();
      if ((parameterLength == 2 && request.getParameter("maxResults") == null) || parameterLength > 2) {
        System.err.println("Error: No other parameters must be sent with searchTerm other than maxResults");
        response.sendError(HttpServletResponse.SC_BAD_REQUEST);
        return;
      }
      String searchTerm = URLEncoder.encode(request.getParameter("searchTerm"), "UTF-8");
      // format url
      int maxResults = DEFAULT_MAX_RESULTS;
      String maxResultsParam = request.getParameter("maxResults");
      // If maxResultsParam represents a positive integer,
      // then replace maxResults with the new value
      if (maxResultsParam != null) {
        int parsedMaxResults = parseNaturalNumber(maxResultsParam);
        if (parsedMaxResults != -1) {
          maxResults = parsedMaxResults;
        }
      }
      formattedURL = String.format("https://www.googleapis.com/books/v1/volumes?q={%s}&maxResults=%d&country=US",
          searchTerm, maxResults);
    } else {
      System.err.println("Error: Invalid combination of parameters sent");
      response.sendError(HttpServletResponse.SC_BAD_REQUEST);
      return;
    }

    try {
      URL url = new URL(formattedURL);
      HttpURLConnection conn = (HttpURLConnection) url.openConnection();
      conn.setRequestMethod("GET");
      conn.setRequestProperty("Accept", "application/json");

      Reader streamReader = null;
      if (conn.getResponseCode() != 200) {
        streamReader = new InputStreamReader(conn.getErrorStream());
      } else {
        streamReader = new InputStreamReader(conn.getInputStream());
      }
      BufferedReader br = new BufferedReader(streamReader);

      fullOutput = br.lines().collect(Collectors.joining());

      if (conn.getResponseCode() != 200) {
        System.err.println(fullOutput);
        response.sendError(HttpServletResponse.SC_BAD_REQUEST);
        return;
      }

      conn.disconnect();
    } catch (Exception e) {
      e.printStackTrace();
      response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
      return;
    }

    response.setContentType("application/json;");

    Collection<VolumeData> volumes = new ArrayList<>();
    if (request.getParameter("gbookId") != null) {
      VolumeData bookObject = individualBookToVolumeData(JsonParser.parseString(fullOutput));
      if (bookObject != null) {
        volumes.add(bookObject);
      } else {
        response.sendError(HttpServletResponse.SC_NOT_FOUND);
        return;
      }
    } else if (request.getParameter("searchTerm") != null) {
      volumes.addAll(convertResponseToVolumeData(fullOutput));
      if (volumes.size() == 0) {
        response.sendError(HttpServletResponse.SC_NOT_FOUND);
        return;
      }
    }

    Gson gson = new GsonBuilder().disableHtmlEscaping().create();
    response.getWriter().println(gson.toJson(volumes));
  }

  /*
   * Takes in a response from the Google Books API and converts it to a Collection
   * of VolumeData objects.
   * 
   * @param output the response from the Books API
   * 
   * @return a Collection of the books from the API call, in VolumeData form
   */
  static Collection<VolumeData> convertResponseToVolumeData(String output) {
    ArrayList<VolumeData> volumes = new ArrayList<>();

    // Parse data into json object
    JsonElement data = JsonParser.parseString(output);
    JsonObject dataInfo = data.getAsJsonObject();

    // Get the items element from the output and convert it into the array of book
    // jsons
    JsonElement items = dataInfo.get("items");
    JsonArray itemsInfo = items.getAsJsonArray();

    for (JsonElement book : itemsInfo) {
      VolumeData bookObject = individualBookToVolumeData(book);
      if (bookObject != null) {
        volumes.add(individualBookToVolumeData(book));
      }
    }
    return volumes;
  }

  /*
   * Takes in an individual book response from the Google Books API and converts
   * it to a VolumeData object.
   * 
   * @param singleBook a single book from the Books API as a JsonElement
   * 
   * @return a singular object of the book from the API call
   */
  static VolumeData individualBookToVolumeData(JsonElement singleBook) {
    JsonObject bookInfo = singleBook.getAsJsonObject();
    String id = bookInfo.get("id").getAsString();

    // volumeInfo houses all of the information about the book itself: description,
    // authors, title
    JsonElement volumeInfo = bookInfo.get("volumeInfo");
    if (volumeInfo == null)
      return null;
    JsonObject volumeInfoObj = volumeInfo.getAsJsonObject();

    JsonElement titleElement = volumeInfoObj.get("title");
    String title = titleElement != null ? titleElement.getAsString() : "";
    if (title.isEmpty()) {
      return null;
    }

    // there may be any number of authors, not guaranteed to only have 1
    JsonElement authors = volumeInfoObj.get("authors");
    ArrayList<String> authorNames = new ArrayList<>();
    if (authors != null) {
      JsonArray authorsArray = authors.getAsJsonArray();
      for (JsonElement name : authorsArray) {
        authorNames.add(name.getAsString());
      }
    }

    JsonElement descElement = volumeInfoObj.get("description");
    String description = descElement != null ? descElement.getAsString() : "";

    JsonElement avgRatingElement = volumeInfoObj.get("averageRating");
    double avgRating = avgRatingElement != null ? avgRatingElement.getAsDouble() : -1;

    JsonElement canonVolumeElement = volumeInfoObj.get("canonicalVolumeLink");
    String canonicalVolumeLink = canonVolumeElement != null ? canonVolumeElement.getAsString() : "";

    JsonElement thumbnailElement = volumeInfoObj.get("imageLinks");
    String thumbnailLink = thumbnailElement != null ? thumbnailElement.getAsJsonObject().get("thumbnail").getAsString()
        : "";
    thumbnailLink = thumbnailLink.replace("http", "https");

    JsonElement accessInfoElement = bookInfo.get("accessInfo");
    String webReaderLink = accessInfoElement != null
        ? accessInfoElement.getAsJsonObject().get("webReaderLink").getAsString()
        : "";

    return new VolumeData(id, title, authorNames.toArray(new String[0]), description, avgRating, canonicalVolumeLink,
        thumbnailLink, webReaderLink);
  }

  /*
   * Convert a string into an integer. If not a natural number, return -1 with an
   * error message.
   * 
   * @param stringNum A string that will be parsed into a natural number
   * 
   * @return The number as an int, -1 if input is invalid
   */
  private static int parseNaturalNumber(String stringNum) {
    int num = 0;

    try {
      num = Integer.parseInt(stringNum);
    } catch (NumberFormatException e) {
      System.err.println("Did not input a valid integer in String form." + e);
      return -1;
    }

    if (num < 0) {
      System.err.println("Incorrectly input a negative number, which is not a natural number.");
      return -1;
    }

    return num;
  }
}
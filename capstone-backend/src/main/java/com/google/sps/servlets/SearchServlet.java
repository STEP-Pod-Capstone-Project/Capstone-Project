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
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Collection;
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

    response.setHeader("Access-Control-Allow-Methods", "GET");
    response.setHeader("Access-Control-Allow-Credentials", "true");
    response.setHeader("Access-Control-Allow-Origin",
        "https://3000-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io");

    String fullOutput = "";
    String searchTerm = request.getParameter("searchTerm");
    if (searchTerm == null || searchTerm.isEmpty())
      return;
    searchTerm = URLEncoder.encode(searchTerm, "UTF-8");

    int maxResults = 0;
    String maxResultsParam = request.getParameter("maxResults"); 
    if (maxResultsParam != null) { 
      maxResults = parseNaturalNumber(maxResultsParam);
    }
    if (maxResultsParam == null || maxResults == -1) {
      maxResults = DEFAULT_MAX_RESULTS;
    }

    try {
      String formattedURL = String.format("https://www.googleapis.com/books/v1/volumes?q={%s}&maxResults=%d&country=US",
          searchTerm, maxResults);
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

      String output;
      while ((output = br.readLine()) != null) {
        fullOutput += output;
      }

      if (conn.getResponseCode() != 200) {
        System.err.println(fullOutput);
        throw new RuntimeException("Failed : error code : " + conn.getResponseCode());
      }

      conn.disconnect();
    } catch (MalformedURLException e) {
      e.printStackTrace();
    } catch (IOException e) {
      e.printStackTrace();
    }

    response.setContentType("application/json;");
    Gson gson = new GsonBuilder().disableHtmlEscaping().create();

    response.getWriter().println(gson.toJson(convertResponseToVolumeData(fullOutput)));
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
      JsonObject bookInfo = book.getAsJsonObject();
      String id = bookInfo.get("id").getAsString();

      // volumeInfo houses all of the information about the book itself: description,
      // authors, title
      JsonElement volumeInfo = bookInfo.get("volumeInfo");
      if (volumeInfo == null)
        continue;
      JsonObject volumeInfoObj = volumeInfo.getAsJsonObject();

      JsonElement titleElement = volumeInfoObj.get("title");
      String title = titleElement != null ? titleElement.getAsString() : "";

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

      JsonElement thumbnailElement = volumeInfoObj.get("imageLinks");
      String thumbnailLink = thumbnailElement != null
          ? thumbnailElement.getAsJsonObject().get("thumbnail").getAsString()
          : "";
      thumbnailLink = thumbnailLink.replace("http", "https");

      volumes.add(new VolumeData(id, title, authorNames.toArray(new String[0]), description, thumbnailLink));
    }
    return volumes;
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
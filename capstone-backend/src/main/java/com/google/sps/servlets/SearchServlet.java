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

import com.google.common.annotations.VisibleForTesting;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.sps.data.VolumeData;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;
import java.util.Map;
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
    response = addHeadersToResponse(response);
    
    String fullOutput = "";
    String searchTerm = request.getParameter("searchTerm");
    int maxResults = parseNaturalNumber(request.getParameter("maxResults"));
    if (maxResults == -1) {
      maxResults = DEFAULT_MAX_RESULTS;
    }
    
    if (searchTerm == null || searchTerm.isEmpty()) return;
    searchTerm = URLEncoder.encode(searchTerm, "UTF-8");

    try {
      String formattedURL = String.format("https://www.googleapis.com/books/v1/volumes?q={%s}&maxResults=%d",
        searchTerm, maxResults);
		  URL url = new URL(formattedURL);
		  HttpURLConnection conn = (HttpURLConnection) url.openConnection();
		  conn.setRequestMethod("GET");
		  conn.setRequestProperty("Accept", "application/json");

      if (conn.getResponseCode() != 200) {
        throw new RuntimeException("Failed : error code : "
            + conn.getResponseCode());
      }
      BufferedReader br = new BufferedReader(new InputStreamReader(
        (conn.getInputStream())));
      
      String output;
      while ((output = br.readLine()) != null) {
        fullOutput += output;
      }
      conn.disconnect();
    } catch (MalformedURLException e) {
      e.printStackTrace();
    } catch (IOException e) {
      e.printStackTrace();
    }
    
    response.setContentType("text/json;");
    Gson gson = new GsonBuilder().disableHtmlEscaping().create();

    response.getWriter().println(gson.toJson(convertResponseToVolumeData(fullOutput)));
  }

  /*
   * Takes in a response from the Google Books API and converts it to a Collection of VolumeData objects.
   * @param output the response from the Books API
   * @return a Collection of the books from the API call, in VolumeData form
   */
  @VisibleForTesting
  static Collection<VolumeData> convertResponseToVolumeData(String output) {
    ArrayList<VolumeData> volumes = new ArrayList<>();

    // Parse data into json object
    JsonParser parser = new JsonParser();
    JsonElement data = parser.parse(output);
    JsonObject dataInfo = data.getAsJsonObject();

    // Get the items element from the output and convert it into the array of book jsons
    JsonElement items = dataInfo.get("items");
    JsonArray itemsInfo = items.getAsJsonArray();

    for (JsonElement book: itemsInfo) {
      JsonObject bookInfo = book.getAsJsonObject();
      String id = bookInfo.get("id").getAsString();

      // volumeInfo houses all of the information about the book itself: description, authors, title
      JsonElement volumeInfo = bookInfo.get("volumeInfo");
      if (volumeInfo == null) continue;
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
      String thumbnailLink = thumbnailElement != null ? thumbnailElement
                                                        .getAsJsonObject()
                                                        .get("thumbnail")
                                                        .getAsString()
                                                        : "";
      thumbnailLink = thumbnailLink.replace("http", "https");

      volumes.add(new VolumeData(id, title, authorNames.toArray(new String[0]), description, thumbnailLink));
    }
    return volumes;
  }

  /*
   * Adds headers to a HttpServletResponse object to enable it to be accessed by the frontend resources.
   */
  public static HttpServletResponse addHeadersToResponse(HttpServletResponse response) {
    response.setHeader("Access-Control-Allow-Methods", "GET");
    response.setHeader("Access-Control-Allow-Credentials", "true");
    response.setHeader("Access-Control-Allow-Origin", "https://3001-cs-60845877040-default.us-central1.cloudshell.dev");
    response.setHeader("Set-Cookie", "cross-site-cookie=name; SameSite=None; Secure");
    
    return response;
  }

  /*
   * Convert a string into an integer. If not a natural number,
   * return -1 with an error message.
   * @param stringNum A string that will be parsed into a natural number
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
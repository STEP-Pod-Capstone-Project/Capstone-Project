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
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;

/** Servlet that returns search data from the Google Books API. */
@WebServlet("/search")
public class SearchServlet extends HttpServlet {

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    response.setHeader("Access-Control-Allow-Methods", "GET");
    response.setHeader("Access-Control-Allow-Credentials", "true");
    response.setHeader("Access-Control-Allow-Origin", "https://3001-cs-60845877040-default.us-central1.cloudshell.dev");
    
    String fullOutput = "";
    String searchTerm = request.getParameter("searchTerm");
    if (searchTerm == null || searchTerm.isEmpty()) return;
    searchTerm = sanitizeQuery(searchTerm);

    try {
      String formattedURL = String.format("https://www.googleapis.com/books/v1/volumes?q={%s}",
        searchTerm);
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

    Map<String,Object> result = new Gson().fromJson(fullOutput, Map.class);
    
    response.setContentType("text/json;");
    response.getWriter().println(result.get("items"));
  }

  private static String sanitizeQuery(String query) {
    return query.replace(" ", "%20");
  }
}
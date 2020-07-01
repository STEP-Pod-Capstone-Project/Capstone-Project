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
import java.util.stream.Collectors;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Servlet that stores User's data from Frontend Authentication. */
@WebServlet("/api/user")
public class UserServlet extends HttpServlet {

  private JsonObject jsonGottenObject;

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {

    response.setHeader("Access-Control-Allow-Methods", "GET");
    response.setHeader("Access-Control-Allow-Credentials", "true");
    response.setHeader("Access-Control-Allow-Origin",
        "https://3000-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io");

    String jsonString = request.getReader().lines().collect(Collectors.joining());

    System.out.println(jsonString);

    System.out.println("\n\n\n\n\nEXPERIMENTAL START HERE\n\n\n\n\n\n\n\n\n");

    JsonObject json = JsonParser.parseString(jsonString).getAsJsonObject();

    System.out.println(json.toString());

    System.out.println("\n\n\n\n\nMOOOOOOORRRREEEEE EXPERIMENTAL START HERE\n\n\n\n\n\n\n\n\n");

    System.out.println(json.get("profileObj"));

    jsonGottenObject = json;

    response.sendRedirect("/");

  }

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {

    response.setHeader("Access-Control-Allow-Methods", "GET");
    response.setHeader("Access-Control-Allow-Credentials", "true");
    response.setHeader("Access-Control-Allow-Origin",
        "https://3000-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io");
    
    
    response.setContentType("application/json;");

    response.getWriter().println(jsonGottenObject);

    response.getWriter().println("\n\n\n\n" + jsonGottenObject.get("profileObj"));

    response.getWriter().println("\n\n\n\n" + jsonGottenObject.get("tokenObj"));



  }

  

}
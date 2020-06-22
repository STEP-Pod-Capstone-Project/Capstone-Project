package com.google.sps.servlets;

import com.google.gson.Gson;
import java.io.IOException;
import java.util.ArrayList;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

// @WebServlet("/testData")
@WebServlet("/api/testData")
public class UserServlet extends HttpServlet {

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {

    // response.setHeader("Access-Control-Allow-Methods", "GET");
    // response.setHeader("Access-Control-Allow-Credentials", "true");
    // response.setHeader("Access-Control-Allow-Origin", "https://3000-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io");

    ArrayList<String> testList = new ArrayList<String>();
    testList.add("Hello ");
    testList.add("this is a test ");
    testList.add("and now it is done.");

    Gson gson = new Gson();
    String json = gson.toJson(testList);

    response.setContentType("application/json;");
    response.getWriter().println(json);
  }
}
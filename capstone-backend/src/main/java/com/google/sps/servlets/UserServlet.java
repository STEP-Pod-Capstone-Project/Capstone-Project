package com.google.sps.servlets;

import com.google.gson.Gson;
import java.io.IOException;
import java.util.ArrayList;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** This Servlet deletes the stored the comments on the main page */
@WebServlet("/testData")
public class UserServlet extends HttpServlet {

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {

    response.sendRedirect("/");
  }

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {

    ArrayList<String> testList = new ArrayList<String>();
    testList.add("Hello");
    testList.add("this is a test");
    testList.add("done");

    Gson gson = new Gson();
    String json = gson.toJson(testList);

    response.setContentType("application/json;");
    response.getWriter().println(json);

  }
}
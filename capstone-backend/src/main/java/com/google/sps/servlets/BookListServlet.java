package com.google.sps.servlets;

import com.google.gson.Gson;
import com.google.sps.data.BookList;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/testBookList")
// @WebServlet("/api/testBookList")
public class BookListServlet extends HttpServlet {

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {


    response.setHeader("Access-Control-Allow-Methods", "POST");
    response.setHeader("Access-Control-Allow-Credentials", "true");
    response.setHeader("Access-Control-Allow-Origin", "https://3000-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io");
    
    System.out.println("----------------POST-----------------");
    System.out.println(request.getAttribute("bookshelfIDs"));
    System.out.println(request.getAttribute("usersIDs"));

  }

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {


    response.setHeader("Access-Control-Allow-Methods", "GET");
    response.setHeader("Access-Control-Allow-Credentials", "true");
    response.setHeader("Access-Control-Allow-Origin", "https://3000-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io");

    ArrayList<String> bookshelfIDs = new ArrayList<>(Arrays.asList("this", " is", " a", " test"));
    ArrayList<Long> usersIDs = new ArrayList<Long>();
    usersIDs.add((long)1);
    usersIDs.add((long)2);


    BookList testList = new BookList(bookshelfIDs, usersIDs);

    Gson gson = new Gson();
    String json = gson.toJson(testList);

    response.setContentType("application/json;");
    response.getWriter().println(json);
  }
}
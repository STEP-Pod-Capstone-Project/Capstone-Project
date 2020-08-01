package com.google.sps.servlets;

import com.google.api.client.auth.oauth2.BearerToken;
import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.auth.oauth2.TokenResponse;
import com.google.api.client.extensions.java6.auth.oauth2.AuthorizationCodeInstalledApp;
import com.google.api.client.extensions.jetty.auth.oauth2.LocalServerReceiver;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.client.util.DateTime;
import com.google.api.client.util.store.FileDataStoreFactory;
import com.google.api.core.ApiFuture;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.CalendarScopes;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.Events;
import com.google.api.services.calendar.model.EventAttendee;
import com.google.api.services.calendar.model.EventDateTime;
import com.google.api.services.calendar.model.EventReminder;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.FieldValue;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.Query;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.SetOptions;
import com.google.cloud.firestore.WriteResult;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.reflect.TypeToken;

import com.google.sps.data.Meeting;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.lang.reflect.Type;
import java.security.GeneralSecurityException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/api/meetings")
public class MeetingServlet extends HttpServlet {
  private Firestore db;
  private CollectionReference meetings;
  private Gson gson;

  public MeetingServlet() throws IOException {
    db = Utility.getFirestoreDb();
    meetings = db.collection("meetings");
    gson = new Gson();
  }

  public Credential createCredentialWithAccessTokenOnly(HttpTransport transport, JsonFactory jsonFactory,
      TokenResponse tokenResponse) {
    return new Credential(BearerToken.authorizationHeaderAccessMethod()).setFromTokenResponse(tokenResponse);
  }

  public Calendar createCalendar(JsonObject jsonObject) {
    TokenResponse token = new TokenResponse();
    JsonObject tokenJson = jsonObject.get("token").getAsJsonObject();
    token.setAccessToken(tokenJson.get("access_token").getAsString());
    token.setTokenType(tokenJson.get("token_type").getAsString());
    token.setScope(tokenJson.get("scope").getAsString());
    token.setExpiresInSeconds(tokenJson.get("expires_in").getAsLong());
    Credential credentials = createCredentialWithAccessTokenOnly(new NetHttpTransport(), new JacksonFactory(), token);
    Calendar service = new Calendar.Builder(new NetHttpTransport(), new JacksonFactory(), credentials)
        .setApplicationName("bookbook").build();
    return service;
  }



  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    List<Meeting> retrievedMeetings = Utility.get(meetings, request, response, new GenericClass(Meeting.class));
    if (retrievedMeetings != null) {
      response.setContentType("application/json;");
      response.getWriter().println(gson.toJson(retrievedMeetings));
    }
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    JsonObject jsonObject = Utility.createRequestBodyJson(request);
    List<String> requiredFields = new ArrayList<String>(Arrays.asList("clubID", "startDateTime", "endDateTime"));
    Meeting createdMeeting = (Meeting) Utility.postHelper(meetings, jsonObject, response, new GenericClass(Meeting.class),
        requiredFields);
    if (createdMeeting != null) {
      response.setContentType("application/json;");
      response.getWriter().println(gson.toJson(createdMeeting));
    }
    Calendar service = createCalendar(jsonObject);
    Set<String> keySet = jsonObject.keySet();
    Event event = new Event();
    if (keySet.contains("summary")) {
      event.setSummary(jsonObject.get("summary").getAsString());
    }
    if (keySet.contains("location")) {
      event.setLocation(jsonObject.get("location").getAsString());
    }
    if (keySet.contains("description")) {
      event.setDescription(jsonObject.get("description").getAsString());
    }
    if (keySet.contains("startDateTime")) {
      long startDateTime = jsonObject.get("startDateTime").getAsLong();
      DateTime dateTime = new DateTime(startDateTime);
      EventDateTime start = new EventDateTime().setDateTime(dateTime);
      event.setStart(start);
    }
    if (keySet.contains("endDateTime")) {
      long endDateTime = jsonObject.get("endDateTime").getAsLong();
      DateTime dateTime = new DateTime(endDateTime);
      EventDateTime end = new EventDateTime().setDateTime(dateTime);
      event.setEnd(end);
    }
    if (keySet.contains("attendeeEmails")) {
      JsonArray jsonArray = jsonObject.get("attendeeEmails").getAsJsonArray();
      Type listType = new TypeToken<List<String>>() {}.getType();
      List<String> attendeeEmails = gson.fromJson(jsonArray, listType);
      for (String e : attendeeEmails) System.out.println(e);
      event
          .setAttendees(attendeeEmails.stream().map(e -> new EventAttendee().setEmail(e)).collect(Collectors.toList()));
    }
    EventReminder[] reminderOverrides = new EventReminder[] {
        new EventReminder().setMethod("email").setMinutes(24 * 60),
        new EventReminder().setMethod("popup").setMinutes(10), };
    Event.Reminders reminders = new Event.Reminders().setUseDefault(false)
        .setOverrides(Arrays.asList(reminderOverrides));
    event.setReminders(reminders);
    Event.Organizer organizer = new Event.Organizer();
    if (keySet.contains("organizerEmail")) {
      organizer.setEmail(jsonObject.get("organizerEmail").getAsString());
    }
    event.setOrganizer(organizer);
    String calendarId = "primary";
    event = service.events().insert(calendarId, event).execute();
  }

  @Override
  public void doPut(HttpServletRequest request, HttpServletResponse response) throws IOException {
    Meeting updatedMeeting = (Meeting) Utility.put(meetings, request, response, new GenericClass(Meeting.class));
    if (updatedMeeting != null) {
      response.setContentType("application/json;");
      response.getWriter().println(gson.toJson(updatedMeeting));
    }
  }

  @Override
  public void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
    Utility.delete(meetings, request, response);
    JsonObject jsonObject = Utility.createRequestBodyJson(request);
    Calendar service = createCalendar(jsonObject);
    service.events().delete("primary", "eventId").execute();
  }
}

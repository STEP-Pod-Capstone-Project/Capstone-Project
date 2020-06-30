package com.google.sps.servlets;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;

import java.io.IOException;


public class FirestoreSetup {
  private Firestore db; 

  public FirestoreSetup() throws IOException {
    GoogleCredentials credentials = GoogleCredentials.getApplicationDefault();
    FirebaseOptions options = new FirebaseOptions.Builder()
        .setCredentials(credentials)
        .setProjectId("sopa-capstone-step-2020")
        .build();
    FirebaseApp.initializeApp(options);
    db = FirestoreClient.getFirestore();
  }

  public Firestore getFirestoreDb() {
    return db;
  }
}
package com.google.sps.servlets;

public class GenericClass<T> {

  private final Class<T> type;
  private String id;

  public GenericClass(Class<T> type) {
    this.type = type;
  }

  public Class<T> getMyType() {
   return this.type;
  }
}

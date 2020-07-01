package com.google.sps.servlets;

public class GenericClass<T> {

  private final Class<T> type;

  public GenericClass(Class<T> type) {
    this.type = type;
  }

  public Class<T> getMyType() {
   return this.type;
  }
}
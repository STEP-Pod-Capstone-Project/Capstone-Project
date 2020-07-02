package com.google.sps.data;

import java.util.ArrayList;
import java.util.Collection;

import com.google.appengine.repackaged.org.antlr.runtime.Token;

public final class User {

  private static class TokenObject {
    private String token_id;
    private String token_type;
    private String access_token;
    private String scope;
    private String idpId;

    private TokenObject(String token_id, String token_type, String access_token, String scope, String idpId) {
      this.token_id = token_id;
      this.token_type = token_type;
      this.access_token = access_token;
      this.scope = scope;
      this.idpId = idpId;
    }
  }

  public static TokenObject createTokenObject(String token_id, String token_type, String access_token, String scope,
      String idpId) {
    return new TokenObject(token_id, token_type, access_token, scope, idpId);
  }

  private final String id; // Google Id
  private final String email;
  private final String fullName;
  private final String profileImageUrl;
  private TokenObject tokenObj;
  private Collection<String> friendIDs;

  public User(String id, String email, String fullName, String profileImageUrl, TokenObject tokenObj,
      Collection<String> friendIDs) {
    this.id = id;
    this.email = email;
    this.fullName = fullName;
    this.profileImageUrl = profileImageUrl;
    this.tokenObj = tokenObj;
    this.friendIDs = friendIDs;
  }

  public User(String id, String email, String fullName, String profileImageUrl, TokenObject tokenObject) {
    this(id, email, fullName, profileImageUrl, tokenObject, new ArrayList<String>());
  }

  public String getID() {
    return id;
  }

  public String getEmail() {
    return email;
  }

  public String getfullName() {
    return fullName;
  }

  public String getProfileImageUrl() {
    return profileImageUrl;
  }

  public TokenObject getTokenObj() {
    return tokenObj;
  }

  public String getTokenId() {
    return tokenObj.token_id;
  }

  public String getTokenType() {
    return tokenObj.token_type;
  }

  public String getAccessToken() {
    return tokenObj.access_token;
  }

  public String getScope() {
    return tokenObj.scope;
  }

  public String getIdpId() {
    return tokenObj.idpId;
  }

  public Collection<String> getFriends() {
    return friendIDs;
  }

  public void addFriend(String friendID) {
    friendIDs.add(friendID);
  }

  public void clearFriends() {
    friendIDs.clear();
  }

}

package com.goomba.tikiaiapp.model;

import org.springframework.data.annotation.Id;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.mongodb.lang.NonNull;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class User {
    @Id
    private String userId;

    @NonNull
    @JsonProperty("name")
    private String name;

    @NonNull
    @JsonProperty("username")
    private String username;

    @NonNull
    @JsonProperty("password") 
    private String password;

    @NonNull
    @JsonProperty("gradeLevel") 
    private int gradeLevel;
    
    @NonNull
    @JsonProperty("age")
    private int age;
}

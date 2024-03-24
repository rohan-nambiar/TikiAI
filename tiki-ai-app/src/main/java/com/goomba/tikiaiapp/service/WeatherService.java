package com.goomba.tikiaiapp.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;

import org.json.JSONObject; 

@Service
public class WeatherService {
    
    // Inject the WeatherAPI base URL and API key from application.properties
    private String weatherApiUrl = "http://api.weatherapi.com/v1";

    private String apiKey = "f217128ef5a84ea6aae214503242303";

    public String getCurrentWeather(String location) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
    
        // Construct the full URL for the weather API call
        String fullUrl = String.format("%s/current.json?key=%s&q=%s", weatherApiUrl, apiKey, location);
        
        HttpEntity<String> entity = new HttpEntity<>(headers);
    
        ResponseEntity<String> response = restTemplate.exchange(fullUrl, HttpMethod.GET, entity, String.class);
    
        if(response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            JSONObject jsonResponse = new JSONObject(response.getBody());
            // Extract relevant weather information as needed. Example: Temperature
            double tempCelsius = jsonResponse.getJSONObject("current").getDouble("temp_c");
            
            // Return a simple JSON string with the location and temperature
            return String.format("{\"location\": \"%s\", \"temperature\": \"%s\"}", location, tempCelsius);
        } else {
            // Handle error or non-successful response
            return "{\"error\": \"Failed to get weather data\"}";
        }
    }
}

package com.goomba.tikiaiapp.service;

import java.util.Collections;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.goomba.tikiaiapp.model.YoutubePrompt;

import org.json.JSONObject; 
import java.time.LocalDate; // Import the LocalDate class
import java.time.format.DateTimeFormatter; // Import the DateTimeFormatter class




@Service
public class OpenAIService {
    
    private final String openAIUrl = "https://api.openai.com/v1/chat/completions";
    @Value("${openai.api.key}")
    private String apiKey;

    public String getResponseFromOpenAI(String apiPrompt) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        apiPrompt = "Answer this as if you were a tiki head: " + apiPrompt;
        String requestBody = "{\"model\": \"gpt-3.5-turbo\", \"messages\": [{\"role\": \"user\", \"content\": \"" + apiPrompt + "\"}]}";
        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);
    
        ResponseEntity<String> response = restTemplate.exchange(openAIUrl, HttpMethod.POST, entity, String.class);
    
        // Here you might parse and format the response as needed
        return response.getBody();
    }

    public String getYoutubeSearch(YoutubePrompt youtubePrompt) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(apiKey); // Ensure apiKey is set correctly
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
    
        String apiPrompt = String.format(
            "Given a subject of %s for a %s-year-old student in grade level %s, generate a concise and effective search query to find an educational video on YouTube that is suitable for their educational needs and level.",
            youtubePrompt.getSubject(), youtubePrompt.getAge(), youtubePrompt.getGradeLevel());
    
        String requestBody = String.format(
            "{\"model\": \"gpt-3.5-turbo\", \"messages\": [{\"role\": \"user\", \"content\": \"%s\"}]}",
            apiPrompt);
    
        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);
    
        try {
            ResponseEntity<String> response = restTemplate.exchange(openAIUrl, HttpMethod.POST, entity, String.class);
    
            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                throw new Exception("Failed to fetch response from OpenAI");
            }
    
            // Parse the JSON response to extract the content
            JSONObject jsonResponse = new JSONObject(response.getBody());
            String content = jsonResponse.getJSONArray("choices").getJSONObject(0)
                                                         .getJSONObject("message").getString("content");
    
            // Returning the extracted content
            return content.replace("\"", ""); // Removes quotation marks if you want to clean the string
        } catch (Exception e) {
            System.err.println("Error fetching YouTube search query: " + e.getMessage());
            return null; // Consider appropriate error handling
        }
    }
 


    public String getTaskAndDate(String apiPrompt) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

        LocalDate currentDate = LocalDate.now(); // Get the current date
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("EEEE, YYYY-MM-dd"); // Define the formatter
        String dateString = currentDate.format(formatter);

        // Example of how you might use the date in your prompt
        String structuredPrompt = String.format("Today's date is %s. Extract the task and date in YYYY-MM-DD format from the following: %s", dateString, apiPrompt);        String requestBody = "{\"model\": \"gpt-3.5-turbo\", \"messages\": [{\"role\": \"user\", \"content\": \"" + structuredPrompt + "\"}]}";
        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);
    
        ResponseEntity<String> response = restTemplate.exchange(openAIUrl, HttpMethod.POST, entity, String.class);
    
        if(response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            JSONObject jsonResponse = new JSONObject(response.getBody());
            // The actual model response is within the "content" key of the first item in the "choices" array
            String modelResponse = jsonResponse.getJSONArray("choices").getJSONObject(0).getJSONObject("message").getString("content");
    
            // Split the response by newline and then by ': ' to separate the task and the date
            String[] lines = modelResponse.split("\n");
            String task = lines[0].split(": ")[1];
            String date = lines[1].split(": ")[1];
    
            // Return a JSON string with the task and date
            return String.format("{\"task\": \"%s\", \"date\": \"%s\"}", task, date);
        } else {
            // Handle error or non-successful response
            return "{\"error\": \"Failed to get response from OpenAI\"}";
        }
    }

    
}


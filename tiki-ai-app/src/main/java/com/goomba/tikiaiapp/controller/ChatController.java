package com.goomba.tikiaiapp.controller;



import org.springframework.web.bind.annotation.*;

import com.goomba.tikiaiapp.model.ChatPrompt;
import com.goomba.tikiaiapp.model.TestPrompt;
import com.goomba.tikiaiapp.service.OpenAIService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/chatgpt")
@CrossOrigin(origins = {"http://localhost:3000"})
public class ChatController {

    @Autowired
    private OpenAIService openAIService;

    @PostMapping("/ask")
    public ResponseEntity<String> askChatGPT(@RequestBody ChatPrompt chatPrompt) {
        String openAIResponse = openAIService.getResponseFromOpenAI(chatPrompt.getPrompt());
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        return new ResponseEntity<>(openAIResponse, headers, HttpStatus.OK);
    }
    
    @PostMapping("/addTask")
    public ResponseEntity<String> addTaskToCalendar(@RequestBody ChatPrompt chatPrompt) {
        String openAIResponse = openAIService.getTaskAndDate(chatPrompt.getPrompt());
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        return new ResponseEntity<>(openAIResponse, headers, HttpStatus.OK);
    }

    @PostMapping("/createSubTopic")
    public ResponseEntity<String> createPracticeTest(@RequestBody TestPrompt testPrompt) {
        String openAIResponse = openAIService.createPracticeTest(testPrompt);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        return new ResponseEntity<>(openAIResponse, headers, HttpStatus.OK);
    }
}
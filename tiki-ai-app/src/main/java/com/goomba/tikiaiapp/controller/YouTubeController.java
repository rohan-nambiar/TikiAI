package com.goomba.tikiaiapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.goomba.tikiaiapp.model.YoutubePrompt;
import com.goomba.tikiaiapp.service.OpenAIService;
import com.goomba.tikiaiapp.service.YouTubeService;

import java.util.List;

@RestController
@RequestMapping("/api/youtube")
@CrossOrigin(origins = {"http://localhost:3000"})
public class YouTubeController {

    @Autowired
    private YouTubeService youTubeService;

    @Autowired
    private OpenAIService openAIService;

    @PostMapping("/search")
    public ResponseEntity<?> searchVideos(@RequestBody YoutubePrompt prompt) {
        String query = openAIService.getYoutubeSearch(prompt);
        try {
            List<String> videoUrls = youTubeService.searchVideos(query);
            return ResponseEntity.ok(videoUrls);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Failed to search videos: " + e.getMessage());
        }
    }
}

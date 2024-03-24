package com.goomba.tikiaiapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.goomba.tikiaiapp.model.WeatherRequest; // Import your DTO
import com.goomba.tikiaiapp.service.WeatherService;

@RestController
@RequestMapping("/weather")
@CrossOrigin(origins = {"http://localhost:3000"})
public class WeatherController {

    @Autowired
    private WeatherService weatherService;

    @PostMapping("/getCurrent")
    public String getWeather(@RequestBody WeatherRequest request) {
        return weatherService.getCurrentWeather(request.getLocation());
    }
    
}
package com.goomba.tikiaiapp;


import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

public class EnvLoader {

    public static void loadDotenv() {
        try {
            List<String> lines = Files.readAllLines(Paths.get("tiki-ai-app\\.env"));
            for (String line : lines) {
                String[] parts = line.split("=", 2);
                if (parts.length == 2) {
                    String key = parts[0];
                    String value = parts[1];
                    System.setProperty(key, value);
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
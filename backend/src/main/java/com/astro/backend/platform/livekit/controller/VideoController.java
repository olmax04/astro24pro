package com.astro.backend.platform.livekit.controller;
import com.astro.backend.platform.constants.ApiPaths;
import com.astro.backend.platform.livekit.service.VideoService;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping(ApiPaths.VIDEO_ENDPOINT)
@RequiredArgsConstructor
public class VideoController {

    private final VideoService videoService;

    @GetMapping()
    public ResponseEntity<Map<String, Object>> getToken(@RequestParam @NotBlank String roomName,
                                                        @RequestParam @NotBlank String username) {
        String token = videoService.generateToken(roomName, username);
        return ResponseEntity.ok(Map.of("token", token));
    }


}

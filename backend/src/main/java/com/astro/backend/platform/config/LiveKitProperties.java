package com.astro.backend.platform.config;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;

@Data
@Validated
@Component
@ConfigurationProperties(prefix = "livekit")
public class LiveKitProperties {

    @NotBlank(message = "LiveKit URL cannot be empty")
    private String url;

    @NotBlank(message = "LiveKit key cannot be empty")
    private String key;

    @NotBlank(message = "LiveKit secret cannot be empty")
    private String secret;
}

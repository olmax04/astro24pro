package com.astro.backend.platform;

import org.springframework.boot.SpringApplication;

public class TestAstroPlatformBackendApplication {

    public static void main(String[] args) {
        SpringApplication.from(AstroPlatformBackendApplication::main).with(TestcontainersConfiguration.class).run(args);
    }

}

package com.astro.backend.platform.livekit.service;
import com.astro.backend.platform.config.LiveKitProperties;
import io.livekit.server.AccessToken;
import io.livekit.server.RoomJoin;
import io.livekit.server.RoomName;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class VideoServiceImpl implements VideoService {

    private final LiveKitProperties liveKitProperties;

    @Override
    public String generateToken(String roomName, String username) {
        AccessToken accessToken = new AccessToken(
                liveKitProperties.getKey(),
                liveKitProperties.getSecret()
        );

        accessToken.setName(username);
        accessToken.setIdentity("identity");
        accessToken.setMetadata("metadata");
        accessToken.addGrants(new RoomJoin(true), new RoomName(roomName));
        return accessToken.toJwt();
    }
}

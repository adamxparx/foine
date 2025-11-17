package com.example.foine;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

@Configuration
public class CloudinaryConfiguration {
    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
            "cloud_name", "dpnano9yk",
            "api_key", "271996398523696",
            "api_secret", "OXvxUbRLhNdD4mfQFkE4LzMqZZg"
        ));
    }
}

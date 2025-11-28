package com.example.foine.exception;

public class ImagePostException extends RuntimeException {

    public ImagePostException(String message) {
        super(message);
    }

    public ImagePostException(String message, Throwable cause) {
        super(message, cause);
    }
}
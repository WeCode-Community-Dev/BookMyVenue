package com.example.bookMyVenue.Common;

import java.util.UUID;

public class SystemUtil {
    public static String createFileName(String actualFileName){
        String extension =actualFileName.substring(actualFileName.lastIndexOf('.'));
        return UUID.randomUUID()+ extension;
    }
}

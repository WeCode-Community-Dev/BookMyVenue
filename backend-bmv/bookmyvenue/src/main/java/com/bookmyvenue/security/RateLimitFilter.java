package com.bookmyvenue.security;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class RateLimitFilter extends OncePerRequestFilter {

    //cuncurrent hashmap is thread safe for concurrent requests
    private final Map<String, Bucket> authBuckets = new ConcurrentHashMap<>();
    private final Map<String, Bucket> generalBuckets = new ConcurrentHashMap<>();

    private Bucket createAuthBucket() {
        Bandwidth limit = Bandwidth.builder()
                .capacity(5)
                .refillIntervally(5, Duration.ofMinutes(1))
                .build();
    return Bucket.builder().addLimit(limit).build();
    }

    private Bucket createGeneralBucket(){
        Bandwidth limit = Bandwidth.builder()
                .capacity(60)
                .refillIntervally(60, Duration.ofMinutes(1))
                .build();
    return Bucket.builder().addLimit(limit).build();
    }
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String ip = getClientIp(request);
        String path = request.getRequestURI();

        Bucket bucket;
        if(path.startsWith("/api/auth/")){
            bucket = authBuckets.computeIfAbsent(ip, k->createAuthBucket());
        }else{
            bucket = generalBuckets.computeIfAbsent(ip, k -> createGeneralBucket());
        }
        if(bucket.tryConsume(1)){
            filterChain.doFilter(request, response);
        }else{
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.getWriter().write("{\"error\":\"Too many requests. Please wait before trying again.\","+"\"status\":429}");
        }
        // throw new UnsupportedOperationException("Not supported yet.");
    }

    private String getClientIp(HttpServletRequest request){
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if(xForwardedFor != null && !xForwardedFor.isEmpty()){
            return xForwardedFor.split(",")[0].trim();
        }
        String xRealIp = request.getHeader("X-Real_IP");
        if(xRealIp != null && !xRealIp.isEmpty()){
            return xRealIp;
        }
        return request.getRemoteAddr();
    }
    
}

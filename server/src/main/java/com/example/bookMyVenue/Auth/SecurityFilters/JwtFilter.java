package com.example.bookMyVenue.Auth.SecurityFilters;


import com.example.bookMyVenue.Auth.Util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import com.example.bookMyVenue.Auth.Service.UserService;


import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {
    @Autowired
    JwtUtil jwtUtil;

    @Autowired
    UserService userService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        String username = null;
        String jwtToken =null;
        if(header!=null && header.startsWith("Bearer")) {
             jwtToken = header.substring(7);
             username = jwtUtil.getUserName(jwtToken);
        }

            if(username !=null && SecurityContextHolder.getContext().getAuthentication() ==null) {
                UserDetails recordedUser = userService.loadUserByUsername(username);
                if (jwtUtil.validate(username, jwtToken)) {
                    UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(recordedUser, null, recordedUser.getAuthorities());
                    token.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(token);
                }
            }

        filterChain.doFilter(request,response);
    }
}

package com.stayease.hotel_backend.security;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        System.out.println("\n========== JWT FILTER ==========");

        final String authHeader = request.getHeader("Authorization");

        System.out.println("Authorization Header: " + authHeader);

        // No Authorization header
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("No Bearer Token Found");
            filterChain.doFilter(request, response);
            return;
        }

        String jwt = authHeader.substring(7);

        System.out.println("JWT Token: " + jwt);

        try {

            String email = jwtService.extractEmail(jwt);

            System.out.println("Email Extracted: " + email);

            if (email != null
                    && SecurityContextHolder.getContext().getAuthentication() == null) {

                UserDetails userDetails =
                        userDetailsService.loadUserByUsername(email);

                System.out.println("User Loaded From DB: " + userDetails.getUsername());

                boolean valid =
                        jwtService.isTokenValid(jwt, userDetails.getUsername());

                System.out.println("Token Valid: " + valid);

                if (valid) {

                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities());

                    authToken.setDetails(
                            new WebAuthenticationDetailsSource()
                                    .buildDetails(request));

                    SecurityContextHolder.getContext()
                            .setAuthentication(authToken);

                    System.out.println("Authentication Successful");
                } else {

                    System.out.println("Authentication Failed - Invalid Token");
                }
            }

        } catch (Exception e) {

            System.out.println("JWT ERROR: " + e.getMessage());
            e.printStackTrace();
        }

        System.out.println("===============================\n");

        filterChain.doFilter(request, response);
    }
}
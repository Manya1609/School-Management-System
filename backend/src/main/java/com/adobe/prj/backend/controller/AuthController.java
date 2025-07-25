package com.adobe.prj.backend.controller;

import com.adobe.prj.backend.dto.request.AuthenticationRequest;
import com.adobe.prj.backend.dto.response.AuthenticationResponse;
import com.adobe.prj.backend.entity.User;
import com.adobe.prj.backend.repository.UserRepository;
import com.adobe.prj.backend.util.JwtService;
import com.adobe.prj.backend.util.UserDetailsServiceImpl;
import jakarta.servlet.http.HttpServletResponse;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Optional;

@RestController
public class AuthController {


    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private JwtService jwtService;
    @Autowired
    private UserRepository userRepository;

    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String HEADER_STRING = "Authorization ";


    @PostMapping("/api/auth/login")
    public void createAuthenticationToken(@RequestBody AuthenticationRequest authRequest, HttpServletResponse response) throws IOException, JSONException {
        try{
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authRequest.getUsername(),authRequest.getPassword()));
    }catch (BadCredentialsException e){
            throw new BadCredentialsException("Incorrect Username or Password");
        }catch(DisabledException disabledException){
            response.sendError(HttpServletResponse.SC_NOT_FOUND,"User is not created");
            return ;
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.getUsername());
        Optional<User> userOpt=userRepository.findByUserName(userDetails.getUsername());
        final String jwtToken=jwtService.generateToken(userDetails.getUsername(),userOpt.get().getRole().getValue());

        if(userOpt.isPresent()){
            response.getWriter().write(new JSONObject()
                    .put("userId",userOpt.get().getUserId())
                    .put("fullName",userOpt.get().getFullName())
                    .put("role",userOpt.get().getRole().getValue())
                    .put("username",userDetails.getUsername())
                    .put("email",userOpt.get().getEmail())
                    .toString());
        }
        response.setHeader("Access-Control-Expose-Headers", "Authorization");
        response.setHeader("Access-Control-Allow-Headers", "Authorization,X-Pingother,Origin,X-Requested-With,Content-Type,Accept,X-Custom-Header");
        response.setHeader(HEADER_STRING,TOKEN_PREFIX + jwtToken);
}


}
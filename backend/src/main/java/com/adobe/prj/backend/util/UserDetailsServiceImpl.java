package com.adobe.prj.backend.util;


import com.adobe.prj.backend.entity.User;
import com.adobe.prj.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService{

    @Autowired
    private UserRepository userRepository;


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User>  userOpt=userRepository.findByUserName(username);
        if(userOpt.isEmpty()) throw new UsernameNotFoundException("User not found",null);

        User user = userOpt.get();
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority(user.getRole().getValue());

        return new org.springframework.security.core.userdetails.User(userOpt.get().getUserName(),userOpt.get().getPassword(), List.of(authority));
    }


}

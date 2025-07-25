package com.adobe.prj.backend.configuration;

import com.adobe.prj.backend.dto.user.UserRole;
import com.adobe.prj.backend.util.JwtAuthFilter;
import com.adobe.prj.backend.util.UserDetailsServiceImpl;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import static org.springframework.security.config.Customizer.withDefaults;
import static org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher;

@Configuration
@EnableMethodSecurity
@EnableWebSecurity
public class WebSecurityConfiguration {

    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    @Bean
    public UserDetailsService userDetailsService() {
        return new UserDetailsServiceImpl(); // Ensure UserInfoService implements UserDetailsService
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:3000")  // frontend URL
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .cors(withDefaults())
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        .requestMatchers("/api/auth/login").permitAll()
                        .requestMatchers("/api/password/reset").hasAnyAuthority("admin","super_admin")
                        .requestMatchers(HttpMethod.GET,"/api/users").hasAnyAuthority("admin","super_admin")
                        .requestMatchers(HttpMethod.GET,"/api/users/**").authenticated()
                        .requestMatchers(HttpMethod.POST,"/api/users/**").hasAnyAuthority("admin","super_admin")
                        .requestMatchers(HttpMethod.PUT,"/api/users/**").hasAnyAuthority("admin","super_admin")
                        .requestMatchers(HttpMethod.DELETE,"/api/users/**").hasAnyAuthority("admin","super_admin")
                        .requestMatchers("/api/grades/**").hasAnyAuthority("admin", "super_admin")
                        .requestMatchers(HttpMethod.GET,"/api/notices").authenticated()
                        .requestMatchers(HttpMethod.POST,"/api/notices").hasAnyAuthority("admin", "super_admin","teacher")
                        .requestMatchers("/api/notices/**").hasAnyAuthority("admin", "super_admin","teacher")
                        .requestMatchers("/api/sections").hasAnyAuthority("admin", "super_admin")
                        .requestMatchers("/api/sections/**").authenticated()//check--post sections
                        .requestMatchers("/api/sections/users/**").authenticated()
                        .requestMatchers(HttpMethod.GET,"/api/students").hasAnyAuthority("admin", "super_admin","teacher")
                        .requestMatchers("/api/students").hasAnyAuthority("admin", "super_admin")
                        .requestMatchers("/api/students/{userId}").authenticated()
                        .requestMatchers("/api/students/promote").hasAnyAuthority("teacher", "admin", "super_admin")
                        .requestMatchers("/api/students/**").hasAnyAuthority("admin", "super_admin")
                        .requestMatchers(HttpMethod.POST, "/api/subjects").hasAnyAuthority("admin", "super_admin")
                        .requestMatchers(HttpMethod.PUT, "/api/subjects/**").hasAnyAuthority("admin", "super_admin")
                        .requestMatchers(HttpMethod.DELETE, "/api/subjects/**").hasAnyAuthority("admin", "super_admin")
                        .requestMatchers(HttpMethod.GET, "/api/subjects/**").authenticated()
                        .requestMatchers(HttpMethod.GET,"/api/system/**").authenticated()
                        .requestMatchers(HttpMethod.POST,"/api/system/**").hasAuthority("super_admin")
                        .requestMatchers(HttpMethod.PUT,"/api/system/**").hasAuthority("super_admin")
                        .requestMatchers(HttpMethod.GET, "/api/exams").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/tabulation").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/tabulations-sheet").authenticated()
                        .requestMatchers("/api/exams/**").hasAnyAuthority("admin", "super_admin")
                        .requestMatchers(HttpMethod.GET,"/api/managetimetable/**").authenticated()
                        .requestMatchers("/api/managetimetable/**").hasAnyAuthority( "admin", "super_admin")
                        .requestMatchers("/api/timetables").authenticated()
                        .requestMatchers("/api/timetables/**").hasAnyAuthority("admin", "super_admin")
                        .requestMatchers("/api/classes/*/students").hasAnyAuthority("admin", "super_admin", "teacher")
                        .requestMatchers(HttpMethod.GET,"/api/classes/**").authenticated()
                        .requestMatchers("/api/classes/**").hasAnyAuthority("admin", "super_admin")
                        .requestMatchers("/api/marks/**").hasAnyAuthority("admin", "super_admin","teacher")
                        .requestMatchers(HttpMethod.GET,"/api/timeslots").authenticated()
                        .requestMatchers(HttpMethod.POST,"/api/timeslots").hasAnyAuthority("admin","super_admin","teacher")
                        .requestMatchers("/api/timeslots/**").hasAnyAuthority("admin", "super_admin")
                        .requestMatchers("/api/timetable/**").hasAnyAuthority("admin", "super_admin")
                        .anyRequest().authenticated()
                )
                .sessionManagement(sess -> sess
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return httpSecurity.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setUserDetailsService(userDetailsService());
        authenticationProvider.setPasswordEncoder(passwordEncoder());
        return authenticationProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }
}

package ba.rs.udas.udas_member_management.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class LogoutController {

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @GetMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            new SecurityContextLogoutHandler().logout(request, null, auth);
        }
        if (request.getSession(false) != null) {
            request.getSession().invalidate();
        }
        
        return ResponseEntity.status(HttpStatus.FOUND)
                .header("Location", frontendUrl + "/login?logout")
                .build();
    }
}

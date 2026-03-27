package ba.rs.udas.udas_member_management.configuration;

import ba.rs.udas.udas_member_management.service.ApplicationUserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class AdminBootstrap {

    private static final Logger log = LoggerFactory.getLogger(AdminBootstrap.class);

    private final ApplicationUserService userService;

    public AdminBootstrap(ApplicationUserService userService) {
        this.userService = userService;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void bootstrapAdminUser() {
        String adminEmail = System.getenv("ADMIN_EMAIL");
        
        if (adminEmail == null || adminEmail.isBlank()) {
            log.info("ADMIN_EMAIL environment variable not set, skipping admin bootstrap");
            return;
        }

        if (userService.existsByEmail(adminEmail)) {
            log.info("Admin user {} already exists, skipping bootstrap", adminEmail);
            return;
        }

        var admin = userService.createAdminUser(adminEmail);
        log.info("Bootstrap admin user created: {} with role {}", admin.getEmail(), admin.getRole());
    }
}

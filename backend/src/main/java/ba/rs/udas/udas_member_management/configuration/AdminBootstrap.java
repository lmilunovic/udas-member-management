package ba.rs.udas.udas_member_management.configuration;

import ba.rs.udas.udas_member_management.service.ApplicationUserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class AdminBootstrap {

    private static final Logger log = LoggerFactory.getLogger(AdminBootstrap.class);

    private final ApplicationUserService userService;

    @Value("${app.admin.email:}")
    private String adminEmail;

    public AdminBootstrap(ApplicationUserService userService) {
        this.userService = userService;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void bootstrapAdminUser() {
        if (adminEmail == null || adminEmail.isBlank()) {
            log.info("Admin email not configured, skipping admin bootstrap");
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

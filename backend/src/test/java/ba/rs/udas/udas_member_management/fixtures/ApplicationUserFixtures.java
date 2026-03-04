package ba.rs.udas.udas_member_management.fixtures;

import ba.rs.udas.udas_member_management.entity.ApplicationUser;
import ba.rs.udas.udas_member_management.entity.UserRole;
import ba.rs.udas.udas_member_management.model.ApplicationUserRequest;

import java.time.OffsetDateTime;
import java.util.UUID;

public class ApplicationUserFixtures {

    public static ApplicationUser applicationUserJohn() {
        ApplicationUser user = new ApplicationUser();
        user.setId(UUID.randomUUID());
        user.setEmail("john@example.com");
        user.setName("John Doe");
        user.setRole(UserRole.READ_WRITE);
        user.setActive(true);
        user.setCreatedAt(OffsetDateTime.now());
        return user;
    }

    public static ApplicationUser applicationUserJane() {
        ApplicationUser user = new ApplicationUser();
        user.setId(UUID.randomUUID());
        user.setEmail("jane@example.com");
        user.setName("Jane Smith");
        user.setRole(UserRole.READ_ONLY);
        user.setActive(true);
        user.setCreatedAt(OffsetDateTime.now());
        return user;
    }

    public static ApplicationUser applicationUserAdmin() {
        ApplicationUser user = new ApplicationUser();
        user.setId(UUID.randomUUID());
        user.setEmail("admin@example.com");
        user.setName("Admin User");
        user.setRole(UserRole.ADMIN);
        user.setActive(true);
        user.setCreatedAt(OffsetDateTime.now());
        return user;
    }

    public static ApplicationUserRequest applicationUserRequestJohn() {
        return ApplicationUserRequest.builder()
                .email("john@example.com")
                .role(ApplicationUserRequest.RoleEnum.READ_WRITE)
                .active(true)
                .build();
    }

    public static ba.rs.udas.udas_member_management.model.ApplicationUser applicationUserModelJohn() {
        return ba.rs.udas.udas_member_management.model.ApplicationUser.builder()
                .id(UUID.randomUUID())
                .email("john@example.com")
                .name("John Doe")
                .role(ba.rs.udas.udas_member_management.model.ApplicationUser.RoleEnum.READ_WRITE)
                .active(true)
                .createdAt(OffsetDateTime.now())
                .build();
    }
}

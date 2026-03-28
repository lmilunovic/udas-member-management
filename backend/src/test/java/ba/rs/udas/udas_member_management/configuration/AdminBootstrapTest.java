package ba.rs.udas.udas_member_management.configuration;

import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.never;

import ba.rs.udas.udas_member_management.entity.ApplicationUser;
import ba.rs.udas.udas_member_management.entity.UserRole;
import ba.rs.udas.udas_member_management.service.ApplicationUserService;
import java.time.OffsetDateTime;
import java.util.UUID;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

@DisplayName("AdminBootstrap — startup admin user logic")
@ExtendWith(MockitoExtension.class)
class AdminBootstrapTest {

    @Mock ApplicationUserService userService;

    @InjectMocks AdminBootstrap adminBootstrap;

    @Test
    @DisplayName("bootstrapAdminUser skips when adminEmail is blank")
    void bootstrapAdminUser_whenEmailBlank_skips() {
        ReflectionTestUtils.setField(adminBootstrap, "adminEmail", "");

        adminBootstrap.bootstrapAdminUser();

        then(userService).shouldHaveNoInteractions();
    }

    @Test
    @DisplayName("bootstrapAdminUser skips when admin user already exists")
    void bootstrapAdminUser_whenUserAlreadyExists_skips() {
        ReflectionTestUtils.setField(adminBootstrap, "adminEmail", "admin@example.com");
        given(userService.existsByEmail("admin@example.com")).willReturn(true);

        adminBootstrap.bootstrapAdminUser();

        then(userService).should(never()).createAdminUser("admin@example.com");
    }

    @Test
    @DisplayName("bootstrapAdminUser creates admin user when not yet registered")
    void bootstrapAdminUser_whenUserNotExists_createsAdmin() {
        ReflectionTestUtils.setField(adminBootstrap, "adminEmail", "admin@example.com");
        given(userService.existsByEmail("admin@example.com")).willReturn(false);
        ApplicationUser created =
                ApplicationUser.builder()
                        .id(UUID.randomUUID())
                        .email("admin@example.com")
                        .name("admin")
                        .role(UserRole.ADMIN)
                        .active(true)
                        .createdAt(OffsetDateTime.now())
                        .build();
        given(userService.createAdminUser("admin@example.com")).willReturn(created);

        adminBootstrap.bootstrapAdminUser();

        then(userService).should().createAdminUser("admin@example.com");
    }
}

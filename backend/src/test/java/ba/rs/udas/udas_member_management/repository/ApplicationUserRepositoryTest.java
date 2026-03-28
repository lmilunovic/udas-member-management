package ba.rs.udas.udas_member_management.repository;

import ba.rs.udas.udas_member_management.config.TestContainersConfig;
import ba.rs.udas.udas_member_management.entity.ApplicationUser;
import ba.rs.udas.udas_member_management.entity.UserRole;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.context.annotation.Import;

import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("ApplicationUserRepository — custom query methods")
@DataJpaTest
@Import(TestContainersConfig.class)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class ApplicationUserRepositoryTest {

    @Autowired
    TestEntityManager entityManager;

    @Autowired
    ApplicationUserRepository repository;

    private ApplicationUser persistUser(String email) {
        ApplicationUser user = ApplicationUser.builder()
                .id(UUID.randomUUID())
                .email(email)
                .name("Test User")
                .role(UserRole.READ_ONLY)
                .active(true)
                .createdAt(OffsetDateTime.now())
                .build();
        entityManager.persistAndFlush(user);
        return user;
    }

    @Test
    @DisplayName("findByEmail returns user when email exists")
    void findByEmail_whenExists_returnsUser() {
        persistUser("alice@example.com");

        Optional<ApplicationUser> result = repository.findByEmail("alice@example.com");

        assertThat(result).isPresent();
        assertThat(result.get().getEmail()).isEqualTo("alice@example.com");
    }

    @Test
    @DisplayName("findByEmail returns empty when email does not exist")
    void findByEmail_whenNotExists_returnsEmpty() {
        Optional<ApplicationUser> result = repository.findByEmail("nobody@example.com");

        assertThat(result).isEmpty();
    }

    @Test
    @DisplayName("existsByEmail returns true when email exists")
    void existsByEmail_whenExists_returnsTrue() {
        persistUser("bob@example.com");

        assertThat(repository.existsByEmail("bob@example.com")).isTrue();
    }

    @Test
    @DisplayName("existsByEmail returns false when email does not exist")
    void existsByEmail_whenNotExists_returnsFalse() {
        assertThat(repository.existsByEmail("ghost@example.com")).isFalse();
    }
}

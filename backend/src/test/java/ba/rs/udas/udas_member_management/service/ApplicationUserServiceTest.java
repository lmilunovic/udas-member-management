package ba.rs.udas.udas_member_management.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import ba.rs.udas.udas_member_management.entity.ApplicationUser;
import ba.rs.udas.udas_member_management.fixtures.ApplicationUserFixtures;
import ba.rs.udas.udas_member_management.mapper.ApplicationUserMapper;
import ba.rs.udas.udas_member_management.model.ApplicationUserRequest;
import ba.rs.udas.udas_member_management.repository.ApplicationUserRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@DisplayName("ApplicationUserService operations")
@ExtendWith(MockitoExtension.class)
class ApplicationUserServiceTest {

    @Mock private ApplicationUserRepository userRepository;

    @Mock private ApplicationUserMapper userMapper;

    @InjectMocks private ApplicationUserService userService;

    @Test
    @DisplayName("createUser should save and return user")
    void createUser_givenValidRequest_whenRepositorySaves_thenReturnsUser() {
        // Given
        ApplicationUserRequest request = ApplicationUserFixtures.applicationUserRequestJohn();
        ApplicationUser entity = ApplicationUserFixtures.applicationUserJohn();
        when(userMapper.toEntity(request)).thenReturn(entity);
        when(userRepository.save(any(ApplicationUser.class))).thenReturn(entity);

        // When
        ApplicationUser result = userService.createUser(request);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getEmail()).isEqualTo("john@example.com");
        verify(userRepository).save(any(ApplicationUser.class));
    }

    @Test
    @DisplayName("findAll should return all users")
    void findAll_whenCalled_thenReturnsAllUsers() {
        // Given
        ApplicationUser user = ApplicationUserFixtures.applicationUserJohn();
        when(userRepository.findAll()).thenReturn(List.of(user));

        // When
        List<ApplicationUser> result = userService.findAll();

        // Then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getEmail()).isEqualTo("john@example.com");
    }

    @Test
    @DisplayName("findById should return user when found")
    void findById_givenExistingId_whenFound_thenReturnsUser() {
        // Given
        UUID id = UUID.randomUUID();
        ApplicationUser user = ApplicationUserFixtures.applicationUserJohn();
        user.setId(id);
        when(userRepository.findById(id)).thenReturn(Optional.of(user));

        // When
        Optional<ApplicationUser> result = userService.findById(id);

        // Then
        assertThat(result).isPresent();
        assertThat(result.get().getEmail()).isEqualTo("john@example.com");
    }

    @Test
    @DisplayName("findById should return empty when not found")
    void findById_givenNonExistingId_whenNotFound_thenReturnsEmpty() {
        // Given
        UUID id = UUID.randomUUID();
        when(userRepository.findById(id)).thenReturn(Optional.empty());

        // When
        Optional<ApplicationUser> result = userService.findById(id);

        // Then
        assertThat(result).isEmpty();
    }

    @Test
    @DisplayName("findByEmail should return user when found")
    void findByEmail_givenExistingEmail_whenFound_thenReturnsUser() {
        // Given
        String email = "john@example.com";
        ApplicationUser user = ApplicationUserFixtures.applicationUserJohn();
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

        // When
        Optional<ApplicationUser> result = userService.findByEmail(email);

        // Then
        assertThat(result).isPresent();
        assertThat(result.get().getEmail()).isEqualTo(email);
    }

    @Test
    @DisplayName("existsByEmail should return true when user exists")
    void existsByEmail_givenExistingEmail_whenCalled_thenReturnsTrue() {
        // Given
        String email = "john@example.com";
        when(userRepository.existsByEmail(email)).thenReturn(true);

        // When
        boolean result = userService.existsByEmail(email);

        // Then
        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("updateUser should update and return user when found")
    void updateUser_givenExistingId_whenFound_thenUpdatesAndReturnsUser() {
        // Given
        UUID id = UUID.randomUUID();
        ApplicationUserRequest request = ApplicationUserFixtures.applicationUserRequestJohn();
        ApplicationUser existing = ApplicationUserFixtures.applicationUserJohn();
        existing.setId(id);

        when(userRepository.findById(id)).thenReturn(Optional.of(existing));
        when(userRepository.save(any(ApplicationUser.class))).thenReturn(existing);

        // When
        ApplicationUser result = userService.updateUser(id, request);

        // Then
        assertThat(result).isNotNull();
        verify(userRepository).save(any(ApplicationUser.class));
    }

    @Test
    @DisplayName("updateUser should return null when not found")
    void updateUser_givenNonExistingId_whenNotFound_thenReturnsNull() {
        // Given
        UUID id = UUID.randomUUID();
        ApplicationUserRequest request = ApplicationUserFixtures.applicationUserRequestJohn();
        when(userRepository.findById(id)).thenReturn(Optional.empty());

        // When
        ApplicationUser result = userService.updateUser(id, request);

        // Then
        assertThat(result).isNull();
    }

    @Test
    @DisplayName("deleteUser should return true when user exists")
    void deleteUser_givenExistingId_whenCalled_thenReturnsTrue() {
        // Given
        UUID id = UUID.randomUUID();
        when(userRepository.existsById(id)).thenReturn(true);
        doNothing().when(userRepository).deleteById(id);

        // When
        boolean result = userService.deleteUser(id);

        // Then
        assertThat(result).isTrue();
        verify(userRepository).deleteById(id);
    }

    @Test
    @DisplayName("deleteUser should return false when user does not exist")
    void deleteUser_givenNonExistingId_whenCalled_thenReturnsFalse() {
        // Given
        UUID id = UUID.randomUUID();
        when(userRepository.existsById(id)).thenReturn(false);

        // When
        boolean result = userService.deleteUser(id);

        // Then
        assertThat(result).isFalse();
    }

    @Test
    @DisplayName("updateUserFromOAuth should update user info when found")
    void updateUserFromOAuth_givenExistingEmail_whenFound_thenUpdatesAndReturns() {
        // Given
        String email = "john@example.com";
        String name = "John Updated";
        String googleId = "google-12345";
        ApplicationUser existing = ApplicationUserFixtures.applicationUserJohn();

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(existing));
        when(userRepository.save(any(ApplicationUser.class))).thenReturn(existing);

        // When
        ApplicationUser result = userService.updateUserFromOAuth(email, name, googleId);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo(name);
        assertThat(result.getGoogleId()).isEqualTo(googleId);
    }

    @Test
    @DisplayName("updateUserFromOAuth should return null when not found")
    void updateUserFromOAuth_givenNonExistingEmail_whenNotFound_thenReturnsNull() {
        // Given
        String email = "nonexistent@example.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        // When
        ApplicationUser result = userService.updateUserFromOAuth(email, "Name", "google-id");

        // Then
        assertThat(result).isNull();
    }

    @Test
    @DisplayName("createUserFromOAuth should save and return user")
    void createUserFromOAuth_whenCalled_thenSavesAndReturnsUser() {
        // Given
        ApplicationUser user = ApplicationUserFixtures.applicationUserJohn();
        when(userRepository.save(user)).thenReturn(user);

        // When
        ApplicationUser result = userService.createUserFromOAuth(user);

        // Then
        assertThat(result).isNotNull();
        verify(userRepository).save(user);
    }
}

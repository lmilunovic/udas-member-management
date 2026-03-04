package ba.rs.udas.udas_member_management.controller;

import ba.rs.udas.udas_member_management.entity.ApplicationUser;
import ba.rs.udas.udas_member_management.fixtures.ApplicationUserFixtures;
import ba.rs.udas.udas_member_management.mapper.ApplicationUserMapper;
import ba.rs.udas.udas_member_management.model.ApplicationUserRequest;
import ba.rs.udas.udas_member_management.model.PagedApplicationUser;
import ba.rs.udas.udas_member_management.service.ApplicationUserService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@DisplayName("ApplicationUserController operations")
@ExtendWith(MockitoExtension.class)
class ApplicationUserControllerTest {

    @Mock
    private ApplicationUserService userService;

    @Mock
    private ApplicationUserMapper userMapper;

    @InjectMocks
    private ApplicationUserController controller;

    @Test
    @DisplayName("createUser should return 201 when user is created")
    void createUser_givenValidRequest_whenCreated_thenReturns201() {
        // Given
        ApplicationUserRequest request = ApplicationUserFixtures.applicationUserRequestJohn();
        ApplicationUser entity = ApplicationUserFixtures.applicationUserJohn();
        ba.rs.udas.udas_member_management.model.ApplicationUser model = ApplicationUserFixtures.applicationUserModelJohn();
        
        when(userService.createUser(any(ApplicationUserRequest.class))).thenReturn(entity);
        when(userMapper.toModel(entity)).thenReturn(model);

        // When
        ResponseEntity<ba.rs.udas.udas_member_management.model.ApplicationUser> result = controller.createUser(request);

        // Then
        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(result.getBody()).isNotNull();
    }

    @Test
    @DisplayName("getUser should return 200 when user is found")
    void getUser_givenExistingId_whenFound_thenReturns200() {
        // Given
        UUID id = UUID.randomUUID();
        ApplicationUser entity = ApplicationUserFixtures.applicationUserJohn();
        entity.setId(id);
        ba.rs.udas.udas_member_management.model.ApplicationUser model = ApplicationUserFixtures.applicationUserModelJohn();
        
        when(userService.findById(id)).thenReturn(Optional.of(entity));
        when(userMapper.toModel(entity)).thenReturn(model);

        // When
        ResponseEntity<ba.rs.udas.udas_member_management.model.ApplicationUser> result = controller.getUser(id);

        // Then
        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(result.getBody()).isNotNull();
    }

    @Test
    @DisplayName("getUser should return 404 when user is not found")
    void getUser_givenNonExistingId_whenNotFound_thenReturns404() {
        // Given
        UUID id = UUID.randomUUID();
        when(userService.findById(id)).thenReturn(Optional.empty());

        // When
        ResponseEntity<ba.rs.udas.udas_member_management.model.ApplicationUser> result = controller.getUser(id);

        // Then
        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    @DisplayName("listUsers should return 200 with paginated list")
    void listUsers_whenCalled_thenReturns200WithList() {
        // Given
        List<ApplicationUser> users = List.of(ApplicationUserFixtures.applicationUserJohn());
        ba.rs.udas.udas_member_management.model.ApplicationUser model = ApplicationUserFixtures.applicationUserModelJohn();
        
        when(userService.findAll()).thenReturn(users);
        when(userMapper.toModel(any(ApplicationUser.class))).thenReturn(model);

        // When
        ResponseEntity<PagedApplicationUser> result = controller.listUsers();

        // Then
        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(result.getBody()).isNotNull();
        assertThat(result.getBody().getContent()).hasSize(1);
    }

    @Test
    @DisplayName("updateUser should return 200 when user is updated")
    void updateUser_givenExistingId_whenUpdated_thenReturns200() {
        // Given
        UUID id = UUID.randomUUID();
        ApplicationUserRequest request = ApplicationUserFixtures.applicationUserRequestJohn();
        ApplicationUser entity = ApplicationUserFixtures.applicationUserJohn();
        entity.setId(id);
        ba.rs.udas.udas_member_management.model.ApplicationUser model = ApplicationUserFixtures.applicationUserModelJohn();
        
        when(userService.updateUser(any(UUID.class), any(ApplicationUserRequest.class))).thenReturn(entity);
        when(userMapper.toModel(entity)).thenReturn(model);

        // When
        ResponseEntity<ba.rs.udas.udas_member_management.model.ApplicationUser> result = controller.updateUser(id, request);

        // Then
        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(result.getBody()).isNotNull();
    }

    @Test
    @DisplayName("updateUser should return 404 when user is not found")
    void updateUser_givenNonExistingId_whenNotFound_thenReturns404() {
        // Given
        UUID id = UUID.randomUUID();
        ApplicationUserRequest request = ApplicationUserFixtures.applicationUserRequestJohn();
        when(userService.updateUser(any(UUID.class), any(ApplicationUserRequest.class))).thenReturn(null);

        // When
        ResponseEntity<ba.rs.udas.udas_member_management.model.ApplicationUser> result = controller.updateUser(id, request);

        // Then
        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    @DisplayName("deleteUser should return 204 when user is deleted")
    void deleteUser_givenExistingId_whenDeleted_thenReturns204() {
        // Given
        UUID id = UUID.randomUUID();
        when(userService.deleteUser(id)).thenReturn(true);

        // When
        ResponseEntity<Void> result = controller.deleteUser(id);

        // Then
        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
    }

    @Test
    @DisplayName("deleteUser should return 404 when user is not found")
    void deleteUser_givenNonExistingId_whenNotFound_thenReturns404() {
        // Given
        UUID id = UUID.randomUUID();
        when(userService.deleteUser(id)).thenReturn(false);

        // When
        ResponseEntity<Void> result = controller.deleteUser(id);

        // Then
        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }
}

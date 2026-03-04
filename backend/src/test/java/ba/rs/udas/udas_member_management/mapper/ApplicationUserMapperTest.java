package ba.rs.udas.udas_member_management.mapper;

import ba.rs.udas.udas_member_management.entity.ApplicationUser;
import ba.rs.udas.udas_member_management.entity.UserRole;
import ba.rs.udas.udas_member_management.fixtures.ApplicationUserFixtures;
import ba.rs.udas.udas_member_management.model.ApplicationUserRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("ApplicationUserMapper operations")
@ExtendWith(MockitoExtension.class)
class ApplicationUserMapperTest {

    private final ApplicationUserMapper mapper = new ApplicationUserMapperImpl();

    @Test
    @DisplayName("toEntity should convert request to entity")
    void toEntity_givenRequest_whenMapped_thenReturnsEntity() {
        // Given
        ApplicationUserRequest request = ApplicationUserRequest.builder()
                .email("john@example.com")
                .role(ApplicationUserRequest.RoleEnum.READ_WRITE)
                .active(true)
                .build();

        // When
        ApplicationUser result = mapper.toEntity(request);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getEmail()).isEqualTo("john@example.com");
        assertThat(result.getRole()).isEqualTo(UserRole.READ_WRITE);
        assertThat(result.getActive()).isTrue();
    }

    @Test
    @DisplayName("toModel should convert entity to model")
    void toModel_givenEntity_whenMapped_thenReturnsModel() {
        // Given
        ApplicationUser entity = ApplicationUserFixtures.applicationUserJohn();

        // When
        ba.rs.udas.udas_member_management.model.ApplicationUser result = mapper.toModel(entity);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getEmail()).isEqualTo("john@example.com");
        assertThat(result.getRole()).isEqualTo(ba.rs.udas.udas_member_management.model.ApplicationUser.RoleEnum.READ_WRITE);
        assertThat(result.getActive()).isTrue();
    }

    @Test
    @DisplayName("toModel should return null when entity is null")
    void toModel_givenNullEntity_whenMapped_thenReturnsNull() {
        // When
        ba.rs.udas.udas_member_management.model.ApplicationUser result = mapper.toModel(null);

        // Then
        assertThat(result).isNull();
    }

    @Test
    @DisplayName("mapRoleToEntity should map READ_ONLY correctly")
    void mapRoleToEntity_givenReadOnlyRole_whenMapped_thenReturnsEntityRole() {
        // Given
        ApplicationUserRequest.RoleEnum role = ApplicationUserRequest.RoleEnum.READ_ONLY;

        // When
        UserRole result = mapper.mapRoleToEntity(role);

        // Then
        assertThat(result).isEqualTo(UserRole.READ_ONLY);
    }

    @Test
    @DisplayName("mapRoleToEntity should map READ_WRITE correctly")
    void mapRoleToEntity_givenReadWriteRole_whenMapped_thenReturnsEntityRole() {
        // Given
        ApplicationUserRequest.RoleEnum role = ApplicationUserRequest.RoleEnum.READ_WRITE;

        // When
        UserRole result = mapper.mapRoleToEntity(role);

        // Then
        assertThat(result).isEqualTo(UserRole.READ_WRITE);
    }

    @Test
    @DisplayName("mapRoleToEntity should map ADMIN correctly")
    void mapRoleToEntity_givenAdminRole_whenMapped_thenReturnsEntityRole() {
        // Given
        ApplicationUserRequest.RoleEnum role = ApplicationUserRequest.RoleEnum.ADMIN;

        // When
        UserRole result = mapper.mapRoleToEntity(role);

        // Then
        assertThat(result).isEqualTo(UserRole.ADMIN);
    }

    @Test
    @DisplayName("mapRoleToModel should map READ_ONLY correctly")
    void mapRoleToModel_givenReadOnlyRole_whenMapped_thenReturnsModelRole() {
        // Given
        UserRole role = UserRole.READ_ONLY;

        // When
        ba.rs.udas.udas_member_management.model.ApplicationUser.RoleEnum result = mapper.mapRoleToModel(role);

        // Then
        assertThat(result).isEqualTo(ba.rs.udas.udas_member_management.model.ApplicationUser.RoleEnum.READ_ONLY);
    }

    @Test
    @DisplayName("mapRoleToModel should map READ_WRITE correctly")
    void mapRoleToModel_givenReadWriteRole_whenMapped_thenReturnsModelRole() {
        // Given
        UserRole role = UserRole.READ_WRITE;

        // When
        ba.rs.udas.udas_member_management.model.ApplicationUser.RoleEnum result = mapper.mapRoleToModel(role);

        // Then
        assertThat(result).isEqualTo(ba.rs.udas.udas_member_management.model.ApplicationUser.RoleEnum.READ_WRITE);
    }

    @Test
    @DisplayName("mapRoleToModel should map ADMIN correctly")
    void mapRoleToModel_givenAdminRole_whenMapped_thenReturnsModelRole() {
        // Given
        UserRole role = UserRole.ADMIN;

        // When
        ba.rs.udas.udas_member_management.model.ApplicationUser.RoleEnum result = mapper.mapRoleToModel(role);

        // Then
        assertThat(result).isEqualTo(ba.rs.udas.udas_member_management.model.ApplicationUser.RoleEnum.ADMIN);
    }

    @Test
    @DisplayName("mapRoleToModel should return default when null")
    void mapRoleToModel_givenNullRole_whenMapped_thenReturnsDefaultRole() {
        // When
        ba.rs.udas.udas_member_management.model.ApplicationUser.RoleEnum result = mapper.mapRoleToModel(null);

        // Then
        assertThat(result).isEqualTo(ba.rs.udas.udas_member_management.model.ApplicationUser.RoleEnum.READ_ONLY);
    }
}

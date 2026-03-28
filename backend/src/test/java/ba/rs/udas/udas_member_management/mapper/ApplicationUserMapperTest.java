package ba.rs.udas.udas_member_management.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import ba.rs.udas.udas_member_management.entity.ApplicationUser;
import ba.rs.udas.udas_member_management.entity.UserRole;
import ba.rs.udas.udas_member_management.fixtures.ApplicationUserFixtures;
import ba.rs.udas.udas_member_management.model.ApplicationUserRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

@DisplayName("ApplicationUserMapper operations")
@ExtendWith(MockitoExtension.class)
class ApplicationUserMapperTest {

    private final ApplicationUserMapper mapper = new ApplicationUserMapperImpl();

    @Test
    @DisplayName("toEntity should convert request to entity")
    void toEntity_givenRequest_whenMapped_thenReturnsEntity() {
        // Given
        ApplicationUserRequest request =
                ApplicationUserRequest.builder()
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
        assertThat(result.getRole())
                .isEqualTo(
                        ba.rs.udas.udas_member_management.model.ApplicationUser.RoleEnum
                                .READ_WRITE);
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
        ba.rs.udas.udas_member_management.model.ApplicationUser.RoleEnum result =
                mapper.mapRoleToModel(role);

        // Then
        assertThat(result)
                .isEqualTo(
                        ba.rs.udas.udas_member_management.model.ApplicationUser.RoleEnum.READ_ONLY);
    }

    @Test
    @DisplayName("mapRoleToModel should map READ_WRITE correctly")
    void mapRoleToModel_givenReadWriteRole_whenMapped_thenReturnsModelRole() {
        // Given
        UserRole role = UserRole.READ_WRITE;

        // When
        ba.rs.udas.udas_member_management.model.ApplicationUser.RoleEnum result =
                mapper.mapRoleToModel(role);

        // Then
        assertThat(result)
                .isEqualTo(
                        ba.rs.udas.udas_member_management.model.ApplicationUser.RoleEnum
                                .READ_WRITE);
    }

    @Test
    @DisplayName("mapRoleToModel should map ADMIN correctly")
    void mapRoleToModel_givenAdminRole_whenMapped_thenReturnsModelRole() {
        // Given
        UserRole role = UserRole.ADMIN;

        // When
        ba.rs.udas.udas_member_management.model.ApplicationUser.RoleEnum result =
                mapper.mapRoleToModel(role);

        // Then
        assertThat(result)
                .isEqualTo(ba.rs.udas.udas_member_management.model.ApplicationUser.RoleEnum.ADMIN);
    }

    @Test
    @DisplayName("mapRoleToModel should return default when null")
    void mapRoleToModel_givenNullRole_whenMapped_thenReturnsDefaultRole() {
        // When
        ba.rs.udas.udas_member_management.model.ApplicationUser.RoleEnum result =
                mapper.mapRoleToModel(null);

        // Then
        assertThat(result)
                .isEqualTo(
                        ba.rs.udas.udas_member_management.model.ApplicationUser.RoleEnum.READ_ONLY);
    }

    @Test
    @DisplayName("mapRoleToEntity should return READ_ONLY when role is null")
    void mapRoleToEntity_givenNullRole_whenMapped_thenReturnsDefaultRole() {
        // When
        UserRole result = mapper.mapRoleToEntity(null);

        // Then
        assertThat(result).isEqualTo(UserRole.READ_ONLY);
    }

    @Test
    @DisplayName("toEntity should default active to true when request has null active")
    void toEntity_whenActiveIsNull_thenDefaultsToTrue() {
        // Given
        ApplicationUserRequest request =
                ApplicationUserRequest.builder()
                        .email("john@example.com")
                        .role(ApplicationUserRequest.RoleEnum.READ_ONLY)
                        .active(null)
                        .build();

        // When
        ApplicationUser result = mapper.toEntity(request);

        // Then
        assertThat(result.getActive()).isTrue();
    }

    @Test
    @DisplayName("toEntityFromModel should map all fields from model to entity")
    void toEntityFromModel_givenModel_whenMapped_thenReturnsEntity() {
        // Given
        ba.rs.udas.udas_member_management.model.ApplicationUser model =
                ApplicationUserFixtures.applicationUserModelJohn();

        // When
        ApplicationUser result = mapper.toEntityFromModel(model);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(model.getId());
        assertThat(result.getEmail()).isEqualTo(model.getEmail());
        assertThat(result.getName()).isEqualTo(model.getName());
        assertThat(result.getActive()).isEqualTo(model.getActive());
        assertThat(result.getCreatedAt()).isEqualTo(model.getCreatedAt());
    }

    @Test
    @DisplayName("mapRoleToEntityFromModel should map READ_ONLY correctly")
    void mapRoleToEntityFromModel_givenReadOnlyRole_whenMapped_thenReturnsEntityRole() {
        // When
        UserRole result =
                mapper.mapRoleToEntityFromModel(
                        ba.rs.udas.udas_member_management.model.ApplicationUser.RoleEnum.READ_ONLY);

        // Then
        assertThat(result).isEqualTo(UserRole.READ_ONLY);
    }

    @Test
    @DisplayName("mapRoleToEntityFromModel should map READ_WRITE correctly")
    void mapRoleToEntityFromModel_givenReadWriteRole_whenMapped_thenReturnsEntityRole() {
        // When
        UserRole result =
                mapper.mapRoleToEntityFromModel(
                        ba.rs.udas.udas_member_management.model.ApplicationUser.RoleEnum
                                .READ_WRITE);

        // Then
        assertThat(result).isEqualTo(UserRole.READ_WRITE);
    }

    @Test
    @DisplayName("mapRoleToEntityFromModel should map ADMIN correctly")
    void mapRoleToEntityFromModel_givenAdminRole_whenMapped_thenReturnsEntityRole() {
        // When
        UserRole result =
                mapper.mapRoleToEntityFromModel(
                        ba.rs.udas.udas_member_management.model.ApplicationUser.RoleEnum.ADMIN);

        // Then
        assertThat(result).isEqualTo(UserRole.ADMIN);
    }

    @Test
    @DisplayName("mapRoleToEntityFromModel should return READ_ONLY when role is null")
    void mapRoleToEntityFromModel_givenNullRole_whenMapped_thenReturnsDefaultRole() {
        // When
        UserRole result = mapper.mapRoleToEntityFromModel(null);

        // Then
        assertThat(result).isEqualTo(UserRole.READ_ONLY);
    }
}

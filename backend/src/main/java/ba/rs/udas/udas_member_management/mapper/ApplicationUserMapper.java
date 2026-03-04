package ba.rs.udas.udas_member_management.mapper;

import ba.rs.udas.udas_member_management.entity.ApplicationUser;
import ba.rs.udas.udas_member_management.entity.UserRole;
import ba.rs.udas.udas_member_management.model.ApplicationUserRequest;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface ApplicationUserMapper {

    default ApplicationUser toEntity(ApplicationUserRequest request) {
        ApplicationUser entity = new ApplicationUser();
        entity.setEmail(request.getEmail());
        entity.setRole(mapRoleToEntity(request.getRole()));
        entity.setActive(request.getActive() != null ? request.getActive() : true);
        return entity;
    }

    default ApplicationUser toEntityFromModel(ba.rs.udas.udas_member_management.model.ApplicationUser model) {
        ApplicationUser entity = new ApplicationUser();
        entity.setId(model.getId());
        entity.setEmail(model.getEmail());
        entity.setName(model.getName());
        entity.setRole(mapRoleToEntityFromModel(model.getRole()));
        entity.setActive(model.getActive());
        entity.setCreatedAt(model.getCreatedAt());
        return entity;
    }

    default ba.rs.udas.udas_member_management.model.ApplicationUser toModel(ApplicationUser entity) {
        if (entity == null) return null;
        return ba.rs.udas.udas_member_management.model.ApplicationUser.builder()
                .id(entity.getId())
                .email(entity.getEmail())
                .name(entity.getName())
                .role(mapRoleToModel(entity.getRole()))
                .active(entity.getActive())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    default UserRole mapRoleToEntity(ApplicationUserRequest.RoleEnum role) {
        if (role == null) return UserRole.READ_ONLY;
        return switch (role) {
            case READ_ONLY -> UserRole.READ_ONLY;
            case READ_WRITE -> UserRole.READ_WRITE;
            case ADMIN -> UserRole.ADMIN;
        };
    }

    default UserRole mapRoleToEntityFromModel(ba.rs.udas.udas_member_management.model.ApplicationUser.RoleEnum role) {
        if (role == null) return UserRole.READ_ONLY;
        return switch (role) {
            case READ_ONLY -> UserRole.READ_ONLY;
            case READ_WRITE -> UserRole.READ_WRITE;
            case ADMIN -> UserRole.ADMIN;
        };
    }

    default ba.rs.udas.udas_member_management.model.ApplicationUser.RoleEnum mapRoleToModel(UserRole role) {
        if (role == null) return ba.rs.udas.udas_member_management.model.ApplicationUser.RoleEnum.READ_ONLY;
        return switch (role) {
            case READ_ONLY -> ba.rs.udas.udas_member_management.model.ApplicationUser.RoleEnum.READ_ONLY;
            case READ_WRITE -> ba.rs.udas.udas_member_management.model.ApplicationUser.RoleEnum.READ_WRITE;
            case ADMIN -> ba.rs.udas.udas_member_management.model.ApplicationUser.RoleEnum.ADMIN;
        };
    }
}

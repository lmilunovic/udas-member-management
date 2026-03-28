package ba.rs.udas.udas_member_management.controller;

import ba.rs.udas.udas_member_management.api.UsersApi;
import ba.rs.udas.udas_member_management.entity.ApplicationUser;
import ba.rs.udas.udas_member_management.mapper.ApplicationUserMapper;
import ba.rs.udas.udas_member_management.model.ApplicationUserRequest;
import ba.rs.udas.udas_member_management.model.PagedApplicationUser;
import ba.rs.udas.udas_member_management.service.ApplicationUserService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class ApplicationUserController implements UsersApi {

    private final ApplicationUserService userService;
    private final ApplicationUserMapper userMapper;

    public ApplicationUserController(
            ApplicationUserService userService, ApplicationUserMapper userMapper) {
        this.userService = userService;
        this.userMapper = userMapper;
    }

    @Override
    public ResponseEntity<ba.rs.udas.udas_member_management.model.ApplicationUser>
            getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }
        if (!(auth.getPrincipal() instanceof OidcUser oidcUser)) {
            return ResponseEntity.status(401).build();
        }
        return userService
                .findByEmail(oidcUser.getEmail())
                .map(user -> ResponseEntity.ok(userMapper.toModel(user)))
                .orElse(ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<ba.rs.udas.udas_member_management.model.ApplicationUser> createUser(
            @Valid ApplicationUserRequest applicationUserRequest) {
        ApplicationUser created = userService.createUser(applicationUserRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(userMapper.toModel(created));
    }

    @Override
    public ResponseEntity<Void> deleteUser(UUID id) {
        boolean deleted = userService.deleteUser(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @Override
    public ResponseEntity<ba.rs.udas.udas_member_management.model.ApplicationUser> getUser(
            UUID id) {
        return userService
                .findById(id)
                .map(user -> ResponseEntity.ok(userMapper.toModel(user)))
                .orElse(ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<PagedApplicationUser> listUsers() {
        List<ApplicationUser> users = userService.findAll();

        PagedApplicationUser paged =
                PagedApplicationUser.builder()
                        .content(users.stream().map(userMapper::toModel).toList())
                        .page(0)
                        .size(users.size())
                        .totalElements(users.size())
                        .totalPages(1)
                        .build();

        return ResponseEntity.ok(paged);
    }

    @Override
    public ResponseEntity<ba.rs.udas.udas_member_management.model.ApplicationUser> updateUser(
            UUID id, @Valid ApplicationUserRequest applicationUserRequest) {
        ApplicationUser updated = userService.updateUser(id, applicationUserRequest);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(userMapper.toModel(updated));
    }
}

package ba.rs.udas.udas_member_management.service;

import ba.rs.udas.udas_member_management.entity.ApplicationUser;
import ba.rs.udas.udas_member_management.entity.UserRole;
import ba.rs.udas.udas_member_management.mapper.ApplicationUserMapper;
import ba.rs.udas.udas_member_management.model.ApplicationUserRequest;
import ba.rs.udas.udas_member_management.repository.ApplicationUserRepository;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class ApplicationUserService {

    private final ApplicationUserRepository userRepository;
    private final ApplicationUserMapper userMapper;

    public ApplicationUserService(
            ApplicationUserRepository userRepository, ApplicationUserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    public ApplicationUser createUser(ApplicationUserRequest request) {
        ApplicationUser entity = userMapper.toEntity(request);
        entity.setId(UUID.randomUUID());
        entity.setCreatedAt(OffsetDateTime.now());
        entity.setActive(request.getActive() != null ? request.getActive() : true);

        ApplicationUser saved = userRepository.save(entity);
        return saved;
    }

    public List<ApplicationUser> findAll() {
        return userRepository.findAll();
    }

    public Optional<ApplicationUser> findById(UUID id) {
        return userRepository.findById(id);
    }

    public Optional<ApplicationUser> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public ApplicationUser updateUser(UUID id, ApplicationUserRequest request) {
        return userRepository
                .findById(id)
                .map(
                        existing -> {
                            existing.setRole(userMapper.mapRoleToEntity(request.getRole()));
                            if (request.getActive() != null) {
                                existing.setActive(request.getActive());
                            }
                            return userRepository.save(existing);
                        })
                .orElse(null);
    }

    public boolean deleteUser(UUID id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public ApplicationUser updateUserFromOAuth(String email, String name, String googleId) {
        return userRepository
                .findByEmail(email)
                .map(
                        existing -> {
                            existing.setName(name);
                            existing.setGoogleId(googleId);
                            return userRepository.save(existing);
                        })
                .orElse(null);
    }

    public ApplicationUser createUserFromOAuth(ApplicationUser user) {
        return userRepository.save(user);
    }

    public ApplicationUser createAdminUser(String email) {
        ApplicationUser admin =
                ApplicationUser.builder()
                        .id(UUID.randomUUID())
                        .email(email)
                        .name(email.split("@")[0])
                        .role(UserRole.ADMIN)
                        .active(true)
                        .createdAt(OffsetDateTime.now())
                        .build();
        return userRepository.save(admin);
    }
}

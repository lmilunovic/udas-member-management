package ba.rs.udas.udas_member_management.repository;

import ba.rs.udas.udas_member_management.entity.ApplicationUser;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ApplicationUserRepository extends JpaRepository<ApplicationUser, UUID> {
    Optional<ApplicationUser> findByEmail(String email);

    boolean existsByEmail(String email);
}

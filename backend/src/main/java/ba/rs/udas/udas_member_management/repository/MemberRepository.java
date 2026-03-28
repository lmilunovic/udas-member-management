package ba.rs.udas.udas_member_management.repository;

import ba.rs.udas.udas_member_management.entity.MemberEntity;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MemberRepository extends JpaRepository<MemberEntity, UUID> {}

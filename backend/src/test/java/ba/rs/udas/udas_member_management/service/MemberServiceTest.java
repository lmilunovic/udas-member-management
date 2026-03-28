package ba.rs.udas.udas_member_management.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import ba.rs.udas.udas_member_management.fixtures.MemberFixtures;
import ba.rs.udas.udas_member_management.mapper.MemberMapper;
import ba.rs.udas.udas_member_management.model.Member;
import ba.rs.udas.udas_member_management.repository.MemberRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@DisplayName("MemberService operations")
@ExtendWith(MockitoExtension.class)
class MemberServiceTest {

    @Mock private MemberRepository memberRepository;

    @Mock private MemberMapper memberMapper;

    @InjectMocks private MemberService memberService;

    @Test
    @DisplayName("createMember should save and return member")
    void createMember_givenValidMember_whenRepositorySaves_thenReturnsMember() {
        // Given
        Member member = MemberFixtures.memberJohn();
        var entity = MemberFixtures.memberEntityJohn();
        when(memberMapper.toEntity(member)).thenReturn(entity);
        when(memberRepository.save(entity)).thenReturn(entity);
        when(memberMapper.toModel(entity)).thenReturn(member);

        // When
        Member result = memberService.createMember(member);

        // Then
        assertThat(result).isNotNull();
        verify(memberRepository).save(entity);
    }

    @Test
    @DisplayName("getMember should return member when found")
    void getMember_givenExistingId_whenFound_thenReturnsMember() {
        // Given
        UUID id = UUID.randomUUID();
        var entity = MemberFixtures.memberEntityJohn();
        when(memberRepository.findById(id)).thenReturn(Optional.of(entity));
        when(memberMapper.toModel(entity)).thenReturn(MemberFixtures.memberJohn());

        // When
        Member result = memberService.getMember(id);

        // Then
        assertThat(result).isNotNull();
    }

    @Test
    @DisplayName("getMember should return null when not found")
    void getMember_givenNonExistingId_whenNotFound_thenReturnsNull() {
        // Given
        UUID id = UUID.randomUUID();
        when(memberRepository.findById(id)).thenReturn(Optional.empty());

        // When
        Member result = memberService.getMember(id);

        // Then
        assertThat(result).isNull();
    }

    @Test
    @DisplayName("findAll should return all members")
    void findAll_whenCalled_thenReturnsAllMembers() {
        // Given
        var entity = MemberFixtures.memberEntityJohn();
        when(memberRepository.findAll()).thenReturn(List.of(entity));
        when(memberMapper.toModel(entity)).thenReturn(MemberFixtures.memberJohn());

        // When
        List<Member> result = memberService.findAll();

        // Then
        assertThat(result).hasSize(1);
    }

    @Test
    @DisplayName("updateMember should update and return member when found")
    void updateMember_givenExistingId_whenFound_thenUpdatesAndReturnsMember() {
        // Given
        UUID id = UUID.randomUUID();
        Member member = MemberFixtures.memberJohn();
        var existingEntity = MemberFixtures.memberEntityJohn();
        var updatedEntity = MemberFixtures.memberEntityJohn();

        when(memberRepository.findById(id)).thenReturn(Optional.of(existingEntity));
        when(memberMapper.toEntity(member)).thenReturn(updatedEntity);
        when(memberRepository.save(any())).thenReturn(updatedEntity);
        when(memberMapper.toModel(updatedEntity)).thenReturn(member);

        // When
        Member result = memberService.updateMember(id, member);

        // Then
        assertThat(result).isNotNull();
        verify(memberRepository).save(any());
    }

    @Test
    @DisplayName("updateMember should return null when not found")
    void updateMember_givenNonExistingId_whenNotFound_thenReturnsNull() {
        // Given
        UUID id = UUID.randomUUID();
        Member member = MemberFixtures.memberJohn();
        when(memberRepository.findById(id)).thenReturn(Optional.empty());

        // When
        Member result = memberService.updateMember(id, member);

        // Then
        assertThat(result).isNull();
    }

    @Test
    @DisplayName("deleteMember should return true and call deleteById when member exists")
    void deleteMember_whenExists_thenDeletesAndReturnsTrue() {
        // Given
        UUID id = UUID.randomUUID();
        when(memberRepository.existsById(id)).thenReturn(true);
        doNothing().when(memberRepository).deleteById(id);

        // When
        boolean result = memberService.deleteMember(id);

        // Then
        assertThat(result).isTrue();
        verify(memberRepository).deleteById(id);
    }

    @Test
    @DisplayName("deleteMember should return false and skip deleteById when member not found")
    void deleteMember_whenNotFound_thenReturnsFalse() {
        // Given
        UUID id = UUID.randomUUID();
        when(memberRepository.existsById(id)).thenReturn(false);

        // When
        boolean result = memberService.deleteMember(id);

        // Then
        assertThat(result).isFalse();
        verify(memberRepository, never()).deleteById(any());
    }
}

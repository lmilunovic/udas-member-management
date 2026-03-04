package ba.rs.udas.udas_member_management.service;

import ba.rs.udas.udas_member_management.fixtures.MemberFixtures;
import ba.rs.udas.udas_member_management.mapper.MemberMapper;
import ba.rs.udas.udas_member_management.model.Member;
import ba.rs.udas.udas_member_management.repository.MemberRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@DisplayName("MemberService operations")
@ExtendWith(MockitoExtension.class)
class MemberServiceTest {

    @Mock
    private MemberRepository memberRepository;

    @Mock
    private MemberMapper memberMapper;

    @InjectMocks
    private MemberService memberService;

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
    @DisplayName("deleteMember should call repository deleteById")
    void deleteMember_whenCalled_thenDeletesById() {
        // Given
        UUID id = UUID.randomUUID();
        doNothing().when(memberRepository).deleteById(id);

        // When
        memberService.deleteMember(id);

        // Then
        verify(memberRepository).deleteById(id);
    }
}

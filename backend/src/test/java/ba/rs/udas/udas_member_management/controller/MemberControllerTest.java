package ba.rs.udas.udas_member_management.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import ba.rs.udas.udas_member_management.fixtures.MemberFixtures;
import ba.rs.udas.udas_member_management.model.Member;
import ba.rs.udas.udas_member_management.model.PagedMember;
import ba.rs.udas.udas_member_management.service.MemberService;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@DisplayName("MemberController operations")
@ExtendWith(MockitoExtension.class)
class MemberControllerTest {

    @Mock private MemberService memberService;

    @InjectMocks private MemberController controller;

    @Test
    @DisplayName("listMembers should return 200 with paginated list")
    void listMembers_whenCalled_thenReturns200WithPaginatedList() {
        // Given
        Member member = MemberFixtures.memberJohn();
        when(memberService.findAll()).thenReturn(List.of(member));

        // When
        ResponseEntity<PagedMember> result =
                controller.listMembers(null, null, null, null, null, null, null, null, null);

        // Then
        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(result.getBody()).isNotNull();
        assertThat(result.getBody().getContent()).hasSize(1);
        assertThat(result.getBody().getContent().get(0).getFirstName()).isEqualTo("John");
    }

    @Test
    @DisplayName("createMember should return 201 with created member")
    void createMember_givenValidRequest_whenCalled_thenReturns201() {
        // Given
        Member member = MemberFixtures.memberJohn();
        when(memberService.createMember(any(Member.class))).thenReturn(member);

        // When
        ResponseEntity<Member> result = controller.createMember(member);

        // Then
        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(result.getBody()).isNotNull();
        assertThat(result.getBody().getFirstName()).isEqualTo("John");
    }

    @Test
    @DisplayName("getMember should return 200 when found")
    void getMember_givenExistingId_whenFound_thenReturns200() {
        // Given
        UUID id = UUID.randomUUID();
        Member member = MemberFixtures.memberJohn();
        when(memberService.getMember(id)).thenReturn(member);

        // When
        ResponseEntity<Member> result = controller.getMember(id);

        // Then
        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(result.getBody()).isNotNull();
        assertThat(result.getBody().getFirstName()).isEqualTo("John");
    }

    @Test
    @DisplayName("getMember should return 404 when not found")
    void getMember_givenNonExistingId_whenNotFound_thenReturns404() {
        // Given
        UUID id = UUID.randomUUID();
        when(memberService.getMember(id)).thenReturn(null);

        // When
        ResponseEntity<Member> result = controller.getMember(id);

        // Then
        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    @DisplayName("updateMember should return 200 when updated")
    void updateMember_givenExistingId_whenUpdated_thenReturns200() {
        // Given
        UUID id = UUID.randomUUID();
        Member member = MemberFixtures.memberJohn();
        when(memberService.updateMember(any(UUID.class), any(Member.class))).thenReturn(member);

        // When
        ResponseEntity<Member> result = controller.updateMember(id, member);

        // Then
        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(result.getBody()).isNotNull();
        assertThat(result.getBody().getFirstName()).isEqualTo("John");
    }

    @Test
    @DisplayName("updateMember should return 404 when not found")
    void updateMember_givenNonExistingId_whenNotFound_thenReturns404() {
        // Given
        UUID id = UUID.randomUUID();
        Member member = MemberFixtures.memberJohn();
        when(memberService.updateMember(any(UUID.class), any(Member.class))).thenReturn(null);

        // When
        ResponseEntity<Member> result = controller.updateMember(id, member);

        // Then
        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    @DisplayName("deleteMember should return 204")
    void deleteMember_whenCalled_thenReturns204() {
        // Given
        UUID id = UUID.randomUUID();
        when(memberService.deleteMember(id)).thenReturn(true);

        // When
        ResponseEntity<Void> result = controller.deleteMember(id);

        // Then
        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        verify(memberService).deleteMember(id);
    }
}

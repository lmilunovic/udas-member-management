package ba.rs.udas.udas_member_management.controller;

import ba.rs.udas.udas_member_management.fixtures.MemberFixtures;
import ba.rs.udas.udas_member_management.model.Member;
import ba.rs.udas.udas_member_management.model.PagedMember;
import ba.rs.udas.udas_member_management.service.MemberService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@DisplayName("MemberController HTTP endpoints")
@WebMvcTest(MemberController.class)
class MemberControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private MemberService memberService;

    @Test
    @DisplayName("GET /api/v1/members should return 200 with paginated list")
    void listMembers_whenCalled_thenReturns200WithPaginatedList() throws Exception {
        // Given
        Member member = MemberFixtures.memberJohn();
        PagedMember pagedMember = PagedMember.builder()
                .content(List.of(member))
                .page(0)
                .size(20)
                .totalElements(1)
                .totalPages(1)
                .build();
        when(memberService.findAll()).thenReturn(List.of(member));

        // When & Then
        mockMvc.perform(get("/api/v1/members"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content[0].firstName").value("John"))
                .andExpect(jsonPath("$.page").value(0))
                .andExpect(jsonPath("$.size").value(20));
    }

    @Test
    @DisplayName("POST /api/v1/members should return 201 with created member")
    void createMember_givenValidRequest_whenCalled_thenReturns201() throws Exception {
        // Given
        Member member = MemberFixtures.memberJohn();
        when(memberService.createMember(any(Member.class))).thenReturn(member);

        // When & Then
        mockMvc.perform(post("/api/v1/members")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {
                                "firstName": "John",
                                "lastName": "Doe",
                                "email": ["john@example.com"]
                            }
                            """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.firstName").value("John"))
                .andExpect(jsonPath("$.lastName").value("Doe"));
    }

    @Test
    @DisplayName("GET /api/v1/members/{id} should return 200 when found")
    void getMember_givenExistingId_whenFound_thenReturns200() throws Exception {
        // Given
        UUID id = UUID.randomUUID();
        Member member = MemberFixtures.memberJohn();
        when(memberService.getMember(id)).thenReturn(member);

        // When & Then
        mockMvc.perform(get("/api/v1/members/" + id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value("John"))
                .andExpect(jsonPath("$.lastName").value("Doe"));
    }

    @Test
    @DisplayName("GET /api/v1/members/{id} should return 404 when not found")
    void getMember_givenNonExistingId_whenNotFound_thenReturns404() throws Exception {
        // Given
        UUID id = UUID.randomUUID();
        when(memberService.getMember(id)).thenReturn(null);

        // When & Then
        mockMvc.perform(get("/api/v1/members/" + id))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("PUT /api/v1/members/{id} should return 200 when updated")
    void updateMember_givenExistingId_whenUpdated_thenReturns200() throws Exception {
        // Given
        UUID id = UUID.randomUUID();
        Member member = MemberFixtures.memberJohn();
        when(memberService.updateMember(any(UUID.class), any(Member.class))).thenReturn(member);

        // When & Then
        mockMvc.perform(put("/api/v1/members/" + id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {
                                "firstName": "John",
                                "lastName": "Doe",
                                "email": ["john@example.com"]
                            }
                            """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value("John"));
    }

    @Test
    @DisplayName("PUT /api/v1/members/{id} should return 404 when not found")
    void updateMember_givenNonExistingId_whenNotFound_thenReturns404() throws Exception {
        // Given
        UUID id = UUID.randomUUID();
        when(memberService.updateMember(any(UUID.class), any(Member.class))).thenReturn(null);

        // When & Then
        mockMvc.perform(put("/api/v1/members/" + id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {
                                "firstName": "John",
                                "lastName": "Doe"
                            }
                            """))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("DELETE /api/v1/members/{id} should return 204")
    void deleteMember_whenCalled_thenReturns204() throws Exception {
        // Given
        UUID id = UUID.randomUUID();
        doNothing().when(memberService).deleteMember(id);

        // When & Then
        mockMvc.perform(delete("/api/v1/members/" + id))
                .andExpect(status().isNoContent());
    }
}

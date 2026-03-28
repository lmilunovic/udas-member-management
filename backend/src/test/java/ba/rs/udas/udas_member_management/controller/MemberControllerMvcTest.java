package ba.rs.udas.udas_member_management.controller;

import ba.rs.udas.udas_member_management.configuration.SecurityConfig;
import ba.rs.udas.udas_member_management.fixtures.MemberFixtures;
import ba.rs.udas.udas_member_management.model.Member;
import ba.rs.udas.udas_member_management.service.CustomOidcUserService;
import ba.rs.udas.udas_member_management.service.MemberService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@DisplayName("MemberController — HTTP layer tests")
@WebMvcTest(MemberController.class)
@Import(SecurityConfig.class)
@TestPropertySource(properties = {
        "app.frontend-url=http://localhost:5173",
        "spring.security.oauth2.client.registration.google.client-id=test-client-id",
        "spring.security.oauth2.client.registration.google.client-secret=test-client-secret"
})
class MemberControllerMvcTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @MockBean
    MemberService memberService;

    @MockBean
    CustomOidcUserService customOidcUserService;

    // --- Authentication / Authorization ---

    @Test
    @DisplayName("GET /api/v1/members without authentication returns 401")
    void listMembers_whenUnauthenticated_returns401() throws Exception {
        mockMvc.perform(get("/api/v1/members"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("POST /api/v1/members with READ_ONLY role returns 403")
    @WithMockUser(roles = "READ_ONLY")
    void createMember_whenReadOnly_returns403() throws Exception {
        mockMvc.perform(post("/api/v1/members")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(MemberFixtures.memberJohn())))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("DELETE /api/v1/members/{id} with READ_ONLY role returns 403")
    @WithMockUser(roles = "READ_ONLY")
    void deleteMember_whenReadOnly_returns403() throws Exception {
        mockMvc.perform(delete("/api/v1/members/{id}", UUID.randomUUID()))
                .andExpect(status().isForbidden());
    }

    // --- CRUD happy paths ---

    @Test
    @DisplayName("GET /api/v1/members with READ_ONLY role returns 200 with paginated list")
    @WithMockUser(roles = "READ_ONLY")
    void listMembers_whenReadOnly_returns200() throws Exception {
        given(memberService.findAll()).willReturn(List.of(MemberFixtures.memberJohn()));

        mockMvc.perform(get("/api/v1/members"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].firstName").value("John"))
                .andExpect(jsonPath("$.totalElements").value(1));
    }

    @Test
    @DisplayName("POST /api/v1/members with READ_WRITE role returns 201")
    @WithMockUser(roles = "READ_WRITE")
    void createMember_whenReadWrite_returns201() throws Exception {
        Member member = MemberFixtures.memberJohn();
        given(memberService.createMember(any(Member.class))).willReturn(member);

        mockMvc.perform(post("/api/v1/members")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(member)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.firstName").value("John"));
    }

    @Test
    @DisplayName("GET /api/v1/members/{id} with existing ID returns 200")
    @WithMockUser(roles = "READ_ONLY")
    void getMember_whenExists_returns200() throws Exception {
        UUID id = UUID.randomUUID();
        given(memberService.getMember(id)).willReturn(MemberFixtures.memberJohn());

        mockMvc.perform(get("/api/v1/members/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value("John"));
    }

    @Test
    @DisplayName("GET /api/v1/members/{id} when not found returns 404")
    @WithMockUser(roles = "READ_ONLY")
    void getMember_whenNotFound_returns404() throws Exception {
        UUID id = UUID.randomUUID();
        given(memberService.getMember(id)).willReturn(null);

        mockMvc.perform(get("/api/v1/members/{id}", id))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("PUT /api/v1/members/{id} with READ_WRITE role returns 200")
    @WithMockUser(roles = "READ_WRITE")
    void updateMember_whenReadWrite_returns200() throws Exception {
        UUID id = UUID.randomUUID();
        Member member = MemberFixtures.memberJohn();
        given(memberService.updateMember(eq(id), any(Member.class))).willReturn(member);

        mockMvc.perform(put("/api/v1/members/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(member)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value("John"));
    }

    @Test
    @DisplayName("PUT /api/v1/members/{id} when not found returns 404")
    @WithMockUser(roles = "READ_WRITE")
    void updateMember_whenNotFound_returns404() throws Exception {
        UUID id = UUID.randomUUID();
        given(memberService.updateMember(eq(id), any(Member.class))).willReturn(null);

        mockMvc.perform(put("/api/v1/members/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(MemberFixtures.memberJohn())))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("DELETE /api/v1/members/{id} when found returns 204")
    @WithMockUser(roles = "ADMIN")
    void deleteMember_whenExists_returns204() throws Exception {
        UUID id = UUID.randomUUID();
        given(memberService.deleteMember(id)).willReturn(true);

        mockMvc.perform(delete("/api/v1/members/{id}", id))
                .andExpect(status().isNoContent());

        then(memberService).should().deleteMember(id);
    }

    @Test
    @DisplayName("DELETE /api/v1/members/{id} when not found returns 404 (Bug 3 fix)")
    @WithMockUser(roles = "ADMIN")
    void deleteMember_whenNotFound_returns404() throws Exception {
        UUID id = UUID.randomUUID();
        given(memberService.deleteMember(id)).willReturn(false);

        mockMvc.perform(delete("/api/v1/members/{id}", id))
                .andExpect(status().isNotFound());
    }

    // --- Validation / GlobalExceptionHandler ---

    @Test
    @DisplayName("POST /api/v1/members with invalid email format returns 400")
    @WithMockUser(roles = "READ_WRITE")
    void createMember_whenEmailIsInvalid_returns400() throws Exception {
        // The Member model uses @lombok.NonNull (not Bean Validation @NotNull), so only
        // the @Email constraint on list items is enforced at the @Valid layer.
        String bodyWithInvalidEmail = """
                {
                    "firstName": "John",
                    "lastName": "Doe",
                    "email": ["not-a-valid-email"]
                }
                """;

        mockMvc.perform(post("/api/v1/members")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(bodyWithInvalidEmail))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.title").value("Bad Request"));
    }

    @Test
    @DisplayName("POST /api/v1/members with service throwing IllegalArgumentException returns 400")
    @WithMockUser(roles = "READ_WRITE")
    void createMember_whenServiceThrowsIllegalArgument_returns400() throws Exception {
        given(memberService.createMember(any(Member.class)))
                .willThrow(new IllegalArgumentException("Duplicate email"));

        mockMvc.perform(post("/api/v1/members")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(MemberFixtures.memberJohn())))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.detail").value("Duplicate email"));
    }

    // --- In-memory filter logic ---

    @Test
    @DisplayName("GET /api/v1/members?firstName=John filters results by first name")
    @WithMockUser(roles = "READ_ONLY")
    void listMembers_withFirstNameFilter_returnsOnlyMatchingMembers() throws Exception {
        given(memberService.findAll()).willReturn(
                List.of(MemberFixtures.memberJohn(), MemberFixtures.memberJane()));

        mockMvc.perform(get("/api/v1/members").param("firstName", "John"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalElements").value(1))
                .andExpect(jsonPath("$.content[0].firstName").value("John"));
    }
}

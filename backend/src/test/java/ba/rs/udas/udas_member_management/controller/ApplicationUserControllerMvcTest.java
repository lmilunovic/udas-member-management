package ba.rs.udas.udas_member_management.controller;

import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.oidcLogin;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import ba.rs.udas.udas_member_management.configuration.SecurityConfig;
import ba.rs.udas.udas_member_management.fixtures.ApplicationUserFixtures;
import ba.rs.udas.udas_member_management.mapper.ApplicationUserMapper;
import ba.rs.udas.udas_member_management.service.ApplicationUserService;
import ba.rs.udas.udas_member_management.service.CustomOidcUserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

@DisplayName("ApplicationUserController — HTTP layer tests")
@WebMvcTest(ApplicationUserController.class)
@Import(SecurityConfig.class)
@TestPropertySource(
        properties = {
            "app.frontend-url=http://localhost:5173",
            "spring.security.oauth2.client.registration.google.client-id=test-client-id",
            "spring.security.oauth2.client.registration.google.client-secret=test-client-secret"
        })
class ApplicationUserControllerMvcTest {

    @Autowired MockMvc mockMvc;

    @Autowired ObjectMapper objectMapper;

    @MockBean ApplicationUserService userService;

    @MockBean ApplicationUserMapper userMapper;

    @MockBean CustomOidcUserService customOidcUserService;

    // --- Authentication / Authorization ---

    @Test
    @DisplayName("GET /api/v1/users without authentication returns 401")
    void listUsers_whenUnauthenticated_returns401() throws Exception {
        mockMvc.perform(get("/api/v1/users")).andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("GET /api/v1/users with READ_WRITE role returns 403 (admin only)")
    @WithMockUser(roles = "READ_WRITE")
    void listUsers_whenReadWrite_returns403() throws Exception {
        mockMvc.perform(get("/api/v1/users")).andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("GET /api/v1/users with READ_ONLY role returns 403 (admin only)")
    @WithMockUser(roles = "READ_ONLY")
    void listUsers_whenReadOnly_returns403() throws Exception {
        mockMvc.perform(get("/api/v1/users")).andExpect(status().isForbidden());
    }

    // --- CRUD happy paths ---

    @Test
    @DisplayName("GET /api/v1/users with ADMIN role returns 200 with paginated list")
    @WithMockUser(roles = "ADMIN")
    void listUsers_whenAdmin_returns200() throws Exception {
        var admin = ApplicationUserFixtures.applicationUserAdmin();
        given(userService.findAll()).willReturn(List.of(admin));
        given(userMapper.toModel(admin))
                .willReturn(ApplicationUserFixtures.applicationUserModelJohn());

        mockMvc.perform(get("/api/v1/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalElements").value(1));
    }

    @Test
    @DisplayName("GET /api/v1/users/{id} with ADMIN role returns 200 when found")
    @WithMockUser(roles = "ADMIN")
    void getUser_whenAdmin_andExists_returns200() throws Exception {
        UUID id = UUID.randomUUID();
        var user = ApplicationUserFixtures.applicationUserAdmin();
        given(userService.findById(id)).willReturn(Optional.of(user));
        given(userMapper.toModel(user))
                .willReturn(ApplicationUserFixtures.applicationUserModelJohn());

        mockMvc.perform(get("/api/v1/users/{id}", id)).andExpect(status().isOk());
    }

    @Test
    @DisplayName("GET /api/v1/users/{id} with ADMIN role returns 404 when not found")
    @WithMockUser(roles = "ADMIN")
    void getUser_whenAdmin_andNotFound_returns404() throws Exception {
        UUID id = UUID.randomUUID();
        given(userService.findById(id)).willReturn(Optional.empty());

        mockMvc.perform(get("/api/v1/users/{id}", id)).andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("DELETE /api/v1/users/{id} with ADMIN role returns 204 when found")
    @WithMockUser(roles = "ADMIN")
    void deleteUser_whenAdmin_andExists_returns204() throws Exception {
        UUID id = UUID.randomUUID();
        given(userService.deleteUser(id)).willReturn(true);

        mockMvc.perform(delete("/api/v1/users/{id}", id)).andExpect(status().isNoContent());

        then(userService).should().deleteUser(id);
    }

    @Test
    @DisplayName("DELETE /api/v1/users/{id} with ADMIN role returns 404 when not found")
    @WithMockUser(roles = "ADMIN")
    void deleteUser_whenAdmin_andNotFound_returns404() throws Exception {
        UUID id = UUID.randomUUID();
        given(userService.deleteUser(id)).willReturn(false);

        mockMvc.perform(delete("/api/v1/users/{id}", id)).andExpect(status().isNotFound());
    }

    // --- getCurrentUser endpoint ---

    @Test
    @DisplayName("GET /api/v1/users/me with OIDC login returns 200")
    void getCurrentUser_withOidcLogin_returns200() throws Exception {
        var user = ApplicationUserFixtures.applicationUserAdmin();
        given(userService.findByEmail("admin@example.com")).willReturn(Optional.of(user));
        given(userMapper.toModel(user))
                .willReturn(ApplicationUserFixtures.applicationUserModelJohn());

        mockMvc.perform(
                        get("/api/v1/users/me")
                                .with(
                                        oidcLogin()
                                                .idToken(
                                                        token ->
                                                                token.subject("google-sub-123")
                                                                        .claim(
                                                                                "email",
                                                                                "admin@example.com"))))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("GET /api/v1/users/me with non-OIDC user returns 401 (Bug 2 fix)")
    @WithMockUser(roles = "ADMIN")
    void getCurrentUser_withNonOidcPrincipal_returns401() throws Exception {
        // @WithMockUser sets a UsernamePasswordAuthenticationToken with a User principal,
        // not an OidcUser. Before Bug 2 fix this threw ClassCastException -> 500.
        mockMvc.perform(get("/api/v1/users/me")).andExpect(status().isUnauthorized());
    }
}

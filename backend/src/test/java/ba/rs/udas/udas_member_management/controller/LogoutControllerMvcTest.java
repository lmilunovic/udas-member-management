package ba.rs.udas.udas_member_management.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import ba.rs.udas.udas_member_management.configuration.SecurityConfig;
import ba.rs.udas.udas_member_management.service.CustomOidcUserService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

@DisplayName("LogoutController — HTTP layer tests")
@WebMvcTest(LogoutController.class)
@Import(SecurityConfig.class)
@TestPropertySource(
        properties = {
            "app.frontend-url=http://localhost:5173",
            "spring.security.oauth2.client.registration.google.client-id=test-client-id",
            "spring.security.oauth2.client.registration.google.client-secret=test-client-secret"
        })
class LogoutControllerMvcTest {

    @Autowired MockMvc mockMvc;

    @MockBean CustomOidcUserService customOidcUserService;

    @Test
    @DisplayName(
            "GET /api/v1/auth/logout when authenticated returns 302 and redirects to login page")
    @WithMockUser
    void logout_whenAuthenticated_returns302WithLoginRedirect() throws Exception {
        mockMvc.perform(get("/api/v1/auth/logout"))
                .andExpect(status().isFound())
                .andExpect(header().string("Location", "http://localhost:5173/login?logout"));
    }

    @Test
    @DisplayName("GET /api/v1/auth/logout when unauthenticated returns 302 (endpoint is permitAll)")
    void logout_whenUnauthenticated_returns302() throws Exception {
        mockMvc.perform(get("/api/v1/auth/logout"))
                .andExpect(status().isFound())
                .andExpect(header().string("Location", "http://localhost:5173/login?logout"));
    }
}

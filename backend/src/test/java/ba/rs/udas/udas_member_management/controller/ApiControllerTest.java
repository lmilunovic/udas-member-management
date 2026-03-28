package ba.rs.udas.udas_member_management.controller;

import ba.rs.udas.udas_member_management.configuration.SecurityConfig;
import ba.rs.udas.udas_member_management.service.CustomOidcUserService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@DisplayName("ApiController — public health endpoints")
@WebMvcTest(ApiController.class)
@Import(SecurityConfig.class)
@TestPropertySource(properties = {
        "app.frontend-url=http://localhost:5173",
        "spring.security.oauth2.client.registration.google.client-id=test-client-id",
        "spring.security.oauth2.client.registration.google.client-secret=test-client-secret"
})
class ApiControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockBean
    CustomOidcUserService customOidcUserService;

    @Test
    @DisplayName("GET /api/v1 should return 200 without authentication")
    void root_whenUnauthenticated_returns200() throws Exception {
        mockMvc.perform(get("/api/v1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("running"));
    }

    @Test
    @DisplayName("GET /api/v1/health should return 200 without authentication")
    void health_whenUnauthenticated_returns200() throws Exception {
        mockMvc.perform(get("/api/v1/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"));
    }
}

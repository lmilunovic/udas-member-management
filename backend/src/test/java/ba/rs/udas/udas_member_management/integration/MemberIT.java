package ba.rs.udas.udas_member_management.integration;

import static org.assertj.core.api.Assertions.assertThat;

import ba.rs.udas.udas_member_management.config.TestContainersConfig;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.TestPropertySource;

@DisplayName("Member API Full Integration Tests")
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Import(TestContainersConfig.class)
@TestPropertySource(locations = "classpath:application-test.yaml")
class MemberIT {

    @LocalServerPort private int port;

    private TestRestTemplate restTemplate = new TestRestTemplate();

    @Test
    @DisplayName("POST /api/v1/members requires authentication — unauthenticated returns 401")
    void createMember_whenUnauthenticated_thenReturns401() {
        // Given
        String requestBody =
                """
            {
                "firstName": "John",
                "lastName": "Doe",
                "email": ["john@example.com"]
            }
            """;
        var headers = new org.springframework.http.HttpHeaders();
        headers.setContentType(org.springframework.http.MediaType.APPLICATION_JSON);
        var entity = new org.springframework.http.HttpEntity<>(requestBody, headers);

        // When
        var response =
                restTemplate.postForEntity(
                        "http://localhost:" + port + "/api/v1/members", entity, String.class);

        // Then
        assertThat(response.getStatusCode().value()).isEqualTo(401);
    }

    @Test
    @DisplayName("GET /api/v1/members requires authentication — unauthenticated returns 401")
    void listMembers_whenUnauthenticated_thenReturns401() {
        // When
        var response =
                restTemplate.getForEntity(
                        "http://localhost:" + port + "/api/v1/members", String.class);

        // Then
        assertThat(response.getStatusCode().value()).isEqualTo(401);
    }
}

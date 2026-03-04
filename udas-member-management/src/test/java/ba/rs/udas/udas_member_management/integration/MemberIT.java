package ba.rs.udas.udas_member_management.integration;

import ba.rs.udas.udas_member_management.config.TestContainersConfig;
import org.junit.jupiter.api.DisplayName;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.TestPropertySource;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("Member API Full Integration Tests")
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Import(TestContainersConfig.class)
@TestPropertySource(locations = "classpath:application-test.yaml")
class MemberIT {

    @LocalServerPort
    private int port;

    private TestRestTemplate restTemplate = new TestRestTemplate();

    @DisplayName("POST /api/v1/members should create and return member")
    void createMember_givenValidMember_whenCalled_thenCreatesAndReturnsMember() {
        // Given
        String requestBody = """
            {
                "firstName": "John",
                "lastName": "Doe",
                "email": ["john@example.com"]
            }
            """;

        // When
        var response = restTemplate.postForEntity(
                "http://localhost:" + port + "/api/v1/members",
                requestBody,
                String.class);

        // Then
        assertThat(response.getStatusCode().value()).isEqualTo(201);
        assertThat(response.getBody()).contains("\"firstName\":\"John\"");
        assertThat(response.getBody()).contains("\"lastName\":\"Doe\"");
        assertThat(response.getBody()).contains("\"id\":\"");
    }

    @DisplayName("GET /api/v1/members should return paginated list")
    void listMembers_whenCalled_thenReturnsPaginatedList() {
        // When
        var response = restTemplate.getForEntity(
                "http://localhost:" + port + "/api/v1/members?page=0&size=10",
                String.class);

        // Then
        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody()).contains("\"content\":[]");
        assertThat(response.getBody()).contains("\"page\":0");
        assertThat(response.getBody()).contains("\"size\":10");
    }
}

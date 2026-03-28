package ba.rs.udas.udas_member_management.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

@DisplayName("CustomOAuth2User")
class CustomOAuth2UserTest {

    @Test
    @DisplayName("getName() returns the email passed at construction")
    void getName_returnsEmail() {
        OAuth2User delegate = mock(OAuth2User.class);
        given(delegate.getAttributes()).willReturn(Map.of("email", "john@example.com"));

        CustomOAuth2User user = new CustomOAuth2User(
                delegate,
                "john@example.com",
                List.of(new SimpleGrantedAuthority("ROLE_READ_ONLY"))
        );

        assertThat(user.getName()).isEqualTo("john@example.com");
    }

    @Test
    @DisplayName("getEmail() returns the email passed at construction")
    void getEmail_returnsEmail() {
        OAuth2User delegate = mock(OAuth2User.class);
        given(delegate.getAttributes()).willReturn(Map.of("email", "john@example.com"));

        CustomOAuth2User user = new CustomOAuth2User(
                delegate,
                "john@example.com",
                List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
        );

        assertThat(user.getEmail()).isEqualTo("john@example.com");
    }

    @Test
    @DisplayName("getAuthorities() returns the authorities passed at construction")
    void getAuthorities_returnsProvidedAuthorities() {
        OAuth2User delegate = mock(OAuth2User.class);
        given(delegate.getAttributes()).willReturn(Map.of("email", "john@example.com"));

        var authorities = List.of(new SimpleGrantedAuthority("ROLE_READ_WRITE"));
        CustomOAuth2User user = new CustomOAuth2User(delegate, "john@example.com", authorities);

        assertThat(user.getAuthorities())
                .extracting("authority")
                .containsExactly("ROLE_READ_WRITE");
    }
}

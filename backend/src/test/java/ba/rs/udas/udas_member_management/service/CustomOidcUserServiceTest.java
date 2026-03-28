package ba.rs.udas.udas_member_management.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

import ba.rs.udas.udas_member_management.entity.ApplicationUser;
import ba.rs.udas.udas_member_management.entity.UserRole;
import ba.rs.udas.udas_member_management.fixtures.ApplicationUserFixtures;
import java.time.Instant;
import java.util.Map;
import java.util.Optional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.OidcIdToken;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;

@DisplayName("CustomOidcUserService")
@ExtendWith(MockitoExtension.class)
class CustomOidcUserServiceTest {

    @Mock ApplicationUserService userService;

    @Spy @InjectMocks CustomOidcUserService service;

    private OidcUser mockOidcUser(String email) {
        OidcUser oidcUser = mock(OidcUser.class);
        given(oidcUser.getEmail()).willReturn(email);
        given(oidcUser.getFullName()).willReturn("John Doe");
        given(oidcUser.getSubject()).willReturn("google-sub-123");
        return oidcUser;
    }

    @Test
    @DisplayName("loadUser — active user → returns OidcUser with correct role authority")
    void loadUser_whenUserExistsAndActive_returnsOidcUserWithAuthority() {
        OidcIdToken idToken =
                new OidcIdToken(
                        "token-value",
                        Instant.now(),
                        Instant.now().plusSeconds(3600),
                        Map.of("sub", "google-sub-123"));
        OidcUser oidcUser = mockOidcUser("john@example.com");
        given(oidcUser.getIdToken()).willReturn(idToken);
        given(oidcUser.getUserInfo()).willReturn(null);
        doReturn(oidcUser).when(service).fetchFromProvider(any());

        ApplicationUser dbUser = ApplicationUserFixtures.applicationUserJohn();
        dbUser.setRole(UserRole.READ_WRITE);
        dbUser.setActive(true);
        given(userService.findByEmail("john@example.com")).willReturn(Optional.of(dbUser));
        given(userService.updateUserFromOAuth(anyString(), anyString(), anyString()))
                .willReturn(dbUser);

        OidcUser result = service.loadUser(mock(OidcUserRequest.class));

        assertThat(result).isNotNull();
        assertThat(result.getAuthorities())
                .extracting("authority")
                .containsExactly("ROLE_READ_WRITE");
    }

    @Test
    @DisplayName("loadUser — email null → throws OAuth2AuthenticationException")
    void loadUser_whenEmailIsNull_throwsOAuth2AuthenticationException() {
        OidcUser oidcUser = mockOidcUser(null);
        doReturn(oidcUser).when(service).fetchFromProvider(any());

        assertThatThrownBy(() -> service.loadUser(mock(OidcUserRequest.class)))
                .isInstanceOf(OAuth2AuthenticationException.class);

        verify(userService, never()).findByEmail(anyString());
    }

    @Test
    @DisplayName("loadUser — user not in DB → throws OAuth2AuthenticationException")
    void loadUser_whenUserNotFound_throwsOAuth2AuthenticationException() {
        OidcUser oidcUser = mockOidcUser("unknown@example.com");
        doReturn(oidcUser).when(service).fetchFromProvider(any());
        given(userService.findByEmail("unknown@example.com")).willReturn(Optional.empty());

        assertThatThrownBy(() -> service.loadUser(mock(OidcUserRequest.class)))
                .isInstanceOf(OAuth2AuthenticationException.class);
    }

    @Test
    @DisplayName("loadUser — user inactive → throws OAuth2AuthenticationException")
    void loadUser_whenUserInactive_throwsOAuth2AuthenticationException() {
        OidcUser oidcUser = mockOidcUser("john@example.com");
        doReturn(oidcUser).when(service).fetchFromProvider(any());

        ApplicationUser dbUser = ApplicationUserFixtures.applicationUserJohn();
        dbUser.setActive(false);
        given(userService.findByEmail("john@example.com")).willReturn(Optional.of(dbUser));

        assertThatThrownBy(() -> service.loadUser(mock(OidcUserRequest.class)))
                .isInstanceOf(OAuth2AuthenticationException.class);
    }
}

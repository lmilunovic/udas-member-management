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
import java.util.Map;
import java.util.Optional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;

@DisplayName("CustomOAuth2UserService")
@ExtendWith(MockitoExtension.class)
class CustomOAuth2UserServiceTest {

    @Mock ApplicationUserService userService;

    @Spy @InjectMocks CustomOAuth2UserService service;

    private OAuth2User mockOAuth2User(String email) {
        OAuth2User user = mock(OAuth2User.class);
        given(user.getAttribute("email")).willReturn(email);
        given(user.getAttribute("name")).willReturn("John Doe");
        given(user.getAttribute("sub")).willReturn("google-sub-123");
        return user;
    }

    @Test
    @DisplayName("loadUser — active user → returns CustomOAuth2User with correct authority")
    void loadUser_whenUserExistsAndActive_returnsCustomOAuth2UserWithAuthority() {
        OAuth2User oauth2User = mockOAuth2User("john@example.com");
        given(oauth2User.getAttributes())
                .willReturn(
                        Map.of(
                                "email", "john@example.com",
                                "name", "John Doe",
                                "sub", "google-sub-123"));
        doReturn(oauth2User).when(service).fetchFromProvider(any());

        ApplicationUser dbUser = ApplicationUserFixtures.applicationUserJohn();
        dbUser.setRole(UserRole.READ_WRITE);
        dbUser.setActive(true);
        given(userService.findByEmail("john@example.com")).willReturn(Optional.of(dbUser));
        given(userService.updateUserFromOAuth(anyString(), anyString(), anyString()))
                .willReturn(dbUser);

        OAuth2User result = service.loadUser(mock(OAuth2UserRequest.class));

        assertThat(result).isInstanceOf(CustomOAuth2User.class);
        assertThat(result.getAuthorities())
                .extracting("authority")
                .containsExactly("ROLE_READ_WRITE");
    }

    @Test
    @DisplayName("loadUser — email null → throws OAuth2AuthenticationException")
    void loadUser_whenEmailIsNull_throwsOAuth2AuthenticationException() {
        OAuth2User oauth2User = mock(OAuth2User.class);
        given(oauth2User.getAttribute("email")).willReturn(null);
        doReturn(oauth2User).when(service).fetchFromProvider(any());

        assertThatThrownBy(() -> service.loadUser(mock(OAuth2UserRequest.class)))
                .isInstanceOf(OAuth2AuthenticationException.class);

        verify(userService, never()).findByEmail(anyString());
    }

    @Test
    @DisplayName("loadUser — user not in DB → throws OAuth2AuthenticationException")
    void loadUser_whenUserNotFound_throwsOAuth2AuthenticationException() {
        OAuth2User oauth2User = mockOAuth2User("unknown@example.com");
        doReturn(oauth2User).when(service).fetchFromProvider(any());
        given(userService.findByEmail("unknown@example.com")).willReturn(Optional.empty());

        assertThatThrownBy(() -> service.loadUser(mock(OAuth2UserRequest.class)))
                .isInstanceOf(OAuth2AuthenticationException.class);
    }

    @Test
    @DisplayName("loadUser — user inactive → throws OAuth2AuthenticationException")
    void loadUser_whenUserInactive_throwsOAuth2AuthenticationException() {
        OAuth2User oauth2User = mockOAuth2User("john@example.com");
        doReturn(oauth2User).when(service).fetchFromProvider(any());

        ApplicationUser dbUser = ApplicationUserFixtures.applicationUserJohn();
        dbUser.setActive(false);
        given(userService.findByEmail("john@example.com")).willReturn(Optional.of(dbUser));

        assertThatThrownBy(() -> service.loadUser(mock(OAuth2UserRequest.class)))
                .isInstanceOf(OAuth2AuthenticationException.class);
    }
}

package ba.rs.udas.udas_member_management.service;

import ba.rs.udas.udas_member_management.entity.ApplicationUser;
import ba.rs.udas.udas_member_management.entity.UserRole;
import java.util.Collection;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Primary;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
@Primary
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private static final Logger log = LoggerFactory.getLogger(CustomOAuth2UserService.class);

    private final ApplicationUserService userService;

    public CustomOAuth2UserService(ApplicationUserService userService) {
        this.userService = userService;
    }

    protected OAuth2User fetchFromProvider(OAuth2UserRequest userRequest) {
        return super.loadUser(userRequest);
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        log.info("CustomOAuth2UserService.loadUser() called");

        OAuth2User oauth2User = fetchFromProvider(userRequest);

        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");
        String googleId = oauth2User.getAttribute("sub");

        log.info("Google OAuth user: email={}, name={}, googleId={}", email, name, googleId);

        if (email == null) {
            throw new OAuth2AuthenticationException("Email not available from Google");
        }

        ApplicationUser user =
                userService
                        .findByEmail(email)
                        .orElseThrow(
                                () ->
                                        new OAuth2AuthenticationException(
                                                "Access denied. User not registered."));

        log.info(
                "Database user found: email={}, role={}, active={}",
                user.getEmail(),
                user.getRole(),
                user.getActive());

        if (!user.getActive()) {
            throw new OAuth2AuthenticationException("User account is disabled");
        }

        userService.updateUserFromOAuth(email, name, googleId);

        Collection<GrantedAuthority> authorities = mapRoleToAuthorities(user.getRole());
        log.info("Mapped authorities: {}", authorities);

        return new CustomOAuth2User(oauth2User, user.getEmail(), authorities);
    }

    private Collection<GrantedAuthority> mapRoleToAuthorities(UserRole role) {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }
}

package ba.rs.udas.udas_member_management.service;

import ba.rs.udas.udas_member_management.configuration.AppProperties;
import ba.rs.udas.udas_member_management.entity.ApplicationUser;
import ba.rs.udas.udas_member_management.entity.UserRole;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.Collection;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final ApplicationUserService userService;
    private final AppProperties appProperties;

    public CustomOAuth2UserService(ApplicationUserService userService, AppProperties appProperties) {
        this.userService = userService;
        this.appProperties = appProperties;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);

        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");
        String googleId = oauth2User.getAttribute("sub");

        if (email == null) {
            throw new OAuth2AuthenticationException("Email not available from Google");
        }

        validateDomain(email);

        ApplicationUser user = userService.findByEmail(email)
                .orElseGet(() -> createNewUser(email, name, googleId));

        if (!user.getActive()) {
            throw new OAuth2AuthenticationException("User account is disabled");
        }

        userService.updateUserFromOAuth(email, name, googleId);

        Collection<GrantedAuthority> authorities = mapRoleToAuthorities(user.getRole());

        return new CustomOAuth2User(oauth2User, user.getEmail(), authorities);
    }

    private void validateDomain(String email) {
        if (appProperties.security() != null && appProperties.security().allowedDomain() != null) {
            String domain = appProperties.security().allowedDomain();
            if (!email.endsWith("@" + domain)) {
                throw new OAuth2AuthenticationException("Email domain not allowed: " + domain);
            }
        }
    }

    private ApplicationUser createNewUser(String email, String name, String googleId) {
        if (appProperties.security() == null || appProperties.security().adminEmails() == null) {
            throw new OAuth2AuthenticationException("No admin emails configured");
        }

        UserRole role;
        if (appProperties.security().adminEmails().contains(email)) {
            role = UserRole.ADMIN;
        } else {
            String defaultRole = appProperties.security().defaultRole();
            role = defaultRole != null ? UserRole.valueOf(defaultRole) : UserRole.READ_ONLY;
        }

        ApplicationUser user = ApplicationUser.builder()
                .id(UUID.randomUUID())
                .email(email)
                .name(name)
                .googleId(googleId)
                .role(role)
                .active(true)
                .createdAt(OffsetDateTime.now())
                .build();

        return userService.createUserFromOAuth(user);
    }

    private Collection<GrantedAuthority> mapRoleToAuthorities(UserRole role) {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }
}

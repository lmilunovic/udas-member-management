package ba.rs.udas.udas_member_management.service;

import ba.rs.udas.udas_member_management.entity.ApplicationUser;
import ba.rs.udas.udas_member_management.entity.UserRole;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;

@Service
public class CustomOidcUserService extends OidcUserService {

    private static final Logger log = LoggerFactory.getLogger(CustomOidcUserService.class);

    private final ApplicationUserService userService;

    public CustomOidcUserService(ApplicationUserService userService) {
        this.userService = userService;
    }

    protected OidcUser fetchFromProvider(OidcUserRequest userRequest) {
        return super.loadUser(userRequest);
    }

    @Override
    public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
        log.info("CustomOidcUserService.loadUser() called");

        OidcUser oidcUser = fetchFromProvider(userRequest);

        String email = oidcUser.getEmail();
        String name = oidcUser.getFullName();
        String googleId = oidcUser.getSubject();

        log.info("Google OIDC user: email={}, name={}, googleId={}", email, name, googleId);

        if (email == null) {
            throw new OAuth2AuthenticationException("Email not available from Google");
        }

        ApplicationUser user = userService.findByEmail(email)
                .orElseThrow(() -> new OAuth2AuthenticationException("Access denied. User not registered."));

        log.info("Database user found: email={}, role={}, active={}", user.getEmail(), user.getRole(), user.getActive());

        if (!user.getActive()) {
            throw new OAuth2AuthenticationException("User account is disabled");
        }

        userService.updateUserFromOAuth(email, name, googleId);

        Collection<GrantedAuthority> authorities = mapRoleToAuthorities(user.getRole());
        log.info("Mapped authorities: {}", authorities);

        return new DefaultOidcUser(authorities, oidcUser.getIdToken(), oidcUser.getUserInfo(), "sub");
    }

    private Collection<GrantedAuthority> mapRoleToAuthorities(UserRole role) {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }
}

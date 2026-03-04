package ba.rs.udas.udas_member_management.service;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;

public class CustomOAuth2User extends DefaultOAuth2User {

    private final String email;

    public CustomOAuth2User(OAuth2User delegate, String email, Collection<? extends GrantedAuthority> authorities) {
        super(authorities, delegate.getAttributes(), "email");
        this.email = email;
    }

    @Override
    public String getName() {
        return email;
    }

    public String getEmail() {
        return email;
    }
}

package ba.rs.udas.udas_member_management.configuration;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app")
public record AppProperties(
    String name,
    String version,
    Api api,
    Security security
) {
    public record Api(
        String prefix,
        int pageSizeDefault,
        int pageSizeMax
    ) {}

    public record Security(
        String allowedDomain
    ) {}
}

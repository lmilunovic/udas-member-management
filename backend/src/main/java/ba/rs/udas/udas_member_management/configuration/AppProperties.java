package ba.rs.udas.udas_member_management.configuration;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app")
public class AppProperties {
    private String name;
    private String version;
    private Api api;
    private Admin admin;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public Api getApi() {
        return api;
    }

    public void setApi(Api api) {
        this.api = api;
    }

    public Admin getAdmin() {
        return admin;
    }

    public void setAdmin(Admin admin) {
        this.admin = admin;
    }


    public static class Api {
        private String prefix;
        private int pageSizeDefault = 20;
        private int pageSizeMax = 100;

        public String getPrefix() {
            return prefix;
        }

        public void setPrefix(String prefix) {
            this.prefix = prefix;
        }

        public int getPageSizeDefault() {
            return pageSizeDefault;
        }

        public void setPageSizeDefault(int pageSizeDefault) {
            this.pageSizeDefault = pageSizeDefault;
        }

        public int getPageSizeMax() {
            return pageSizeMax;
        }

        public void setPageSizeMax(int pageSizeMax) {
            this.pageSizeMax = pageSizeMax;
        }
    }

    public static class Admin {
        private String email;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }
    }

}

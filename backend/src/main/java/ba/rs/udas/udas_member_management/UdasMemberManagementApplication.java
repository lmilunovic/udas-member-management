package ba.rs.udas.udas_member_management;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class UdasMemberManagementApplication {

	public static void main(String[] args) {
		SpringApplication.run(UdasMemberManagementApplication.class, args);
	}

}

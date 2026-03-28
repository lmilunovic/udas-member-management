package ba.rs.udas.udas_member_management;

import org.springframework.boot.SpringApplication;

public class TestUdasMemberManagementApplication {

    public static void main(String[] args) {
        SpringApplication.from(UdasMemberManagementApplication::main)
                .with(TestcontainersConfiguration.class)
                .run(args);
    }
}

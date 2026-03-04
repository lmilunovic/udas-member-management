package ba.rs.udas.udas_member_management.fixtures;

import ba.rs.udas.udas_member_management.entity.MemberEntity;
import ba.rs.udas.udas_member_management.model.Address;
import ba.rs.udas.udas_member_management.model.Member;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public class MemberFixtures {

    public static Member memberJohn() {
        return Member.builder()
                .firstName("John")
                .lastName("Doe")
                .email(List.of("john@example.com"))
                .phone(List.of("+1234567890"))
                .build();
    }

    public static Member memberJane() {
        return Member.builder()
                .firstName("Jane")
                .lastName("Smith")
                .email(List.of("jane@example.com"))
                .phone(List.of("+0987654321"))
                .dateOfBirth(LocalDate.of(1990, 5, 15))
                .address(Address.builder()
                        .street("123 Main St")
                        .city("London")
                        .postalCode("SW1A 1AA")
                        .country("UK")
                        .build())
                .build();
    }

    public static Member memberWithAllFields() {
        return Member.builder()
                .firstName("John")
                .lastName("Doe")
                .email(List.of("john@example.com", "john.doe@work.com"))
                .phone(List.of("+1234567890", "+0987654321"))
                .dateOfBirth(LocalDate.of(1985, 3, 20))
                .ssn("123-45-6789")
                .address(Address.builder()
                        .street("456 Oak Ave")
                        .city("New York")
                        .postalCode("10001")
                        .country("USA")
                        .build())
                .build();
    }

    public static MemberEntity memberEntityJohn() {
        return MemberEntity.builder()
                .id(UUID.randomUUID())
                .firstName("John")
                .lastName("Doe")
                .email(List.of("john@example.com"))
                .phone(List.of("+1234567890"))
                .build();
    }

    public static MemberEntity memberEntityJane() {
        return MemberEntity.builder()
                .id(UUID.randomUUID())
                .firstName("Jane")
                .lastName("Smith")
                .email(List.of("jane@example.com"))
                .phone(List.of("+0987654321"))
                .dateOfBirth(LocalDate.of(1990, 5, 15))
                .street("123 Main St")
                .city("London")
                .postalCode("SW1A 1AA")
                .country("UK")
                .build();
    }
}

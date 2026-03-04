package ba.rs.udas.udas_member_management.mapper;

import ba.rs.udas.udas_member_management.entity.MemberEntity;
import ba.rs.udas.udas_member_management.fixtures.MemberFixtures;
import ba.rs.udas.udas_member_management.model.Address;
import ba.rs.udas.udas_member_management.model.Member;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("MemberMapper conversions")
@SpringBootTest
class MemberMapperTest {

    @Autowired
    private MemberMapper memberMapper;

    @Test
    @DisplayName("toEntity should map Member to MemberEntity with flat address")
    void toEntity_givenMemberWithAddress_mapsToEntityWithFlatAddress() {
        // Given
        Member member = Member.builder()
                .firstName("John")
                .lastName("Doe")
                .email(java.util.List.of("john@example.com"))
                .address(Address.builder()
                        .city("London")
                        .street("Main St")
                        .postalCode("SW1A 1AA")
                        .country("UK")
                        .build())
                .build();

        // When
        MemberEntity entity = memberMapper.toEntity(member);

        // Then
        assertThat(entity.getFirstName()).isEqualTo("John");
        assertThat(entity.getLastName()).isEqualTo("Doe");
        assertThat(entity.getEmail()).containsExactly("john@example.com");
        assertThat(entity.getCity()).isEqualTo("London");
        assertThat(entity.getStreet()).isEqualTo("Main St");
        assertThat(entity.getPostalCode()).isEqualTo("SW1A 1AA");
        assertThat(entity.getCountry()).isEqualTo("UK");
    }

    @Test
    @DisplayName("toEntity should map Member without address")
    void toEntity_givenMemberWithoutAddress_mapsToEntityWithNullAddressFields() {
        // Given
        Member member = MemberFixtures.memberJohn();

        // When
        MemberEntity entity = memberMapper.toEntity(member);

        // Then
        assertThat(entity.getFirstName()).isEqualTo("John");
        assertThat(entity.getLastName()).isEqualTo("Doe");
        assertThat(entity.getStreet()).isNull();
        assertThat(entity.getCity()).isNull();
        assertThat(entity.getPostalCode()).isNull();
        assertThat(entity.getCountry()).isNull();
    }

    @Test
    @DisplayName("toModel should map MemberEntity to Member with nested address")
    void toModel_givenEntityWithFlatAddress_mapsToMemberWithNestedAddress() {
        // Given
        MemberEntity entity = MemberEntity.builder()
                .id(java.util.UUID.randomUUID())
                .firstName("John")
                .lastName("Doe")
                .email(java.util.List.of("john@example.com"))
                .city("London")
                .street("Main St")
                .postalCode("SW1A 1AA")
                .country("UK")
                .build();

        // When
        Member member = memberMapper.toModel(entity);

        // Then
        assertThat(member.getFirstName()).isEqualTo("John");
        assertThat(member.getLastName()).isEqualTo("Doe");
        assertThat(member.getEmail()).containsExactly("john@example.com");
        assertThat(member.getAddress()).isNotNull();
        assertThat(member.getAddress().getCity()).isEqualTo("London");
        assertThat(member.getAddress().getStreet()).isEqualTo("Main St");
        assertThat(member.getAddress().getPostalCode()).isEqualTo("SW1A 1AA");
        assertThat(member.getAddress().getCountry()).isEqualTo("UK");
    }

    @Test
    @DisplayName("toModel should map MemberEntity without address fields")
    void toModel_givenEntityWithoutAddress_mapsToMemberWithNullAddress() {
        // Given
        MemberEntity entity = MemberFixtures.memberEntityJohn();

        // When
        Member member = memberMapper.toModel(entity);

        // Then
        assertThat(member.getFirstName()).isEqualTo("John");
        assertThat(member.getAddress()).isNull();
    }
}

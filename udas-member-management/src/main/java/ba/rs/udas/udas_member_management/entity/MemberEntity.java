package ba.rs.udas.udas_member_management.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "members")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MemberEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "email", columnDefinition = "jsonb")
    private List<String> email;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "phone", columnDefinition = "jsonb")
    private List<String> phone;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "date_of_death")
    private LocalDate dateOfDeath;

    @Column(name = "ssn", length = 50)
    private String ssn;

    @Column(name = "street")
    private String street;

    @Column(name = "city")
    private String city;

    @Column(name = "postal_code", length = 20)
    private String postalCode;

    @Column(name = "country")
    private String country;
}

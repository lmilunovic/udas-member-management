package ba.rs.udas.udas_member_management.controller;

import ba.rs.udas.udas_member_management.api.MembersApi;
import ba.rs.udas.udas_member_management.model.Member;
import ba.rs.udas.udas_member_management.model.PagedMember;
import ba.rs.udas.udas_member_management.service.MemberService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
public class MemberController implements MembersApi {

    private static final String DEFAULT_PAGE = "0";
    private static final String DEFAULT_SIZE = "20";
    private static final String DEFAULT_SORT = "id";

    private final MemberService memberService;

    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    @Override
    public ResponseEntity<Member> createMember(@Valid Member member) {
        Member created = memberService.createMember(member);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @Override
    public ResponseEntity<Void> deleteMember(UUID id) {
        boolean deleted = memberService.deleteMember(id);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<Member> getMember(UUID id) {
        Member member = memberService.getMember(id);
        if (member == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(member);
    }

    @Override
    public ResponseEntity<PagedMember> listMembers(
            String firstName, String lastName, String email, String phone,
            String city, String country, Integer page, Integer size, String sort) {

        int pageNumber = page != null ? page : Integer.parseInt(DEFAULT_PAGE);
        int pageSize = size != null ? size : Integer.parseInt(DEFAULT_SIZE);
        String sortColumn = (sort != null && !sort.isBlank()) 
            ? sort.split(",")[0] 
            : DEFAULT_SORT;
        Sort.Direction direction = (sort != null && sort.contains(",desc")) 
            ? Sort.Direction.DESC 
            : Sort.Direction.ASC;

        Pageable pageable = PageRequest.of(pageNumber, pageSize, direction, sortColumn);

        List<Member> filtered = memberService.findAll().stream()
                .filter(m -> firstName == null || firstName.isBlank() || 
                    (m.getFirstName() != null && m.getFirstName().toLowerCase().contains(firstName.toLowerCase())))
                .filter(m -> lastName == null || lastName.isBlank() || 
                    (m.getLastName() != null && m.getLastName().toLowerCase().contains(lastName.toLowerCase())))
                .filter(m -> email == null || email.isBlank() || 
                    (m.getEmail() != null && m.getEmail().stream().anyMatch(e -> e.toLowerCase().contains(email.toLowerCase()))))
                .filter(m -> phone == null || phone.isBlank() || 
                    (m.getPhone() != null && m.getPhone().stream().anyMatch(p -> p.contains(phone))))
                .filter(m -> city == null || city.isBlank() || 
                    (m.getAddress() != null && m.getAddress().getCity() != null && 
                     m.getAddress().getCity().toLowerCase().contains(city.toLowerCase())))
                .filter(m -> country == null || country.isBlank() || 
                    (m.getAddress() != null && m.getAddress().getCountry() != null && 
                     m.getAddress().getCountry().toLowerCase().contains(country.toLowerCase())))
                .toList();

        int totalElements = filtered.size();
        int totalPages = (int) Math.ceil((double) totalElements / pageSize);
        
        int fromIndex = pageNumber * pageSize;
        int toIndex = Math.min(fromIndex + pageSize, totalElements);
        
        List<Member> pageContent = fromIndex < totalElements 
            ? filtered.subList(fromIndex, toIndex) 
            : List.of();

        PagedMember pagedMember = PagedMember.builder()
                .content(pageContent)
                .page(pageNumber)
                .size(pageSize)
                .totalElements(totalElements)
                .totalPages(totalPages)
                .build();

        return ResponseEntity.ok(pagedMember);
    }

    @Override
    public ResponseEntity<Member> updateMember(UUID id, @Valid Member member) {
        Member updated = memberService.updateMember(id, member);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }
}

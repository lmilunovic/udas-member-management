package ba.rs.udas.udas_member_management.service;

import ba.rs.udas.udas_member_management.mapper.MemberMapper;
import ba.rs.udas.udas_member_management.model.Member;
import ba.rs.udas.udas_member_management.repository.MemberRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class MemberService {

    private final MemberRepository memberRepository;
    private final MemberMapper memberMapper;

    public MemberService(MemberRepository memberRepository, MemberMapper memberMapper) {
        this.memberRepository = memberRepository;
        this.memberMapper = memberMapper;
    }

    public Member createMember(Member member) {
        var entity = memberMapper.toEntity(member);
        var saved = memberRepository.save(entity);
        return memberMapper.toModel(saved);
    }

    public void deleteMember(UUID id) {
        memberRepository.deleteById(id);
    }

    public Member getMember(UUID id) {
        return memberRepository.findById(id)
                .map(memberMapper::toModel)
                .orElse(null);
    }

    public List<Member> findAll() {
        return memberRepository.findAll().stream()
                .map(memberMapper::toModel)
                .toList();
    }

    public Member updateMember(UUID id, Member member) {
        return memberRepository.findById(id)
                .map(existing -> {
                    var entity = memberMapper.toEntity(member);
                    entity.setId(id);
                    var saved = memberRepository.save(entity);
                    return memberMapper.toModel(saved);
                })
                .orElse(null);
    }
}

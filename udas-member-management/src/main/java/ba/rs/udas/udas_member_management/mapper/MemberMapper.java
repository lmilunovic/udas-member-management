package ba.rs.udas.udas_member_management.mapper;

import ba.rs.udas.udas_member_management.entity.MemberEntity;
import ba.rs.udas.udas_member_management.model.Member;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface MemberMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "street", source = "address.street")
    @Mapping(target = "city", source = "address.city")
    @Mapping(target = "postalCode", source = "address.postalCode")
    @Mapping(target = "country", source = "address.country")
    MemberEntity toEntity(Member member);

    @Mapping(source = "street", target = "address.street")
    @Mapping(source = "city", target = "address.city")
    @Mapping(source = "postalCode", target = "address.postalCode")
    @Mapping(source = "country", target = "address.country")
    Member toModel(MemberEntity entity);
}

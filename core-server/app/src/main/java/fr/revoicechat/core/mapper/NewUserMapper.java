package fr.revoicechat.core.mapper;

import fr.revoicechat.core.representation.NewUserRepresentation;
import fr.revoicechat.core.technicaldata.user.NewUser;
import fr.revoicechat.web.mapper.Mapper;
import fr.revoicechat.web.mapper.RepresentationMapper;
import io.quarkus.arc.Unremovable;
import jakarta.enterprise.context.ApplicationScoped;

@Unremovable
@ApplicationScoped
public class NewUserMapper implements RepresentationMapper<NewUser, NewUserRepresentation> {

  @Override
  public NewUserRepresentation map(final NewUser user) {
    return new NewUserRepresentation(Mapper.map(user.user()), user.recoverCodes());
  }
}
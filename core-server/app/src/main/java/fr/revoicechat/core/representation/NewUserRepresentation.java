package fr.revoicechat.core.representation;

import java.util.Collection;

public record NewUserRepresentation(UserRepresentation user, Collection<String> recoverCodes) {}

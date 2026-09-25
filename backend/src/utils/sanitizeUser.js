const sanitizeUser = (user) => {
  const source = typeof user.toObject === 'function' ? user.toObject() : user;

  return {
    id: source._id?.toString() || source.id,
    name: source.name,
    email: source.email,
    phone: source.phone || '',
    profileImage: source.profileImage || '',
    role: source.role,
    status: source.status,
    lastLoginAt: source.lastLoginAt || null,
    createdAt: source.createdAt,
    updatedAt: source.updatedAt,
  };
};

module.exports = sanitizeUser;

const { User, Club, ClubMember } = require('../models');
  //user to club
  User.hasMany(Club, {
    onDelete: "CASCADE"
  });
  Club.belongsTo(User);

  //user to club
  Club.hasMany(ClubMember, {
    onDelete: "CASCADE"
  });
  ClubMember.belongsTo(Club);
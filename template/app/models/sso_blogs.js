/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sso_blogs', {
    'id': {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      comment: "null"
    },
    'user_id': {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      comment: "null"
    },
    'public': {
      type: DataTypes.INTEGER(4),
      allowNull: true,
      comment: "null"
    }
  }, {
    tableName: 'sso_blogs'
  });
};

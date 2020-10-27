/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sso_roles', {
    'id': {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      primaryKey: true,
      comment: "null",
      autoIncrement: true
    },
    'role_name': {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "null"
    },
    'role_alias': {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: "null"
    }
  }, {
    tableName: 'sso_roles'
  });
};

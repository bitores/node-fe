/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sso_tool_wxcheckdomains', {
    'id': {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      primaryKey: true,
      comment: "null",
      autoIncrement: true
    },
    'title': {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "null"
    },
    'url': {
      type: DataTypes.STRING(2048),
      allowNull: true,
      comment: "null"
    },
    'way': {
      type: DataTypes.INTEGER(3),
      allowNull: true,
      comment: "null"
    },
    'is_disabled': {
      type: DataTypes.INTEGER(3).UNSIGNED.ZEROFILL,
      allowNull: true,
      comment: "null"
    },
    'update_at': {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "null"
    },
    'at': {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "null"
    }
  }, {
    tableName: 'sso_tool_wxcheckdomains'
  });
};

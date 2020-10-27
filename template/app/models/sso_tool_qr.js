/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sso_tool_qr', {
    'id': {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      primaryKey: true,
      comment: "null",
      autoIncrement: true
    },
    'slut': {
      type: DataTypes.STRING(32),
      allowNull: false,
      comment: "null"
    },
    'url': {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: "null"
    },
    'qr_desc': {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "null"
    },
    'at': {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "null"
    },
    'qr_class': {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "null"
    },
    'expire': {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "null"
    },
    'view_count': {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      comment: "null"
    }
  }, {
    tableName: 'sso_tool_qr'
  });
};

/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sso_tool_schedule', {
    'id': {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      primaryKey: true,
      comment: "null",
      autoIncrement: true
    },
    'name': {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "null"
    },
    'uuid': {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "null"
    },
    't_type': {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      comment: "null"
    },
    't_timer': {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "null"
    },
    't_desc': {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "null"
    }
  }, {
    tableName: 'sso_tool_schedule'
  });
};

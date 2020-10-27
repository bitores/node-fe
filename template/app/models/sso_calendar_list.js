/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sso_calendar_list', {
    'id': {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      primaryKey: true,
      comment: "null",
      autoIncrement: true
    },
    'c_type_id': {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      comment: "null"
    },
    'c_desc': {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "null"
    },
    'c_time': {
      type: DataTypes.DATE,
      allowNull: false,
      comment: "null"
    }
  }, {
    tableName: 'sso_calendar_list'
  });
};

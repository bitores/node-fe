/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sso_calendar_type', {
    'id': {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      comment: "null"
    },
    'c_desc': {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "null"
    }
  }, {
    tableName: 'sso_calendar_type'
  });
};

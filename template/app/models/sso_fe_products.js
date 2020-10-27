/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sso_fe_products', {
    'id': {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      comment: "null"
    },
    'name': {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "null"
    },
    'url': {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "null"
    },
    'sign': {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "null"
    }
  }, {
    tableName: 'sso_fe_products'
  });
};

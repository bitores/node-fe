/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sso_products', {
    'id': {
      type: DataTypes.INTEGER(4).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      primaryKey: true,
      comment: "null",
      autoIncrement: true
    },
    'product_name': {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "null"
    },
    'product_alias': {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: "null"
    }
  }, {
    tableName: 'sso_products'
  });
};

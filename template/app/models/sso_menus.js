/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sso_menus', {
    'id': {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      primaryKey: true,
      comment: "null",
      autoIncrement: true
    },
    'web_key': {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "null"
    },
    'menu_name': {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "null"
    },
    'menu_path': {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "null"
    },
    'web_type': {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      comment: "null"
    },
    'menu_component': {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: "null"
    },
    'parent_id': {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0',
      comment: "null"
    },
    'product_id': {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      comment: "null"
    }
  }, {
    tableName: 'sso_menus'
  });
};

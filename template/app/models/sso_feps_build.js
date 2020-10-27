/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sso_feps_build', {
    'id': {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      primaryKey: true,
      comment: "null",
      autoIncrement: true
    },
    'product_id': {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      comment: "null"
    },
    'build_man': {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "null"
    },
    'build_at': {
      type: DataTypes.DATE,
      allowNull: false,
      comment: "null"
    },
    'tag': {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "null"
    },
    'is_current': {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '0',
      comment: "null"
    }
  }, {
    tableName: 'sso_feps_build'
  });
};

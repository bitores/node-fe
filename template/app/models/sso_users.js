/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sso_users', {
    'id': {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      primaryKey: true,
      comment: "null",
      autoIncrement: true
    },
    'real_name': {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "null"
    },
    'cdcard': {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "null"
    },
    'mobile': {
      type: DataTypes.STRING(11),
      allowNull: true,
      comment: "null"
    },
    'in_time': {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "null"
    },
    'out_time': {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "null"
    },
    'is_in': {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      comment: "null"
    },
    'login_name': {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "null"
    },
    'login_pwd': {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "null"
    },
    'login_count': {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      comment: "null"
    },
    'salt': {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "null"
    }
  }, {
    tableName: 'sso_users'
  });
};

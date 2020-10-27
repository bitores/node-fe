/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sso_fe_performance', {
    'id': {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      primaryKey: true,
      comment: "null",
      autoIncrement: true
    },
    'at': {
      type: DataTypes.DATE,
      allowNull: false,
      comment: "null"
    },
    'url': {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "null"
    },
    'title': {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "null"
    },
    'entries': {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "null"
    },
    'timing': {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "null"
    },
    'traceurl': {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "null"
    },
    'shot': {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "null"
    }
  }, {
    tableName: 'sso_fe_performance'
  });
};

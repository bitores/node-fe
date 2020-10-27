/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sso_hanyu', {
    'id': {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      primaryKey: true,
      comment: "null",
      autoIncrement: true
    },
    'wd': {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "null"
    },
    'gif': {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "null"
    },
    'py': {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "null"
    },
    'mp3': {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "null"
    },
    'mark': {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "null"
    }
  }, {
    tableName: 'sso_hanyu'
  });
};

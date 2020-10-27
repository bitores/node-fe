/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sso_articles', {
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
    'title': {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "null"
    },
    'content': {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "null"
    },
    'keyword': {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "null"
    },
    'brief': {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "null"
    },
    'author': {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "null"
    },
    'head_img': {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "null"
    },
    'type': {
      type: DataTypes.INTEGER(4),
      allowNull: true,
      comment: "null"
    },
    'classify': {
      type: DataTypes.INTEGER(4),
      allowNull: true,
      comment: "null"
    },
    'tags': {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "null"
    }
  }, {
    tableName: 'sso_articles'
  });
};

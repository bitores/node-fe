/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sso_feps_deploy', {
    'id': {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      primaryKey: true,
      comment: "null",
      autoIncrement: true
    },
    'deploy_desc': {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "null"
    },
    'deploy_at': {
      type: DataTypes.DATE,
      allowNull: false,
      comment: "null"
    },
    'deploy_man': {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "null"
    },
    'build_id': {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      comment: "null"
    }
  }, {
    tableName: 'sso_feps_deploy'
  });
};

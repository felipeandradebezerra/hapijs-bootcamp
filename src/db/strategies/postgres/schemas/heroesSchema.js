const Sequelize = require("sequelize")

const HeroSchema = {
  name: 'heroes',
  schema: {
    id: {
      type: Sequelize.INTEGER,
      required: true,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING,
      required: true
    },
    power: {
      type: Sequelize.STRING,
      required: true
    }
  },
  options: {
    tableName: 'tb_hero',
    freezeTableName: false,
    timestamps: false
  }
}

module.exports = HeroSchema
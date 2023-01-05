const Sequelize = require("sequelize")
const driver = new Sequelize(
  'heroes',
  process.env.POSTGRES_USER,
  process.env.POSTGRES_PASSWORD,
  {
    host: process.env.POSTGRES_URL,
    dialect: 'postgres',
    quoteIdentifiers: false,
    operatorsAliases: false
  }
)

async function main() {
  const Heroes = driver.define('heroes', {
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
    },
  }, {
    tableName: 'tb_hero',
    freezeTableName: false,
    timestamps: false
  })

  try {
    await Heroes.sync();
    await Heroes.create({
      name: 'Green Light',
      power: 'Power Ring'
    })
    const results = await Heroes.findAll()
    console.log(results)
  } catch (error) {
    console.log('erro', error)
  }
}

main()
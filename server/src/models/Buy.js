module.exports = (sequelize, DataTypes) => {
  const Buy = sequelize.define('Buy', {
    bookid: DataTypes.STRING,
    userid: DataTypes.STRING,
    qty: DataTypes.STRING,
    status: DataTypes.STRING,
    booktitle: DataTypes.STRING,
    username: DataTypes.STRING,     
    userlastname: DataTypes.STRING,     
  })

  return Buy
}
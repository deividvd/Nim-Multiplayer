module.exports = function(mongoose) {
  const Schema = mongoose.Schema
  const GameSchema = new Schema(
    {
      sticks: [Schema.Types.Mixed],
      standardVictory: Boolean, // true = Standard victory / false = Marienbad victory
      turnRotation: Boolean, // true = rotation turns / false = chaos turns
      players: [Schema.Types.Mixed],
      playersWithTurnDone: [Schema.Types.Mixed],
      activePlayer: String,
      eliminatedPlayers: [Schema.Types.Mixed]
    },
    { versionKey: false }
  )
  return mongoose.model('Game', GameSchema) // 'Game' means 'games' collection
}

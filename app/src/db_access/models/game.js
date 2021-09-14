module.exports = function(mongoose) {
  const Schema = mongoose.Schema
  const GameSchema = new Schema(
    {
      sticks: [Schema.Types.Mixed],
      standardVictory: Boolean, // true = Standard victory / false = Marienbad victory
      turnRotation: Boolean, // true = rotation turns / false = chaos turns
      activePlayer: String,
      players: [Schema.Types.Mixed],
      playersWithTurnDone: [Schema.Types.Mixed],
      eliminatedPlayers: [Schema.Types.Mixed],
      disconnectedPlayers: [Schema.Types.Mixed]
    },
    { versionKey: false }
  )
  return mongoose.model('Game', GameSchema) // 'Game' means 'games' collection
}

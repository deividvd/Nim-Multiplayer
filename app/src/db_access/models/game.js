module.exports = function(mongoose) {
  const Schema = mongoose.Schema
  const GameSchema = new Schema(
    {
      sticks: [Schema.Types.Mixed],
      standardVictory: Boolean,
      turnRotation: Boolean,
      players: [Schema.Types.Mixed],
      playersWithTurnDone: [Schema.Types.Mixed],
      activePlayer: String,
      eliminatedPlayer: [Schema.Types.Mixed]
    },
    { versionKey: false }
  )
  return mongoose.model('Game', GameSchema) // 'Game' means 'games' collection
}

module.exports = function(mongoose) {
  const Schema = mongoose.Schema
  const GameSchema = new Schema(
    {
      /** Standard Victory: all true values, then when sticks are removed, set them to false
       * Marienbad Victory: all true values, then when sticks are removed, set the player name */
      sticks: [Schema.Types.Mixed],
      standardVictory: Boolean,
      turnRotation: Boolean,
      /** Turns Rotation: use a player array to keep the rotation order */
      players: [Schema.Types.Mixed],
      /** Turns Rotation: keep the last player who did the turn
       *  Turns Chaos:    keep the players who did the turn */
      playersWithTurnDone: [Schema.Types.Mixed],
      // TODO: is this necessary???
      eliminatedPlayer: [Schema.Types.Mixed]
    },
    { versionKey: false }
  )
  return mongoose.model('Game', GameSchema) // 'Game' means 'games' collection
}

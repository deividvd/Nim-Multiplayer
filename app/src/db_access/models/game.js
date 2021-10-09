module.exports = function(mongoose) {
  const Schema = mongoose.Schema
  const GameSchema = new Schema(
    {
      /**
       * This is a matrix that contains the rows of sticks.
       * Each stick value is initialized as false,
       * and this means "stick removed = false".
       * When a player makes a move, the value of the removed sticks
       * is overwritten with the player's username.
       */
      sticks: [Schema.Types.Mixed],
      /**
       * True means that the game has Standard victory.
       * 
       * False means that the game has Marienbad (or misère) victory.
       */
      standardVictory: Boolean,
      /**
       * True means that the game turns are performed in the typical rotation.
       * 
       * False means that the game turns are "chaos", so they are performed
       * by randomly choosing the next player among those who are "back of one turn".
       */
      turnRotation: Boolean,
      /**
       * The player that has to make the move.
       */
      activePlayer: String,
      /**
       * This is an array that contains the usernames of the players in game.
       * Its meaning changes according to the turn rotation.
       * 
       * If the turns are in rotation,
       * then the turns are alternated for the whole game
       * following the order of this value, generated randomly at the beginning of the game.
       * 
       * If the turns are chaos,
       * then this value contains the players who have to take the turn.
       * When a player takes his turn, he is placed in playersWithTurnDone.
       * When this value is empty and playersWithTurnDone contains all players,
       * then all players are removed from playersWithTurnDone to be placed inside this value. 
       */
      players: [Schema.Types.Mixed],
      /**
       * This is an array that contains the usernames of the players
       * that have performed their turn.
       * This value is used only in games with chaos turns. 
       */
      playersWithTurnDone: [Schema.Types.Mixed],
      /**
       * This is an array that contains the losing players.
       */
      eliminatedPlayers: [Schema.Types.Mixed],
      /**
       * This is an array that contains the disconnected players
       * that must be placed in the eliminatedPlayers when their turn comes.
       */
      disconnectedPlayers: [Schema.Types.Mixed]
    },
    { versionKey: false },
    /* { timestamps: true } /* TODO: the system needs a periodic task to delete the 
    games created but never started, and this timestamp should be used for this.
    TODO: the system also needs a periodic task to delete the games ended. */
  )
  return mongoose.model('Game', GameSchema) // 'Game' means 'games' collection
}

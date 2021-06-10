const HowToPlay = {
  template:
  `
  <article>
    <h2> HOW TO PLAY </h2>
    <h4> Come procede il gioco? </h4>
    <p> Il gioco procede a turni: c'è un turno per ogni giocatore! </p>
    <h4> Cosa deve fare un giocatore durante il proprio turno? </h4>
    <p>
      Il giocatore seleziona e rimuove 1 o più bastoncini da una sola riga!
      <br/>
      <b>ATTENZIONE</b>: si possono selezionare solo <span>bastoncini adiacenti tra loro</span>!
      <br/>
      Se tra 2 bastoncini c'è un bastoncino rimosso... i 2 bastoncini non sono adiacenti :(
    </p>
    <h4> Quando passa il turno ad un altro giocatore? </h4>
    <p> Il turno passa ad un altro giocatore, dopo che il giocatore di turno rimuove 1 o più bastoncini. </p>
    <h4> Come si vince? </h4>
    <p>
      Prima di cominciare una partita è possibile scegliere tra 2 modalità di vittoria: Standard o Marienbad.
      <br/>
      Nella modalità Standard vince chi rimuove l'ultimo bastoncino.
      <br/>
      Nella modalità Marienbad perde chi rimuove l'ultimo bastoncino.
    </p>
    <h4> Combatti una battaglia all'ultimo bastoncino! GRR! </h4>
    <p>
      Conosci tutto l'occorrente per giocare 1 vs 1!
      <br/>
      Ultima nota: prima di cominciare una partita si deve scegliere il numero di bastoncini e di righe.
    </p>
    <h3> MULTIPLAYER </h3>
    <p> Si può giocare fino a 6 giocatori! </p>
    <h4> Cosa cambia quando i giocatori sono 3 o più? </h4>
    <p> Cambiano: l'ordine dei turni, le modalità di vittoria, e viene introdotta la gestione delle disconnessioni. </p>
    <h4> Turni </h4>
    <p>
      Ci sono 2 modalità per gestire l'ordine dei turni di gioco: Rotazione e Chaos.
      <br/>
      Rotazione: prima di cominciare la partita, il gioco stabilisce
      un ordine casuale con cui alternare i turni dei giocatori,
      questo ordine verrà rispettato per tutta la partita.
      <br/>
      Chaos: prima e durante lo svolgimento della partita, il gioco stabilisce 
      un ordine casuale con cui alternare i turni dei giocatori,
      questo ordine verrà rielaborato dopo che tutti i giocatori avranno svolto il proprio turno.
      <br/>
      Prima di cominciare una partita si deve scegliere una tra queste 2 modalità.
    </p>
    <h4> Modalità di Vittoria </h4>
    <p>
      Standard: quando un giocatore rimuove l'ultimo bastoncino, vince e la partita finisce.
      <br/>
      Marienbad: quando un giocatore rimuove l'ultimo bastoncino, viene eliminato dalla partita,
      e la partita prosegue finchè non rimarrà un solo giocatore vincitore.
      <br/>
      Ma come fa la partita a proseguire se vengono rimossi tutti i bastoncini?
      <br/>
      Dopo l'eliminazione di un giocatore, i bastoncini vengono ripristinati tutti,
      ad eccezione dei bastoncini rimossi dai giocatori eliminati.
    </p>
    <h4> Gestione delle Disconnessioni </h4>
    <p>
      Partita con vittoria Standard: quando un giocatore si disconnette,
      quest'ultimo viene eliminato dalla partita, senza alterare i bastoncini in gioco.
      <br/>
      Partita con vittoria Marienbad: quando un giocatore si disconnette,
      quest'ultimo viene eliminato dalla partita, e vengono applicate le regole di eliminazione
      previste dalla vittoria Marienbad, per cui, i bastoncini vengono ripristinati tutti,
      ad eccezione dei bastoncini rimossi dai giocatori eliminati o disconnessi.
    </p>
  </article>
  `
}

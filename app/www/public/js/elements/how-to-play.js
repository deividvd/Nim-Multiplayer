const HowToPlay = {
  template:
  `
  <article>

    <h2> HOW TO PLAY </h2>

    <p>
      <span class="topic"> Come procede il gioco? </span>
      <br/>
      Il gioco procede a turni: c'è un turno per ogni giocatore!
    </p>
    
    <p>
      <span class="topic"> Cosa deve fare un giocatore durante il proprio turno? </span>
      <br/>
      Il giocatore seleziona e rimuove 1 o più bastoncini da una sola riga!
      <br/>
      <b>ATTENZIONE</b>: si possono selezionare solo bastoncini <b>adiacenti</b> tra loro!
      <br/>
      Se tra 2 bastoncini c'è un bastoncino rimosso... i 2 bastoncini non sono adiacenti.
    </p>
    
    <p>
      <span class="topic"> Quando passa il turno ad un altro giocatore? </span>
      <br/>
      Il turno passa ad un altro giocatore, dopo che il giocatore di turno
      rimuove 1 o più bastoncini.
    </p>

    <p>
      <span class="topic"> Come si vince? </span>
      <br/>
      Prima di cominciare una partita è possibile scegliere tra 2 modalità di vittoria:
      <b>Standard</b> o <b>Marienbad</b>.
      <br/>
      Nella modalità <b>Standard</b> vince chi rimuove l'ultimo bastoncino.
      <br/>
      Nella modalità <b>Marienbad</b> perde chi rimuove l'ultimo bastoncino.
    </p>

    <p>
      <span class="topic"> Combatti una battaglia all'ultimo bastoncino! GRR! </span>
      <br/>
      Conosci tutto l'occorrente per giocare 1 vs 1!
      <br/>
      Ultima nota: prima di cominciare una partita si deve scegliere
      il <b>numero di righe di bastoncini</b> e <b>l'ordine dei turni</b>.
    </p>

    <p>
      <span class="topic"> Ordine dei turni </span>
      <br/>
      Ci sono 2 modalità per gestire l'ordine dei turni di gioco:
      <b>Rotazione</b> e <b>Chaos</b>.
      <br/>
      <b>Rotazione</b>: prima di cominciare la partita, il gioco stabilisce
      un ordine casuale con cui alternare i turni dei giocatori,
      questo ordine verrà rispettato per tutta la partita.
      <br/>
      <!--
      <b>Predetermined  Chaos</b>: prima e durante lo svolgimento della partita, il gioco stabilisce 
      un ordine casuale con cui alternare i turni dei giocatori,
      questo ordine verrà rielaborato dopo che tutti i giocatori avranno svolto il proprio turno.
      <br/>
      -->
      <b>Chaos</b>: prima e durante lo svolgimento della partita, il gioco procede
      a turni casuali, ovvero il gioco sceglierà di far passare il turno casualmente 
      ad un giocatore fra quelli che sono "indietro di un turno".
    </p>

    <h2> Multiplayer </h2>

    <p>
      Si può giocare fino a <b>6</b> giocatori!
      <br/>
      <span class="topic"> Cosa cambia quando i giocatori sono 3 o più? </span>
      <br/>
      Cambiano: le regole delle modalità di vittoria, e viene introdotta la gestione delle disconnessioni.
    </p>

    <p>
      <span class="topic"> Modalità di Vittoria </span>
      <br/>
      <b>Standard</b>: quando un giocatore rimuove l'ultimo bastoncino,
      vince e la partita finisce.
      <br/>
      <b>Marienbad</b>: quando un giocatore rimuove l'ultimo bastoncino,
      viene eliminato dalla partita,
      e la partita prosegue finchè non rimarrà un solo giocatore vincitore.
      <br/>
      Ma come fa la partita a proseguire se vengono rimossi tutti i bastoncini?
      <br/>
      Dopo l'eliminazione di un giocatore, i bastoncini vengono ripristinati tutti,
      ad eccezione dei bastoncini rimossi dai giocatori eliminati.
    </p>

    <p>
      <span class="topic"> Gestione delle Disconnessioni </span>
      <br/>
      Le disconnessioni vengono gestite quando si presenta il turno del giocatore disconnesso.
      <br/>
      Partita con vittoria <b>Standard</b>: quando un giocatore si disconnette,
      quest'ultimo viene eliminato dalla partita, senza alterare i bastoncini in gioco.
      <br/>
      Partita con vittoria <b>Marienbad</b>: quando un giocatore si disconnette,
      quest'ultimo viene eliminato dalla partita, e vengono applicate le regole di eliminazione,
      per cui i bastoncini vengono ripristinati tutti,
      ad eccezione dei bastoncini rimossi dai giocatori eliminati o disconnessi.
    </p>

  </article>
  `
}

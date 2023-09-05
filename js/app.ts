
import Store from './store.js';
import { Player } from './types.js';
import View from './view.js'

const players: Player[] = [ 
    { 
        id: 1, 
        name: "Player 1", 
        iconClass: "fa-x", 
        colorClass: "dusty-rose",
    }, 
    { 
        id: 2, 
        name: "Player 2", 
        iconClass: "fa-o", 
        colorClass: "mint-green",
    },
]

function init() { 
    const view = new View(); 
    const store = new Store('live-t3-storage-key', players);
     
    function initView(){ 
        view.closeAll(); 
        view.clearMoves(); 
        view.setTurnIndicator(store.game.currentPlayer);
        view.updateScoreboard(
            store.stats.playerWithStats[0].wins, 
            store.stats.playerWithStats[1].wins, 
            store.stats.ties 
        );
        view.initializeMoves(store.game.moves)
    } 

    window.addEventListener('storage', () => { 
        console.log('State changed from another tab')
        initView()
    })

    initView();
    
    view.bindGameResetEvent((event) => { 
        store.reset(); 
        initView();
    }) 
     
    view.bindNewRoundEvent((event) => { 
        store.newRound();
        initView();
    })

    view.bindPlayerMoveEvent((square) => { 

        const existingMove = store.game.moves.find(
            (move) => move.squareId === +square.id 
        );
        
        if (existingMove) { 
            return
        }

        //Place current player icon in square
        view.handlePlayerMove(square, store.game.currentPlayer)
        
        // Push a move to the moves array and advance to the next state
        store.playerMove(+square.id);

        if (store.game.status.isComplete) { 
            view.openModal(
                store.game.status.winner 
                ? `${store.game.status.winner.name} wins!`
                : `Tie!`
            );

            return
        }
        
        //Set turn indicator of the next player
        view.setTurnIndicator(store.game.currentPlayer)
    });
} 

window.addEventListener("load", init);







// 7:37:31

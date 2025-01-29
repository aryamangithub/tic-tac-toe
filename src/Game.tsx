import { useEffect, useState } from "react"
import Square from "./components/Square"
import toast, { Toaster } from "react-hot-toast"

type Scores = {
  [key: string]: number
}

const INITIAL_GAME_STATE = ["", "", "", "", "", "", "", "", ""]
const INITIAL_SCORES: Scores = { X:0, O:0}
const WINNING_COMBOS = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
]

function Game() {

  const [gameState, setGameState] = useState(INITIAL_GAME_STATE)
  const [currentPlayer, setCurrentPlayer] = useState("X")
  const [scores, setScores] = useState(INITIAL_SCORES)

  useEffect(() => {
    const storedScores = localStorage.getItem("scores") 
    if(storedScores){
      setScores(JSON.parse(storedScores))
    }
  }, [])

  useEffect(() => {
    if(gameState === INITIAL_GAME_STATE){
      return
    }
    checkForWinner()
  }, [gameState])

  const resetBoard = () => setGameState(INITIAL_GAME_STATE)

  const resetScores = () => {
    localStorage.removeItem("scores")
    window.location.reload()
  }

  const handleWin = () => {
    toast(`Congrats player ${currentPlayer}! You are the winner!`, {
      icon: '👏',
      duration:2500
    })

    const newPlayerScore = scores[currentPlayer] + 1
    const newScores = {...scores}
    newScores[currentPlayer] = newPlayerScore
    setScores(newScores)
    localStorage.setItem("scores", JSON.stringify(newScores))

    resetBoard()
  }

  const handleDraw = () => {
    toast("The game ends in a draw!!", {
      duration: 2500
    })
    resetBoard()
  }

  const checkForWinner = () => {
    let roundWon = false

    for(let i=0; i < WINNING_COMBOS.length; i++) {
      const winCombo = WINNING_COMBOS[i]

      const a = gameState[winCombo[0]]
      const b = gameState[winCombo[1]]
      const c = gameState[winCombo[2]]

      if([a,b,c].includes("")){
        continue
      }

      if(a === b && b === c) {
        roundWon = true
        break
      }
    }

    if(roundWon){
      handleWin()
      return
    }

    if(!gameState.includes("")){
      handleDraw()
      return
    }

    changePlayer()
  }

  const changePlayer = () => {
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X")
  }

  const handleCellClick = (event: any) => {
    const cellIndex = Number(event.target.getAttribute("data-cell-index"))

    const currentValue = gameState[cellIndex]
    if(currentValue) {
      return
    }

    const newValues = [...gameState]
    newValues[cellIndex] = currentPlayer
    setGameState(newValues)
  }

  return (
    <> 
      <div className="h-100% p-8 text-slate-800 bg-gradient-to-r from-cyan-500 to-blue-500">
        <h1 className="text-center text-5xl mb-4 font-display text-white">
          Tic Tac Toe Game  
        </h1> 
        <div>
          <div className="grid grid-cols-3 gap-3 mx-auto w-96">
            {gameState.map((player, index) => (
                <Square 
                  key={index} 
                  onClick={handleCellClick} 
                  {...{index, player}}
                />
              ))
            }
          </div>

          <div className="mx-auto w-96 text-2xl text-serif">
            <p className="text-white mt-5">
              Next Player: <span>{currentPlayer}</span>
            </p>
            <p className="text-white mt-5">
              Player X wins: <span>{scores["X"]}</span>
            </p>
            <p className="text-white mt-5">
              Player O wins: <span>{scores["O"]}</span>
            </p>
            
            <button 
              className="border-2 text-white bg-red cursor-pointer mt-5" 
              onClick={()=>resetScores()}
            >
              Reset Scores
            </button>
          </div>
        </div>
        <Toaster />
      </div> 
    </>
  )
}

export default Game

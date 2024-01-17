import { useState, useEffect } from 'react'
import Die from "./components/Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"
import './App.css'

function App() {

  const [dice, setDice] = useState(allNewDice())
  const [tenzies, setTenzies] = useState(false)
  const [diceHistory, setDiceHistory] = useState(0);

  useEffect(() => {
    const allHeld = dice.every(die => die.isHeld)
    const firstValue = dice[0].value
    const allSameValue = dice.every(die => die.value === firstValue)
    if (allHeld && allSameValue) {
        setTenzies(true)
    }
  }, [dice])

  function generateNewDie() {
    const diceFaces = [
      '⚀', 
      '⚁', 
      '⚂', 
      '⚃',
      '⚄', 
      '⚅'  
    ]
    const value = Math.ceil(Math.random() * 6)
    return {
        value: diceFaces[value - 1],
        isHeld: false,
        id: nanoid()
    }
  }

  function allNewDice() {
    const newDice = []
    for (let i = 0; i < 10; i++) {
        newDice.push(generateNewDie())
    }
    return newDice
  }

  function rollDice() {
    if(!tenzies) {
        setDice(oldDice => oldDice.map(die => {
            return die.isHeld ? 
                die :
                generateNewDie()
        }))
        setDiceHistory(prevHistory => prevHistory + 1);
    } else {
        setTenzies(false)
        setDice(allNewDice())
        setDiceHistory(0)
    }
  }

  function holdDice(id) {
    setDice(oldDice => oldDice.map(die => {
        return die.id === id ? 
            {...die, isHeld: !die.isHeld} :
            die
    }))
  }

  const diceElements = dice.map(die => (
    <Die 
        key={die.id} 
        value={die.value} 
        isHeld={die.isHeld} 
        holdDice={() => holdDice(die.id)}
    />
  ))

  return (
    <div className="container">
      <main>
          {tenzies && <Confetti />}
          <h1 className="title">Tenzies</h1>
          <p className="instructions">Roll until all dice are the same. 
          Click each die to freeze it at its current value between rolls.</p>
          <div className="dice-container">
              {diceElements}
          </div>
          <button 
              className="roll-dice" 
              onClick={rollDice}
          >
              {tenzies ? "New Game" : "Roll"}
          </button>
          {`Number of rolls: ${diceHistory}`}
          {`Number max of rolls:`}
          {`Number min of rolls:`}
      </main>
    </div>
  )
}

export default App

import { useState, useEffect } from 'react'
import Die from "./components/Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"
import './App.css'

function App() {

  const [dice, setDice] = useState(allNewDice())
  const [tenzies, setTenzies] = useState(false)
  const [diceHistory, setDiceHistory] = useState(0);
  const [minRolls, setMinRolls] = useState(Infinity);
  const [maxRolls, setMaxRolls] = useState(0);
  const [time, setTime] = useState(0);
  const [bestTime, setBestTime] = useState(Infinity);

  useEffect(() => {
    const allHeld = dice.every(die => die.isHeld)
    const firstValue = dice[0].value
    const allSameValue = dice.every(die => die.value === firstValue)
    if (allHeld && allSameValue) {
        setTenzies(true)
    }
  }, [dice])

  useEffect(() => {
    let timer;
    const isAnyDieHeld = dice.some( die => die.isHeld);
    if (isAnyDieHeld && !tenzies) {
        timer = setInterval(() => {
            setTime(prevTime => prevTime + 1);
        }, 1000);
    } else {
        clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [tenzies, dice]);


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
        setMinRolls(min => Math.min(min, diceHistory));
        setMaxRolls(max => Math.max(max, diceHistory));
        setBestTime(best => { const newBest = Math.min(best, time);
          return newBest;
        });
        setTenzies(false)
        setDice(allNewDice())
        setDiceHistory(0)
        setTime(0);
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
          <div className="stats">
              <p>Number of rolls: {diceHistory}</p>
              <p>Best Time: {bestTime === Infinity ? 'N/A' : `${bestTime} seconds`}</p>
              <p>Number max of rolls: {maxRolls === 0 ? 'N/A': maxRolls}</p>
              <p>Number min of rolls: {minRolls === Infinity ? 'N/A' : minRolls}</p>
              <p>Timer: {time} seconds</p>
          </div>
      </main>
    </div>
  )
}

export default App

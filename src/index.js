import { run } from '@cycle/run'
import { App } from './app'
import { makeDOMDriver } from '@cycle/dom'
import { makeGameDriver } from './driver/game'

const main = App

const drivers = {
  game: makeGameDriver({
    id: 'game',
    width: 800,
    height: 800,
    gameRate: 1000 / 15,
    blockSize: 20,
    tailSize: 5,
    playerGap: 5,
    appleGap: 2,
    gameFill: 'black',
    playerFill: 'lime',
    appleFill: 'red'
  }),
  DOM: makeDOMDriver('#app')
}

run(main, drivers)

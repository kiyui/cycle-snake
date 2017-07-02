import { div, p } from '@cycle/dom'

export function App ({ DOM, game }) {
  const input$ = DOM.select('document')
    .events('keydown')
    .map(event => event.keyCode)
    .fold(({ velocityX, velocityY }, keyCode) => {
      switch (keyCode) {
        case 37:
          return { velocityX: -1, velocityY: 0 }
        case 38:
          return { velocityX: 0, velocityY: -1 }
        case 39:
          return { velocityX: 1, velocityY: 0 }
        case 40:
          return { velocityX: 0, velocityY: 1 }
      }
      return { velocityX, velocityY }
    }, { velocityX: 0, velocityY: 0 })
    .drop(1)

  const vdom$ = game.score$
    .map(score => div({ style: { textAlign: 'center' } }, [ p(`Score: ${score}`) ]))
    .startWith(div({ style: { textAlign: 'center' } }, [ p('Press any arrow key to begin') ]))

  return {
    game: input$,
    DOM: vdom$
  }
}

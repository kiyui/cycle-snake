import xs from 'xstream'
import sampleCombine from 'xstream/extra/sampleCombine'

export function makeGameDriver ({
  id,
  width,
  height,
  gameRate,
  blockSize,
  tailSize,
  playerGap,
  appleGap,
  gameFill,
  playerFill,
  appleFill
}) {
  // Initialize canvas
  const canvas = document.getElementById(id)
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  // Helper functions
  const randomX = () => Math.floor(Math.random() * horizontalTileCount)
  const randomY = () => Math.floor(Math.random() * verticalTileCount)

  // Initialize game information
  const horizontalTileCount = width / blockSize
  const verticalTileCount = height / blockSize
  let playerX = randomX()
  let playerY = randomY()
  let appleX = randomX()
  let appleY = randomY()
  let tail = tailSize
  const trail = []
  const score$ = xs.create()
  return function gameDriver (sink$) {
    const gameTick$ = xs.periodic(gameRate)
    gameTick$.compose(sampleCombine(sink$))
      .addListener({
        next: ([ tick, { velocityX, velocityY } ]) => {
          // Update state
          playerX += velocityX
          playerY += velocityY
          if (playerX < 0) {
            playerX = horizontalTileCount - 1
          }
          if (playerX > horizontalTileCount - 1) {
            playerX = 0
          }
          if (playerY < 0) {
            playerY = verticalTileCount - 1
          }
          if (playerY > verticalTileCount - 1) {
            playerY = 0
          }

          // Draw background
          ctx.fillStyle = gameFill
          ctx.fillRect(0, 0, width, height)

          // Draw player trail
          ctx.fillStyle = playerFill
          for (let i = 0; i < trail.length; i++) {
            const { x, y } = trail[i]
            ctx.fillRect(x * blockSize, y * blockSize, blockSize - playerGap, blockSize - playerGap)
            // Reset tail size if player eats themselves
            if (x === playerX && y === playerY) {
              tail = tailSize
            }
          }

          // Reset trail size if necessary
          trail.push({ x: playerX, y: playerY })
          while (trail.length > tail) {
            trail.shift()
          }

          // Check if player ate apple
          if (playerX === appleX && playerY === appleY) {
            tail++
            appleX = randomX()
            appleY = randomY()
          }

          // Draw apple
          ctx.fillStyle = appleFill
          ctx.fillRect(appleX * blockSize, appleY * blockSize, blockSize - appleGap, blockSize - appleGap)

          // Update score
          score$.shamefullySendNext(tail - tailSize)
        }
      })

    return {
      score$
    }
  }
}

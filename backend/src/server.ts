import { __port__ } from './constants'
import main from './index'

main().then(app => {
  app.listen(__port__, () => {
    console.log(`app listening on localhost:${__port__}`)
  })
})
import ComponentsBuilder from './components.js';
export  default class TerninalController{
  #usersCollors = new Map()
    constructor(){

    }
    #pickCollor(){
      return `#${((1 << 24) * Math.random() | 0).toString(16)}-fg`
    }

  #getUserCollor(userName){
      if(this.#usersCollors.has(userName))
        return this.#usersCollors.get(userName)

      const collor = this.#pickCollor()
      this.#usersCollors.set(userName, collor)

      return collor
    }

  #onInputReceived(eventEmitter){
    return function(){
      const message = this.getValue()
      console.log(message)
      this.clearValue()
    }
  }

  #onMessageRceived({ screen, chat }) {
    return msg => {
      const { userName, message } = msg
      const collor = this.#getUserCollor(userName)

      chat.addItem(`{${collor}}{bold}${userName}{/}: ${message}`)
      screen.render()
    }
  }

  #registerEvents(eventEmitter, components){
    eventEmitter.on('message:received', this.#onMessageRceived(components))
    // eventEmitter.emit('turma01', 'hey')
    //eventEmitter.on('turma01', msg => console.log(msg.toString()))
  }

    async initializeTable(eventEmitter){
      const components = new ComponentsBuilder()
        .setScreen({ title: 'HackerzãoChat - Eduardo Developer'})
        .setLayoutComponent()
        .setInputComponent(this.#onInputReceived(eventEmitter))
        .setChatComponent()
        .build()

        this.#registerEvents(eventEmitter, components)
        components.input.focus()
        components.screen.render()

        setInterval(()=>{
          eventEmitter.emit('message:received', { message: 'hey', userName: 'Eduardo'})
          eventEmitter.emit('message:received', { message: 'opa', userName: 'Developer' })
        }, 2000)
    }
}
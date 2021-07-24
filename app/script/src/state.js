function State(initState) {
  let state = initState

  this.current = state

  this.setState = newState => {
    state = Object.assign(state, newState)
  }
}

module.exports = State

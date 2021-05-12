import React from 'react'

const useMove = () => {
  const [position, setPosition] = React.useState({x: 0, y: 0})
  const [pressed, setPressed] = React.useState(false);

  const handleMouseMove = e => {
    e.persist()
    setState(state => ({...state, x: e.clientX, y: e.clientY}))
  }
  return {
    x: state.x,
    y: state.y,
    handleMouseMove,
  }
}

const Hook = () => {
  const {x, y, handleMouseMove} = useMove()
  return (
    <div className="mouseArea" onMouseMove={handleMouseMove}>
      Hook
      <div className="mouseInfo">
        The current mouse position is ({x}, {y})
      </div>
    </div>
  )
}

export default Hook

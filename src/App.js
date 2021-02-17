import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Frame = styled.svg`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
`;


const initialiseState = ({ width, height }) => {
  const coords = [];
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const value = Math.random() > 0.9;
      // const value = x === width / 2 && y === height / 2
      coords.push({ x, y, value });
    }
  }
  return coords;
}



const Triangle = ({ x, y, size, fill }) => {
  const height = size * (Math.sqrt(3) / 2);
  const halfX = x / 2;

  let a, b, c;

  const flipped = (x + y) % 2 === 0;

  const x2 = x / 2;

  if (flipped) {
    a = [        halfX * size, (y + 1) * height];
    b = [(halfX + 0.5) * size,     (y) * height];
    c = [(halfX - 0.5) * size,     (y) * height];
  } else {
    a = [        halfX * size,     (y) * height];
    b = [(halfX - 0.5) * size, (y + 1) * height];
    c = [(halfX + 0.5) * size, (y + 1) * height];
  }

  return (
    <polygon stroke="white" points={`${a[0]} ${a[1]}, ${b[0]} ${b[1]}, ${c[0]} ${c[1]}`} fill={fill}/>
  );
}

const find = ({ state, x, y }) => state.find((o) => (o.x === x && o.y === y))?.value || false;

const constructTick = ({ setState }) => () =>
  setState(state => {
    return state.map(({ x, y, value }) => {
      const flipped = (x + y) % 2 === 0;
      const a = flipped ? find({ state, x, y: y - 1 }) : find({ state, x, y: y + 1 });
      const b = find({ state, x: x + 1, y })
      const c = find({ state, x: x - 1, y })
      return { x, y, value: f({ value, a, b, c }) }
    })
  })


// (value && a)
// (value && b)
// (value && c)
// (a && b)
// (a && c)
// (b && c)

const f = ({ value, a, b, c }) => {
  const count = a + b + c

  if (count === 3) return !value;
  if (count === 2) return true;
  if (count === 1) return (!a && b) || (a && b);
  if (count === 0) return false;
}


let timeout;

const App = () => {
  const [state, setState] = useState(initialiseState({ width: 100, height: 40 }))

  const tick = constructTick({ setState });

  useEffect(() => {
    const ticker = () => {
      tick();
      timeout = setTimeout(ticker, 300);
    }
    ticker();
    return () => clearTimeout(timeout);
  }, [])

  return (
    <Frame>
      {state.map(({ x, y, value }, index) =>
        <Triangle x={x} y={y} key={index} size={20} fill={value ? "red" : "black"} />)}
    </Frame>
  )
}

export default App;

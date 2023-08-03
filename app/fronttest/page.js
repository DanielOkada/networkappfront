"use client"
import { useState, useEffect, useRef, useMemo } from 'react';
import * as d3 from "d3";
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import { useSpring, animated } from '@react-spring/web'
import { useTrail, animated as a } from "@react-spring/web"
import { MyTest, Pie, MyTest2 } from './animationTest';
import Image from 'next/image';



function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}



export function ContextMenu({open, handleClose, x, y, onContextMenu}) {
  return (
    <div style={{ cursor: 'context-menu' }}>
      <Menu
        open={open}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={{ top: y, left: x }}
        onContextMenu={onContextMenu}
      >
        <MenuItem onClick={handleClose}>Copy</MenuItem>
        <MenuItem onClick={handleClose}>Print</MenuItem>
        <MenuItem onClick={handleClose}>Highlight</MenuItem>
        <MenuItem onClick={handleClose}>Email</MenuItem>
      </Menu>
    </div>
  );
}


export function Bar({x="0", y="0", rx="0", ry="0", width="10", height=100, handleContextMenu}){
  const [color, setColor] = useState("blue")

  function onClick(){
    if (color=="blue"){
      setColor("orange")
    }
    else{
      setColor("blue")
    }
  }


  return  (
    <rect 
          onContextMenu={handleContextMenu}
          onClick={onClick}
          x={x} y={y} rx={rx} ry={ry} width={width} height={height} 
          style={{fill:color}}
      /> 
  )
}

export function AnimationTest(){
  const [springs, api] = useSpring(() => ({
    from: { x: 0 },
  }))

  const handleClick = () => {
    api.start({
      from: {
        x: 0,
      },
      to: {
        x: 100,
      },
    })
  }

  return (
    <animated.div
      onClick={handleClick}
      style={{
        width: 80,
        height: 80,
        background: '#ff6d6d',
        borderRadius: 8,
        ...springs,
      }}
    />
  )
}


export default function Hello() {

    return (
            <div>
              <Pie/>

            </div>
            )
}
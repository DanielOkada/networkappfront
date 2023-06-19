"use client"
import { useState, useEffect, useRef, useMemo } from 'react';
import * as d3 from "d3";
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';



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


export default function Hello() {
    const [open, setOpen] = useState(false);
    const [contextMenuX, setContextMenuX] = useState(0)
    const [contextMenuy, setContextMenuY] = useState(0)
    const [height, setHeight] = useState(100)
    const [barY, setBarY] = useState(0)

    function handleContextMenu(event){
      event.preventDefault();

      setContextMenuX(event.clientX);
      setContextMenuY(event.clientY);
      setOpen(true);
    }
    
    const handleClose = () => {
      setOpen(false);
    };

    function handleContextMenuContextMenu(event){
      event.preventDefault();
      handleClose();
    }

    function onMouseMove(event){
      let new_height = event.clientY;
      if ( new_height < 0){
        new_height = 0;
      }
      setHeight(new_height);
    }

    return (
            <div onMouseMove={onMouseMove}>
              <ContextMenu open={open} handleClose={handleClose} x={contextMenuX} y={contextMenuy} onContextMenu={handleContextMenuContextMenu}/>
              <svg viewBox='-50, -50, 500, 500'>
                <Bar x="0" handleContextMenu={handleContextMenu} height={height}/>
                <Bar x="11"handleContextMenu={handleContextMenu} height={height/2}/>
                <Bar x="22"handleContextMenu={handleContextMenu} height={height/4}/>
              </svg>
            </div>
            )
}
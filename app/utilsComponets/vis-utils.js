"use client"
import React, { useState, useEffect, use } from 'react';
import { Box } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';


export function DragSelect({children}){
        const [selected, setSelected] = useState([])
        const [isDragging, setIsDragging] = useState(false);
        const [startX, setStartX] = useState(0);
        const [startY, setStartY] = useState(0);
        const [endX, setEndX] = useState(0);
        const [endY, setEndY] = useState(0);

        const handleMouseDown = (event) => {
                const rect = event.target.getBoundingClientRect()
                setIsDragging(true);

                setStartX(event.clientX - rect.x);
                setStartY(event.clientY - rect.y);
                setEndX(event.clientX - rect.x);
                setEndY(event.clientY - rect.y);
              };
            
        const handleMouseMove = (event) => {
        if (isDragging) {
                const rect = event.target.getBoundingClientRect()

                setEndX(event.clientX - rect.x);
                setEndY(event.clientY - rect.y);
        }
        };
        
        const handleMouseUp = ({target}) => {
                setIsDragging(false);
                selectElements(target.getBoundingClientRect());
        };

        function selectElements(p_rect){
                const elements = document.querySelectorAll('.draggable');

                const selected = Array.from(elements).filter((element) => {
                  const rect = element.getBoundingClientRect();
                  const elementX = rect.left + rect.width / 2 - p_rect.x;
                  const elementY = rect.top + rect.height / 2 - p_rect.y;
            
                  return (
                    elementX > Math.min(startX, endX) &&
                    elementX < Math.max(startX, endX) &&
                    elementY > Math.min(startY, endY) &&
                    elementY < Math.max(startY, endY)
                  );
                })

                setSelected(selected);
                // console.log(selected)
        }

        const getX = () => {
                if (endX > startX){
                        return startX
                }
                return endX
        }

        const getY = () => {
                if (endY > startY){
                        return startY
                }
                return endY
        }

        const getWidth = () => {
                if (endX > startX){
                        return endX - startX
                }
                return startX - endX
        }

        const getHeight = () => {
                if (endY > startY){
                        return endY - startY
                }
                return startY - endY
        }


        return (
                <div style={{ width: '100%', height: '100%', border: '1px solid red', position:"relative", }}>
                        <div style={{position:"absolute"}}>{children}</div>
                        {isDragging && <svg width={getWidth()} height={getHeight()} style={{position:"absolute", left:getX(), top:getY()} }>
                                <rect  width="100%" height="100%" fill="rgba(0, 0, 255, 0.1)" stroke='blue'/>
                        </svg>}
                        <div style={{ width: '100%', height: '100%', position:"absolute"}}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        >
                        </div>
                </div>

        )
}
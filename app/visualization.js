"use client"
import { Box } from '@mui/material';
import Paper from '@mui/material/Paper';
import { useState, useEffect } from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Fab from '@mui/material/Fab';
import CircularProgress from '@mui/material/CircularProgress';
import CheckIcon from '@mui/icons-material/Check';
import UploadIcon from '@mui/icons-material/Upload';
import { getSheets, setSheet, getNetwork} from './utils';
import Graph from "react-graph-vis";
import OutlinedInput from '@mui/material/OutlinedInput';
import { TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { NetworkForm, UploadForm } from './forms';
import { store } from './store'
import { Provider } from 'react-redux'
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment, incrementByAmount } from './slices/counterSlice'
import { setTrue } from './slices/boolSlice';


export function CanvasBase({children}){
        return (
                <Box
                        sx={{
                                flex: "auto",
                                '& > :not(style)': {
                                m: 0,
                                minWidth: 256,
                                minHeight: 500,
                                position:"relative"
                                },
                        }}
                >
                        <Paper>
                                {children}
                        </Paper>
                </Box>
        )
}


export function CanvasManager({children}){
        // const [row, setRow] = useState(1)

        function onAddButtonClick(){
                setCanvases(prevCanvases => prevCanvases.concat(<MyCanvas key={prevCanvases.length} />));
        }

        function AddCanvasButton(){
                return(
                        <Fab color='primary' size='small' style={{position:"absolute", right:10, top:10}} onClick={onAddButtonClick}>
                                <AddIcon/>
                        </Fab>
                )
        }

        const MyCanvas = () => {
                return (
                        <CanvasBase>
                                <AddCanvasButton/>
                                {children}
                        </CanvasBase>
                )
        }
        const [canvases, setCanvases] = useState([<MyCanvas key="0"/>])

        let row = canvases.length
        if (canvases.length > 2){
                row = 2
        }


        return (
                <Box style={{ display: 'grid', gridTemplateColumns: `repeat(${row}, 1fr)`, gap: '4px' }}>
                {canvases.map((c) => {return c})}
                </Box>
        )
}


export function Main(){
        const dispatch = useDispatch()

        const [prepared, setPrepared] = useState(false)
        const onUploaded = () => {
                setPrepared(true)
                dispatch(setTrue())
        }


        // Stateの更新後に実行する処理
        useEffect(() => {
                        // Stateの値を参照して処理を行う
                        console.log(prepared);
                }, [prepared]); // [state]はStateが変更された時に実行される依存配列です


        return (
                <>
                <Box sx={{margin:5, textAlign: "center"}}>
                        <UploadForm url={"upload"} onUploaded={onUploaded}/>
                </Box>
                <Box>
                        <CanvasManager>
                                <NetworkForm/>
                        </CanvasManager>
                </Box>
                </>
        )
}

export function MyPage(){
        return (
                <Provider store={store}>
                        <Main/>
                </Provider> 
        )
}
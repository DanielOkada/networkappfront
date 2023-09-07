"use client"
import "./styles/fonts.css"
import { Box } from '@mui/material';
import { UploadForm } from './forms';
import { store } from './store'
import { Provider } from 'react-redux'
import { useDispatch } from 'react-redux'
import { setTrue } from './slices/boolSlice';
import { getNetworksD3 } from './api/utils';
import { setData } from './slices/networkDataSlice';
import CanvasManager from './components/CanvasManager';
import BasicTabs from './components/BasicTabs';



export function Main(){
        const dispatch = useDispatch()

        const onUploaded = () => {
                dispatch(setTrue())

                async function fetchData(){
                        const data = await getNetworksD3()
                        console.log(data)
                        dispatch(setData(data))
                }

                fetchData()
                
        }

        
        const Title = () => {
                return (
                        <div style={{fontFamily:"TachyonW00-Regular", fontSize:40, fontWeight: 800,
                        position:"relative", top:20, left:20,
                        background:"linear-gradient(to right ,#55A5FF, #A2EA00)",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color:"transparent"
                        }}>
                                Network Analysis App
                        </div>
                )
        }
        

        return (
                <div style={{background:"white"}}>
                        <Title/>
                        <Box sx={{textAlign: "center", position:"relative", top:50}}>
                                <Box sx={{marginBottom:5}}>
                                        <UploadForm url={"upload"} onUploaded={onUploaded}/>
                                </Box>
                                <CanvasManager> 
                                        <BasicTabs/>
                                </CanvasManager>
                        </Box>
                </div>
        )
}

export default function NetworkAppMain(){
        return (
                <Provider store={store}>
                        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
                                integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
                                crossOrigin=""/>
                                
                        <a href="fronttest">test</a>
                        <Main/>
                </Provider> 
        )
}
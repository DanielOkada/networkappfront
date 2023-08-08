"use client"
import { Box } from '@mui/material';
import Paper from '@mui/material/Paper';
import { useState, useEffect, useRef, useMemo } from 'react';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import CircularProgress from '@mui/material/CircularProgress';
import { getSheets} from './utils';
import Graph from "react-graph-vis";
import AddIcon from '@mui/icons-material/Add';
import { SelectSheetForm, NetworkFormD3, UploadForm, FileInput } from './forms';
import { store } from './store'
import { Provider } from 'react-redux'
import { useSelector, useDispatch } from 'react-redux'
import { setTrue } from './slices/boolSlice';
import "./fonts.css"
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Slider from '@mui/material/Slider';
import { D3Network, D3NetworkRef } from './animation';
import { getNetworksD3 } from './utils';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { setData } from './slices/networkDataSlice';
import * as d3 from 'd3';
import dynamic from 'next/dynamic'



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
                        <Fab color='primary' size='small' style={{position:"absolute", right:10, top:5}} onClick={onAddButtonClick}>
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


function TabPanel(props) {
        const { children, value, index, ...other } = props;
      
        return (
          <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
          >
            {value === index && (
              <Box sx={{width:"100%", height:"100%"}}>
                <div>{children}</div>
              </Box>
            )}
          </div>
        );
}

export default function BasicTabs() {
        const [sheets, setSheets] = useState(null);
        const [value, setValue] = useState(0);
      
        const handleChange = (event, newValue) => {
                setValue(newValue);
        };

        const sheets_getter = async () => {
                await getSheets().then((data) => {
                        console.log(data)
                        setSheets(data)
                  });
        }

        const Jikeiretsu = () => {
                if (!sheets){
                        sheets_getter()
                        return
                }
                return <DiscreteSlider data={sheets}/>
        }
      
        return (
                <Box sx={{ width: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                        <Tab label="ネットワーク描画"/>
                                        <Tab label="時系列描画"/>
                                        <Tab label="地図"/>
                                </Tabs>
                        </Box>

                        <TabPanel value={value} index={0}>
                                <NetworkFormD3/>
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                                <Jikeiretsu/>
                        </TabPanel>
                        <TabPanel value={value} index={2}>
                                <MapWithNetwork/>
                        </TabPanel>
                </Box>
        );
}


export function DiscreteSlider({data}) {
        const graph = useSelector((state) => state.netWorkData.data)
        const [value, setValue] = useState(0);
        const [intervalID, setIntervalID] = useState()
        const [originalGraph, setOriginalGraph] = useState()
        const [zoom, setZoom] = useState(100)
            
        const handleClick = () => {
                if (intervalID){
                        console.log("stop")
                        clearInterval(intervalID)
                        setIntervalID(null)
                        return
                }

                console.log("start")
                const id = setInterval(() => {
                        setValue((prevValue) => prevValue + 1);
                      }, 1000);
                setIntervalID(id)
        }


        const handleChange = (event, newValue) => {
                clearInterval(intervalID)
                setIntervalID(null)
                setValue(newValue)
        };

        if (value == data.length - 1 && intervalID){
                clearInterval(intervalID)
                setIntervalID(null)
        }

        const handleSaidaiCheck  = (event, newValue) => {
                if (newValue == false) {
                        setGraph(JSON.parse(originalGraph))
                        return
                }

                setOriginalGraph(JSON.stringify(graph))
                const new_graph = {...graph}
                for (const time in graph) {
                        new_graph[time].nodes = graph[time].nodes.filter(node => graph[time].saidai.includes(node.id))
                        new_graph[time].links = graph[time].links.filter(link => graph[time].saidai.includes(link.source) || graph[time].saidai.includes(link.target))
                }
                setGraph(new_graph)
        }

        const buttonText = () => {
                if (intervalID){return "STOP"}
                return "START"
        }

        return (
          <Box sx={{ width: "100%", height: "100%",  textAlign:"left"}}>
                <Box sx={{position:"relative"}}>
                        <Button variant="contained" onClick={handleClick} sx={{backgroundColor:"#55A5FF"}} >{buttonText()}</Button>
                        <Slider
                                defaultValue={0}
                                valueLabelFormat={(x) => data[x]}
                                onChange={handleChange}
                                valueLabelDisplay="auto"
                                step={1}
                                // min={10}
                                max={data.length - 1}
                                marks
                                value={value}
                                sx={{color:"#55A5FF", width:"300px", textAlign: "center", position:"relative", top:10, left:20}}
                        />
                        <Box sx={{position:"absolute", left:420, top:10, fontSize:30, fontWeight: 700}}>{data[value]}</Box>
                        <div><FormControlLabel control={<Checkbox onChange={handleSaidaiCheck}/>} label="最大連結成分" /></div>
                </Box>
                {!graph && <CircularProgress sx={{position:"relative", display: "block", marginLeft: "auto", marginRight: "auto", top: 100}}/>}
                {graph && <D3Network data={graph.payload[data[value]]} width={"100%"} height={700} zoom={zoom/100} />}
                <Slider
                                defaultValue={100}
                                valueLabelFormat={(x) => x + "%"}
                                onChange={(event, newValue) => setZoom(newValue)}
                                valueLabelDisplay="auto"
                                step={10}
                                min={50}
                                max={1000}
                                value={zoom}
                                sx={{color:"#55A5FF", width:"300px", textAlign: "center", position:"relative", top:10, left:20}}
                        />
          </Box>
        );
}


export function MapWithNetwork() {
        const chartRef = useRef()
	const [sheets, setSheets] = useState(null);
	const [sheetValue, setSheetValue] = useState(0);
	const [currentData, setCurrentData] = useState(null)
	const [saidai, setSaidai] = useState(false)
        const [addressData, setAddressData] = useState()
	const data = useSelector((state) => state.netWorkData.data)
	const zoom = 100

	const handleSheetChange = ({ target }) => {
		setSheetValue(target.value);
	}

	function handleSaidaiCheck(event, newValue) {
		setSaidai(newValue)
	}

        function setAddressDataAndConvert(file){
                const reader = new FileReader()
                reader.readAsText(file, 'utf-8');

                reader.onload = () => {
                        try {
                          const data = JSON.parse(reader.result);
                          setAddressData(data);
                        } catch (error) {
                          console.error('Error parsing JSON file:', error);
                        }
                      }
        }

	useEffect( () => {
		if (!data) {return}
		setSheets(Object.keys(data.payload))
	}, [data])

	useEffect( () => {
		if (!(data && sheets)) {return}

		const sheet = sheets[sheetValue]
		if (saidai){
			getSaidai(data.payload[sheet], (d) => setCurrentData(d))
			return
		}

		setCurrentData(data.payload[sheet])
	}, [data, sheetValue, sheets, saidai])

        useEffect( () => {
                console.log(addressData)
	}, [addressData])

        let overlayNetwork = null
        if (currentData){
                overlayNetwork = <D3NetworkRef data={currentData} chartRef={chartRef} width={"100%"} height={"100%"} zoom={zoom/100} />
        }

        const mysvg = <svg>
                        <rect x="0" y="0" width="100%" height="100%" fill="blue" />
                        <circle r="5" cx="10" cy="10" fill="red" />
                        <text x="50%" y="50%" stroke="white">
                                text
                        </text>
                </svg>

        const Map = useMemo(
                () =>
                  dynamic(() => import('./map'), {
                    loading: () => <p>map loading</p>,
                    ssr: false
                  }),
                []
              );


	return (
		<div>
		<Box sx={{ marginTop: 0 }}>
			{sheets && <SelectSheetForm sheets={sheets} value={sheetValue} handleChange={handleSheetChange} />}
                        <FileInput setSelectedFile={setAddressDataAndConvert}/>
		</Box>
		<div><FormControlLabel control={<Checkbox onChange={handleSaidaiCheck}/>} label="最大連結成分" /></div>
		<Box>
                        <Map overlaySVG={overlayNetwork} chartRef={chartRef} addressData={addressData} />
		</Box>
		</div>
	)
}


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

export function MyPage(){
        return (
                <Provider store={store}>
                        <Main/>
                </Provider> 
        )
}
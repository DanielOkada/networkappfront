"use client"
import { Box } from '@mui/material';
import Paper from '@mui/material/Paper';
import { useState, useEffect, useRef } from 'react';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import CircularProgress from '@mui/material/CircularProgress';
import { getSheets, setSheet, getNetwork, getNetworks} from './utils';
import Graph from "react-graph-vis";
import AddIcon from '@mui/icons-material/Add';
import { MyGraph, NetworkForm, NetworkFormD3, UploadForm } from './forms';
import { store } from './store'
import { Provider } from 'react-redux'
import { useSelector, useDispatch } from 'react-redux'
import { setTrue } from './slices/boolSlice';
import { DragSelect } from './utilsComponets/vis-utils';
import "./fonts.css"
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Slider from '@mui/material/Slider';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape, { GridLayoutOptions } from 'cytoscape';
import { D3Network } from './animation';
import { getNetworksD3 } from './utils';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { setData } from './slices/networkDataSlice';
import { MyMap } from './map';



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

export function DemoNetwork(){
        const nodes = [
                { id: 0, label: "", group: 1 },
                { id: 1, label: "", group: 1 },
                { id: 2, label: "", group: 1 },
                { id: 3, label: "", group: 1 },
                { id: 4, label: "", group: 3 },
                { id: 5, label: "", group: 2 },
                { id: 6, label: "", group: 2 },
                { id: 7, label: "", group: 2 },
                { id: 8, label: "", group: 2 },
                { id: 9, label: "", group: 2 },
                { id: 10, label: "", group: 3 },
                { id: 11, label: "", group: 3 },
                { id: 12, label: "", group: 3 },
        ]

        const edges = [
                { from: 1, to: 0 },
                { from: 2, to: 0 },
                { from: 3, to: 0 },
                { from: 4, to: 1 },
                { from: 5, to: 2 },
                { from: 5, to: 6 },
                { from: 5, to: 7 },
                { from: 5, to: 8 },
                { from: 5, to: 9 },
                { from: 4, to: 10 },
                { from: 4, to: 11 },
                { from: 4, to: 12 },
        ]


        const data = {
                nodes: nodes,
                edges: edges,
        }

        const options = {
                nodes: {
                  shape: "dot",
                  size: 16,
                },
                edges: {
                        arrows: {
                          to: { enabled: false}
                        }
                },
                // physics: {
                //   forceAtlas2Based: {
                //     gravitationalConstant: -26,
                //     centralGravity: 0.005,
                //     springLength: 230,
                //     springConstant: 0.18,
                //   },
                //   maxVelocity: 146,
                //   solver: "forceAtlas2Based",
                //   timestep: 0.35,
                //   stabilization: { iterations: 150 },
                // },

                height: 700,
                width: 700
              }

        const events = {
                select: function(event) {
                var { nodes, edges } = event;
                }}


        return <Graph graph={data} options={options} events={events}/>
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
                                <MyMap/>
                        </TabPanel>
                </Box>
        );
}


export function DiscreteSlider({data}) {
        const [value, setValue] = useState(0);
        const [intervalID, setIntervalID] = useState()
        const [graph, setGraph] = useState()
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


        useEffect(  () => {
                async function fetchData(){
                        const _data = await getNetworksD3()
                        console.log(_data)
                        setGraph(_data)
                }
                fetchData()
        }, [])

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
                {graph && <D3Network data={graph} time={data[value]} width={"100%"} height={700} zoom={zoom/100} />}
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


export function MyCytoscapeComponent({elements, layout}){
        const containerRef = useRef(null);
        let cyRef = useRef(null);
        const [graph, setGraph] = useState()

        useEffect(() => {
                // Cytoscape.jsの初期化
                console.log("changed")
                cyRef.current = cytoscape({
                        container: containerRef.current,
                        // elements: CytoscapeComponent.normalizeElements(elements),
                        style: [
                                {
                                selector: 'node',
                                style: {
                                'background-color': '#ff0000',
                                'label': 'data(id)'
                                }
                                },
                                {
                                selector: 'edge',
                                style: {
                                'width': 3,
                                'line-color': '#0000ff'
                                }
                                }
                        ],
                        layout: {name: "cose"}
                });

                // コンポーネントがアンマウントされる際にCytoscape.jsのインスタンスを破棄する
                return () => {
                        if (cyRef.current) {
                                cyRef.current.destroy();
                                cyRef.current = null;
                        }
                        };
        }, []);

        useEffect(() => {
                const new_elements_collection = cyRef.current.collection(CytoscapeComponent.normalizeElements(elements), { removed: true })
                const dif = new_elements_collection.difference(cyRef.current.elements())
                console.log(dif)
                cyRef.current.add(dif)

                // dif.layout({name: "random"}).run()
                
                // cyRef.current.layout({name:"cose"}).run()
                console.log("graph_changed")
        }, [elements])

        useEffect(() => {
                const layout1 = { name: 'random' };
                const layout2 = { name: 'grid' };
                const layout3 = { name: 'circle' };
                const layout4 = { name: 'concentric' };
                const layout5 = { name: 'breadthfirst' };
                const layout6 = { name: 'cose' };  
                const layouts = [layout1, layout2, layout3, layout4, layout5, layout6]
                
                // cyRef.current.layout(layouts[layout]).run()

                console.log("layout_changed", layouts[layout])
        }, [layout])

        return <div ref={containerRef} style={{ height: '400px', width: "800px" }}></div>
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
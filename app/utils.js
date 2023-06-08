"use client"
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import Graph from "react-graph-vis";


export function UploadForm({url}) {
    function handleClick(){
      console.log("clicked");
    }
  
    const [selectedFile, setSelectedFile] = useState(null);
    const [sheets, setSheets] = useState([]);
  
    const handleFileChange = (event) => {
      setSelectedFile(event.target.files[0]);
    };

    async function handleSheets(){
        const _sheets = await getSheets();
        console.log(_sheets);
        setSheets(_sheets)
    }
  
    const handleSubmit = (event) => {
      event.preventDefault();
  
      if (selectedFile) {
        // ファイルを送信する処理
        const formData = new FormData();
        formData.append('file', selectedFile);
  
        fetch(url, {
          method: 'POST',
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            // ファイルのアップロードが完了した後の処理
            handleSheets()
            console.log('File uploaded:', data);
          })
          .catch((error) => {
            console.error('File upload error:', error);
          });

      }
    };
  
    return (
      <div>
        <Button onClick={handleClick}>Upload</Button>
        <form onSubmit={handleSubmit}>
            <input type="file" onChange={handleFileChange} />
            <button type="submit">Upload</button>
        </form>

        <SelectSheet sheets={sheets}/>
      </div>
    );
  }


export async function getNetwork(){
    const res = await fetch("get_network");
    const data = await res.json();
    // console.log(data);
    return data;
}

export function DrawNetwork({new_graph}){
  if (!new_graph){
    return (
        <div></div>
    )
  }

  const graph = {
    nodes: new_graph.nodes,
    edges: new_graph.edges
  };

  const options = {
    layout: {
      hierarchical: false
    },
    edges: {
      color: "#000000"
    },
    height: "1000px"
  };

  const events = {
    select: function(event) {
      var { nodes, edges } = event;
    }
  };

  return (
    <div>
        <Graph
            graph={graph}
            options={options}
            events={events}
        />
    </div>
  );
}

export function ShowNetwork(){
    const [graph, setgraph] = useState();

    async function handleButtonClick() {
        const data = await getNetwork();
        console.log(data);

        const _graph = data
        // const _graph = {
        //     nodes: [
        //         { id: 1, label: "Node 10000", title: "node 1 tootip text" },
        //         { id: 2, label: "Node 2", title: "node 2 tootip text" },
        //         { id: 3, label: "Node 3", title: "node 3 tootip text" },
        //         { id: 4, label: "Node 4", title: "node 4 tootip text" },
        //         { id: 5, label: "Node 50", title: "node 5 tootip text" }
        //     ]
        // };

        setgraph(_graph)
    }

    return (
        <div>
            <Button variant="contained" onClick={handleButtonClick}>表示</Button>
            {/* {showImage && <Test/>} */}
            <DrawNetwork new_graph={graph}/>
        </div>
    )
}

export async function getSheets(){
    const res = await fetch("get_sheets");
    const data = await res.json();
    return data.sheets;
}

export function SelectSheet({sheets}){
    function handleChange(){
        console.log("changed");
    }

    return (
        <div>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={0}
                label="Age"
                onChange={handleChange}
            >
                {sheets.map((sheet, index) => (
                        <MenuItem key={index} value={index}>{sheet}</MenuItem>
                ))}
                
                {/* <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem> */}
            </Select>
        </div>
    )
}

export function Test(){
    return (
        <div>
            Hallo
        </div>
    )
}
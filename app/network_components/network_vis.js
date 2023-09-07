"use client"
import * as d3 from 'd3';
import { useEffect, useRef } from 'react';


export function D3Network(props){
        const chartRef = useRef();
        const svg = useRef()
        const link = useRef()
        const node = useRef()
        const label = useRef()
        const simulation = useRef()

        function ticked() {
                node.current.attr("cx", d => d.x)
                    .attr("cy", d => d.y)
            
                link.current.attr("x1", d => d.source.x)
                    .attr("y1", d => d.source.y)
                    .attr("x2", d => d.target.x)
                    .attr("y2", d => d.target.y)

                label.current.attr("x", d => d.x)
                        .attr("y", d => d.y - 6)
        }


        useEffect( () => {
                svg.current = d3.select(chartRef.current)
                                .attr('width', props.width)
                                .attr('height', props.height)
                                .attr("viewBox", [-1000 / 2, -1000 / 2, 1000, 1000])
        
                link.current = svg.current.append("g")
                                .attr("stroke", "#999")
                                .attr("stroke-opacity", 0.6)
                                .selectAll("line")

        
                node.current = svg.current.append("g")
                                .attr("stroke", "#fff")
                                .attr("stroke-width", 1.5)
                                .selectAll("circle")
                
        
                label.current = svg.current.append("g")
                                .style("font-variant-numeric", "tabular-nums")
                                .attr("text-anchor", "middle")
                                .attr("font-size", 6)
                                .selectAll("text")
                
        
                simulation.current = d3.forceSimulation()
                                .force("charge", d3.forceManyBody())
                                .force("link", d3.forceLink().id(d => d.id))
                                .force("x", d3.forceX())
                                .force("y", d3.forceY())
                                .on("tick", ticked)
                
        }, [props.height, props.width])

        useEffect( () => {
                console.log(props.zoom)
                const zoom = 1000 / props.zoom
                svg.current.attr("viewBox", [-zoom / 2, -zoom / 2, zoom, zoom])
                
        }, [props.zoom])


        useEffect( () => {
                const data = props.data
                console.log(data)
                update(data.nodes, data.links)

                function update(nodes, links){
                        // Make a shallow copy to protect against mutation, while
                        // recycling old nodes to preserve position and velocity.
                        const old = new Map(node.current.data().map(d => [d.id, d]));
                        nodes = nodes.map(d => Object.assign(old.get(d.id) || {}, d));
                        links = links.map(d => Object.assign({}, d));
                
                        node.current = node.current
                                .data(nodes, d => d.id)
                                .join(enter => enter.append("circle")
                                        .attr("r", 5)
                                        .call(drag(simulation.current))
                                        .call(node => node.append("title").text(d => d.id)),
        
                                        update => update,
        
                                        // exit => exit.call(console.log, d => d.id)
                                )
        
                        link.current = link.current
                                .data(links, d => [d.source, d.target])
                                .join("line")
        
        
                        label.current = label.current
                                .data(nodes, d => d.id)
                                .join(
                                  enter => enter.append("text")
                                        .text(d => d.id)
                                )
                
                        simulation.current.nodes(nodes);
                        simulation.current.force("link").links(links);
                        simulation.current.alpha(1).restart().tick();
                }

        }, [props.data])


        const drag = simulation => {
                function dragstarted(event, d) {
                        if (!event.active) simulation.alphaTarget(0.3).restart();
                        d.fx = d.x;
                        d.fy = d.y;
                }
                
                function dragged(event, d) {
                        d.fx = event.x;
                        d.fy = event.y;
                }
                
                function dragended(event, d) {
                        if (!event.active) simulation.alphaTarget(0);
                        d.fx = null;
                        d.fy = null;
                }
                
                return d3.drag()
                        .on("start", dragstarted)
                        .on("drag", dragged)
                        .on("end", dragended);
        }


        return (
                <svg ref={chartRef}></svg>
        )
}

export function D3NetworkRef(props){
        const chartRef = props.chartRef;
        const svg = useRef()
        const link = useRef()
        const node = useRef()
        const label = useRef()
        // const simulation = useRef()

        function ticked() {
                // node.current.attr("cx", d => d.x)
                //     .attr("cy", d => d.y)
            
                link.current.attr("x1", d => d.source.x)
                    .attr("y1", d => d.source.y)
                    .attr("x2", d => d.target.x)
                    .attr("y2", d => d.target.y)

                label.current.attr("x", d => d.x)
                        .attr("y", d => d.y - 6)
        }


        useEffect( () => {
                svg.current = d3.select(chartRef.current)
                                .attr('width', props.width)
                                .attr('height', props.height)
                                .attr("viewBox", [0, 0, 1000, 500])
        
                link.current = svg.current.append("g")
                                .attr("stroke", "#999")
                                .attr("stroke-opacity", 0.6)
                                .selectAll("line")

        
                node.current = svg.current.append("g")
                                .attr("stroke", "#fff")
                                .attr("stroke-width", 1.5)
                                .selectAll("circle")
                
        
                label.current = svg.current.append("g")
                                .style("font-variant-numeric", "tabular-nums")
                                .attr("text-anchor", "middle")
                                .attr("font-size", 6)
                                .selectAll("text")
                
        
                // simulation.current = d3.forceSimulation()
                //                 .force("charge", d3.forceManyBody())
                //                 .force("link", d3.forceLink().id(d => d.id))
                //                 .force("x", d3.forceX())
                //                 .force("y", d3.forceY())
                //                 .on("tick", ticked)
                
        }, [props.height, props.width])

        useEffect( () => {
                console.log(props.zoom)
                const zoom = 1000 / props.zoom
                svg.current.attr("viewBox", [0, 0, zoom, 500])
                
        }, [props.zoom])


        useEffect( () => {
                const data = props.data
                update(data.nodes, data.links)

                function update(nodes, links){
                        // Make a shallow copy to protect against mutation, while
                        // recycling old nodes to preserve position and velocity.
                        const old = new Map(node.current.data().map(d => [d.id, d]));
                        nodes = nodes.map(d => Object.assign(old.get(d.id) || {}, d));
                        links = links.map(d => Object.assign({}, d));
                
                        node.current = node.current
                                .data(nodes, d => d.id)
                                .join(enter => enter.append("circle")
                                        .attr("r", 5)
                                        // .call(drag(simulation.current))
                                        .call(node => node.append("title").text(d => d.id)),
        
                                        update => update,
        
                                        // exit => exit.call(console.log, d => d.id)
                                )
        
                        link.current = link.current
                                .data(links, d => [d.source, d.target])
                                .join("line")
        
        
                        label.current = label.current
                                .data(nodes, d => d.id)
                                .join(
                                  enter => enter.append("text")
                                        .text(d => d.id)
                                )
                
                        // simulation.current.nodes(nodes);
                        // simulation.current.force("link").links(links);
                        // simulation.current.alpha(1).restart().tick();
                }

        }, [props.data])


        // const drag = simulation => {
        //         function dragstarted(event, d) {
        //                 if (!event.active) simulation.alphaTarget(0.3).restart();
        //                 d.fx = d.x;
        //                 d.fy = d.y;
        //         }
                
        //         function dragged(event, d) {
        //                 d.fx = event.x;
        //                 d.fy = event.y;
        //         }
                
        //         function dragended(event, d) {
        //                 if (!event.active) simulation.alphaTarget(0);
        //                 d.fx = null;
        //                 d.fy = null;
        //         }
                
        //         return d3.drag()
        //                 .on("start", dragstarted)
        //                 .on("drag", dragged)
        //                 .on("end", dragended);
        // }


        return (
                <svg ref={chartRef} style={{ position: 'relative', width:"100%", height:"100%", zIndex:1000}}></svg>
        )
}
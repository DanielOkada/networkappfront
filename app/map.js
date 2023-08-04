import { MapContainer, TileLayer, SVGOverlay} from 'react-leaflet'
import * as d3 from 'd3';
import { useRef, useEffect } from 'react';

export function MyMap({overlaySVG, chartRef, addressData}){
        const mapRef = useRef()
        const svgRef = useRef(null);

        const position = [36.695920313285434, 137.2202906855646]

        const bounds = [
                [36.97074107796437, 137.8660583496094],
                [36.42017738514986, 136.57379150390628],
              ]


        useEffect( () => {
                if(!addressData){return}

                const map = mapRef.current
                console.log(map)
                console.log(map.layerPointToContainerPoint(map.getPixelOrigin()), "bounds")

                function latLngToLayerPoint(d){
                        const latlng = addressData[d.id]
                        if(!latlng){return {"x": 0, "y": 0}}
                        const pixel = map.latLngToLayerPoint(latlng)
                        // console.log(pixel)
                        return pixel
                }

                function LinelatLngToLayerPoint(d){
                        const latlng = addressData[d]
                        if(!latlng){return {"x": 0, "y": 0} }
                        const pixel = map.latLngToLayerPoint(latlng)
                        // console.log(pixel)
                        return pixel
                }

                d3.select(chartRef.current).selectAll("circle")
                                        .attr("cx", d => latLngToLayerPoint(d).x )
                                        .attr("cy", d => latLngToLayerPoint(d).y )
                d3.select(chartRef.current).selectAll("text")
                                        .attr("x", d => latLngToLayerPoint(d).x)
                                        .attr("y", d => latLngToLayerPoint(d).y - 6)
                d3.select(chartRef.current).selectAll("line")
                                        .attr("x1", d => LinelatLngToLayerPoint(d.source).x )
                                        .attr("y1", d => LinelatLngToLayerPoint(d.source).y )
                                        .attr("x2", d => LinelatLngToLayerPoint(d.target).x )
                                        .attr("y2", d => LinelatLngToLayerPoint(d.target).y )

                // console.log(d3.select(chartRef.current).selectAll("line"))
                
        }, [addressData, chartRef])

        useEffect(() => {
                if (mapRef.current) {

                  // d3でSVGを描画
                  const svg = d3.select(svgRef.current);
                  svg
                    .append('circle')
                    .attr('cx', 100)
                    .attr('cy', 100)
                    .attr('r', 50)
                    .attr('fill', 'blue');
                }
              }, []);

        return (
                <MapContainer center={position} zoom={10} scrollWheelZoom={true} style={{height:500}} ref={mapRef}>
                        <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <SVGOverlay bounds={bounds} >
                                {overlaySVG}
                        </SVGOverlay>
                        {/* <svg
                                ref={svgRef}
                                style={{
                                position: 'absolute',
                                zIndex: 1000, // 地図よりも手前に表示
                                }}
                         /> */}
                </MapContainer>
        )
}
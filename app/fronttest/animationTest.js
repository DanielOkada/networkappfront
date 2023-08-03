"use client"
import * as d3 from 'd3';
import { useState, useEffect, useRef } from 'react';

export function MyTest(props){
        const chartRef = useRef(null);


        useEffect(() => {
                const data = [
                        {value:2, name:"a", index:0},
                        {value:1, name:"b", index:1},
                        {value:2, name:"c", index:2},
                ]
                const data2 = [
                        {value:1, name:"a", index:0},
                        {value:3, name:"b", index:1},
                        {value:4, name:"d", index:3},
                        // {value:2, name:"c"},
                ]
                const keyframes = [
                        ["00", data],
                        ["01", data2]
                ]

                const svg = d3.select(chartRef.current)
                        .append('svg')
                        .attr('width', 500)
                        .attr('height', 700)
          
                const updateBars = bars(svg);
                // const updateAxis = axis(svg);
                const updateLabels = labels(svg);
                // const updateTicker = ticker(svg);

                const duration = 300

                async function trans(){
                        for (const keyframe of keyframes) {
                                const transition = svg.transition()
                                        .duration(duration)
                                        .ease(d3.easeLinear);
                                
                                // Extract the top bar’s value.
                                // x.domain([0, keyframe[1][0].value]);
                                
                                // updateAxis(keyframe, transition);
                                updateBars(keyframe, transition);
                                updateLabels(keyframe, transition);
                                // updateTicker(keyframe, transition);
                                
                                // invalidation.then(() => svg.interrupt());
                                await transition.end();
                        }
                }

                trans()

              }, [props.width, props.height]);
        
        // async function dataGetter(){
        //         const res = await fetch("test");
        //         const data = await res.json();
        //         console.log(data)
        //         setData(data)
        // }

        // if (!data){
        //         dataGetter()
        // }

        function bars(svg) {
                let bar = svg.append("g")
                        .attr("fill-opacity", 0.6)
                        .selectAll("rect");

                const color = "blue"
              
                return ([date, data], transition) => 
                        bar = bar
                                .data(data, d => d.name)
                                .join(
                                        enter => enter.append("rect")
                                        .attr("fill", color)
                                        .attr("height", 100)
                                        .attr("x", 0)
                                        .attr("y", d => d.index * 120)
                                        .attr("width", 0),

                                        update => update,

                                        exit => exit.transition(transition).remove()
                                        // .attr("y", d => d.value * 100)
                                        .attr("width", 0)
                                )
                                .call(bar => bar.transition(transition)
                                        // .attr("y", d => d.value * 100)
                                        .attr("width", d => d.value * 100)
                                )
              }

        function labels(svg) {
                let label = svg.append("g")
                        .style("font", "bold 12px var(--sans-serif)")
                        .style("font-variant-numeric", "tabular-nums")
                        .attr("text-anchor", "end")
                        .selectAll("text");
                
                return ([date, data], transition) => 
                        label = label
                                .data(data, d => d.name)
                                .join(
                                        enter => enter.append("text")
                                        // .attr("transform", d => `translate(${d.value * 80},${d.index + 20})`)
                                        .attr("y", d => d.index * 120)
                                        .attr("x", -6)
                                        .attr("dy", "-0.25em")
                                        .text(d => d.name)
                                        .call(
                                                text => text.append("tspan")
                                                .attr("fill-opacity", 0.7)
                                                .attr("font-weight", "normal")
                                                .attr("x", -6)
                                                .attr("dy", "1.15em")
                                        ),

                                        update => update,

                                        exit => exit.transition(transition).remove()
                                        // .attr("transform", d => `translate(${x((next.get(d) || d).value)},${y((next.get(d) || d).rank)})`)
                                        // .call(g => g.select("tspan").tween("text", d => textTween(d.value, (next.get(d) || d).value)))
                                )
                                .call(
                                        bar => bar.transition(transition)
                                        .attr("transform", d => `translate(${d.value * 80},${d.index + 20})`)
                                        // .call(
                                        //         g => g.select("tspan").tween("text", d => textTween((prev.get(d) || d).value, d.value))
                                        // )
                                )
        }


        return (
                <div ref={chartRef}></div>
        )
}


export function PieChart(props) {
        // useRefを設定します
        const ref = useRef(null);
        const cache = useRef(props.data);

        // d3.pieで 円弧の始点/終点計算を設定します
        const createPie = d3
        .pie()
        .value(d => d.value)
        .sort(null);

        // d3.arcで 円弧の外側の半径、内側の半径を設定します
        const createArc = d3
        .arc()
        .innerRadius(props.innerRadius)
        .outerRadius(props.outerRadius);

        // 項目の色を設定します
        const colors = d3.scaleOrdinal(d3.schemeCategory10);

        // フォーマットを設定します
        const format = d3.format(".2f");

        useEffect(
                () => {
                        const data = createPie(props.data);
                        const prevData = createPie(cache.current);
                        const group = d3.select(ref.current);
                
                        // 各円弧に data をセットします
                        const groupWithData = group.selectAll("g.arc").data(data);
                
                        // 不要な要素を削除します
                        groupWithData.exit().remove();
                
                        // データをセットされた新しい element にバインドする
                        const groupWithUpdate = groupWithData
                        .enter()
                        .append("g") // group container を追加する
                        .attr("class", "arc");
                
                        const path = groupWithUpdate
                        .append("path") // path を追加する
                        .merge(groupWithData.select("path.arc")); // merge() は　enter() と update()を組み合わせた関数
                
                        const arcTween = (d, i) => {
                        const interpolator = d3.interpolate(prevData[i], d);
                
                        return t => createArc(interpolator(t));
                        };
                
                        // Pieグラフ をオシャレにする
                        path
                        .attr("class", "arc")
                        .attr("fill", (d, i) => colors(i))
                        .transition()
                        .attrTween("d", arcTween);
                
                        const text = groupWithUpdate
                        .append("text") // text を追加する
                        .merge(groupWithData.select("text"));
                
                        // text をオシャレにする
                        text
                        .attr("text-anchor", "middle")
                        .attr("alignment-baseline", "middle")
                        .style("fill", "white")
                        .style("font-size", 10)
                        .transition()
                        .attr("transform", d => `translate(${createArc.centroid(d)})`)
                        .tween("text", (d, i, nodes) => {
                        const interpolator = d3.interpolate(prevData[i], d);
                
                        return t => d3.select(nodes[i]).text(format(interpolator(t).value));
                        });
                
                        cache.current = props.data;
                        },
                [props.data]
              )

        return (
                <svg width={props.width} height={props.height}>
                  <g
                    ref={ref}
                    transform={`translate(${props.outerRadius} ${props.outerRadius})`}
                  />
                </svg>
              )
}

export function Pie(){
        const [width, height, innerRadius, outerRadius] = [200, 200, 60, 100];

        // ボタンをクリックした時、ランダムなデータを生成する
        const generateData = (value, length = 5) =>
                d3.range(length).map((item, index) => ({
                        date: index,
                        value: value === null || value === undefined ? Math.random() * 100 : value
          }));
        const [data, setData] = useState(generateData());
        const changeData = () => {
          setData(generateData());
        };

        return (
                <div>
                <div>
                  <button onClick={changeData}>Click</button>
                </div>
                <div>
                  <h2 className="label">React Hook</h2>
                  <PieChart
                    data={data}
                    width={width}
                    height={height}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                  />
                </div>
              </div>
        )
}


export function MyTest2(){
        const ref = useRef(null);

        useEffect(() => {
                // D3.jsのコードをここに追加します
                const svg = d3.select(ref.current)
                  .append('svg')
                  .attr('width', 400)
                  .attr('height', 200);
            
                svg.append('rect')
                  .attr('x', 50)
                  .attr('y', 50)
                  .attr('width', 100)
                  .attr('height', 100)
                  .attr('fill', 'blue');
              }, []);

        return (
                <div ref={ref}></div>
              )
}
/* globals d3 */
const {Scene} = spritejs;
const container = document.getElementById('stage');
const scene = new Scene({
  container,
  width: 1200,
  height: 900,
  mode: 'stickyWidth',
});

const layer = scene.layer('fglayer', {
  handleEvent: false,
  autoRender: false,
});

document.querySelector('#stage canvas').style.backgroundColor = '#313131';

const simulation = d3.forceSimulation()
  .force('link', d3.forceLink().id(d => d.id))
  .force('charge', d3.forceManyBody())
  .force('center', d3.forceCenter(400, 300));

d3.json('https://s0.ssl.qhres.com/static/f74a79ccf53d8147.json', (error, graph) => {
  if(error) throw error;

  simulation
    .nodes(graph.nodes)
    .on('tick', ticked);

  simulation.force('link')
    .links(graph.links);

  d3.select(layer.canvas)
    .call(d3.drag()
      .container(layer.canvas)
      .subject(dragsubject)
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended));

  // draw lines
  d3.select(layer).selectAll('path')
    .data(graph.links)
    .enter()
    .append('path')
    .attr('d', (d) => {
      const [sx, sy] = [d.source.x, d.source.y];
      const [tx, ty] = [d.target.x, d.target.y];
      return `M${sx} ${sy} L ${tx} ${ty}`;
    })
    .attr('name', (d, index) => {
      return `path${index}`;
    })
    .attr('strokeColor', 'white');

  // draw spots
  // ! due to d3 rules, you have to set attributes seperatly
  d3.select(layer).selectAll('sprite')
    .data(graph.nodes)
    .enter()
    .append('sprite')
    .attr('pos', (d) => {
      return [d.x, d.y];
    })
    .attr('size', [10, 10])
    .attr('border', [1, 'white'])
    .attr('borderRadius', 5)
    .attr('anchor', 0.5);

  function ticked() {
    d3.select(layer).selectAll('path')
      .attr('d', (d) => {
        const [sx, sy] = [d.source.x, d.source.y];
        const [tx, ty] = [d.target.x, d.target.y];
        return `M${sx} ${sy} L ${tx} ${ty}`;
      })
      .attr('strokeColor', 'white')
      .attr('lineWidth', 1);
    d3.select(layer).selectAll('sprite')
      .attr('pos', (d) => {
        return [d.x, d.y];
      });
    layer.render();
  }

  function dragsubject() {
    const [x, y] = layer.toLocalPos(d3.event.x, d3.event.y);
    return simulation.find(x, y);
  }
});

function dragstarted() {
  if(!d3.event.active) simulation.alphaTarget(0.3).restart();

  const [x, y] = [d3.event.subject.x, d3.event.subject.y];
  d3.event.subject.fx0 = x;
  d3.event.subject.fy0 = y;
  d3.event.subject.fx = x;
  d3.event.subject.fy = y;

  const [x0, y0] = layer.toLocalPos(d3.event.x, d3.event.y);
  d3.event.subject.x0 = x0;
  d3.event.subject.y0 = y0;
}

function dragged() {
  const [x, y] = layer.toLocalPos(d3.event.x, d3.event.y),
    {x0, y0, fx0, fy0} = d3.event.subject;
  const [dx, dy] = [x - x0, y - y0];

  d3.event.subject.fx = fx0 + dx;
  d3.event.subject.fy = fy0 + dy;
}

function dragended() {
  if(!d3.event.active) simulation.alphaTarget(0);
  d3.event.subject.fx = null;
  d3.event.subject.fy = null;
}
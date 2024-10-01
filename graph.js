        function drawNode(node, color, label) {
            let position = nodes[node];
            if (!position) return;

            ctx.beginPath();
            ctx.arc(position.x, position.y, 32, 0, 2 * Math.PI, false);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.fillStyle = 'black';
            ctx.font = '26px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(label, position.x, position.y);
        }

        function drawConnection(node1, node2, color, thickness) {
            if (tab3.active) return;
            if (tab2.active) return;

            const position1 = nodes[node1];
            const position2 = nodes[node2];
            const directionX = position2.x - position1.x;
            const directionY = position2.y - position1.y;
            const distance = Math.sqrt(directionX * directionX + directionY * directionY);
            const unitDirectionX = directionX / distance;
            const unitDirectionY = directionY / distance;

            //Positionen der Knotenränder verbundener Knoten
            const radius = 32;
            const borderPosition1 = {
                x: position1.x + unitDirectionX * radius,
                y: position1.y + unitDirectionY * radius
            };
            const borderPosition2 = {
                x: position2.x - unitDirectionX * radius,
                y: position2.y - unitDirectionY * radius
            };

            //Methode Verbindungen definieren und zeichnen (stroke)
            ctx.beginPath();
            ctx.moveTo(borderPosition1.x, borderPosition1.y);
            ctx.lineTo(borderPosition2.x, borderPosition2.y);
            ctx.strokeStyle = color;
            ctx.lineWidth = thickness;
            ctx.stroke();
        }

        function drawWeight(node1, node2, weight) {
            const { x: x1, y: y1 } = nodes[node1];
            const { x: x2, y: y2 } = nodes[node2];
            const midX = ({ x: x1, y: y1 }.x + { x: x2, y: y2 }.x) / 2;
            const midY = ({ x: x1, y: y1 }.y + { x: x2, y: y2 }.y) / 2;
            // Berechne die Orientierung der Kante
            const horizontal = Math.abs(x1 - x2) > Math.abs(y1 - y2);

            ctx.fillStyle = 'black';
            ctx.font = '28px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            if (horizontal) {
                // Für eher horizontale Kanten, leicht über der Kante zeichnen
                ctx.fillText(weight, midX, midY - 14);
            } else {
                // Für eher vertikale Kanten, links von der Kante zeichnen
                ctx.fillText(weight, midX - 14, midY);
            }
        }

        function drawGraph(selectedNodeCount) {
            let drawnEdges = {};        // Speichert bereits gezeichnete Kanten wichtig um dopplungen zu vermeiden
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            edges.forEach(edge => {
                if (edge.from.charCodeAt(0) - 65 < selectedNodeCount && edge.to.charCodeAt(0) - 65 < selectedNodeCount) {
                    let sortedEdge = [edge.from, edge.to].sort().join('-');         // Sortiere die Kanten, um Konsistenz zu gewährleisten
                    if (!drawnEdges[sortedEdge]) {          // Schleife Bedingung 
                        drawConnection(edge.from, edge.to, '#8a8a8a', 1);
                        drawWeight(edge.from, edge.to, edge.weight);
                        drawnEdges[sortedEdge] = true;
                    }
                }
            });

            // zeichnet nodes von ASCII 65 (A) an bis selectenodecount
            Object.keys(nodes).forEach(node => {
                if (node.charCodeAt(0) - 65 < selectedNodeCount) {
                    drawNode(node, 'white', node);
                }
            });
        }



        // führt nodes+edges in ein gemeinsames globales (zugriff .js selbe Ordner) array zusammen
        function createGraph() {
            const selectedNodeCount = parseInt(document.getElementById('nodeCount').value, 10);
            graph = {};
            for (const node of Object.keys(nodes)) {
                if (node.charCodeAt(0) - 65 < selectedNodeCount) {
                    graph[node] = {};

                    for (const edge of edges) {
                        if (node === edge.from && edge.to.charCodeAt(0) - 65 < selectedNodeCount) {
                            graph[node][edge.to] = edge.weight;
                            if (!graph[edge.to]) {
                                graph[edge.to] = {};
                            }
                        }
                    }
                }
            }

        }

        function updateGraph() {
            const selectedNodeCount = parseInt(document.getElementById('nodeCount').value, 10);
            const selectedConfiguration = graphConfigurations[selectedNodeCount];

            nodes = selectedConfiguration.nodes;
            edges = selectedConfiguration.edges;

            const weights = {};
            //Zuweisung gleiche key und gleiche Werte Kanten zwischen 2 nodes
            edges.forEach(edge => {
                let key = [edge.from, edge.to].sort().join('-');
                if (!weights[key]) {
                    weights[key] = Math.floor(Math.random() * 12) + 1;
                }

                edge.weight = weights[key];

            });

            drawNode('A', 'lightgreen', 'A(0)');
            drawGraph(selectedNodeCount);
            createGraph(selectedNodeCount);
            drawNeighbors('A');
        }

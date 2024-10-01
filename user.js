        function drawMessage(message, color, fontSize = 28) {
            ctx2.clearRect(0, 0, canvas.width, canvas.height);
            if (message === 'Glückwunsch! Dies war der letzte Knoten in der Priority Queue und du hast\nalle kürzesten Distanzen bestimmt!\n\nDijkstras Algorithmus wurde erfolgreich gelöst! :-)') {
                const elapsedTime = endTimer();
                const formattedTime = formatTime(elapsedTime);
                message += `\n\nBenötigte Zeit: ${formattedTime}\n\nMit PFEILTASTE Links und Rechts kannst du dir die einzelnen\nkürzesten Pfade noch einmal ansehen.`;
            }

            ctx2.fillStyle = color;
            ctx2.font = `${fontSize}px Arial`; // Verwende die übergebene Schriftgröße

            const lines = message.split('\n');
            let yOffset = 30;
            const lineHeight = fontSize + 6;

            lines.forEach((line) => {
                ctx2.fillText(line, 10, yOffset);
                yOffset += lineHeight;
            });
        }

        /* NK Vorgefertigter Graph */
        function drawNeighbors(node) {
            // Initialisierung der NK zu A
            if (node === 'A') {
                for (let nearNode of nearNodes) {
                    const label = graph[nearNode].label ? graph[nearNode].label : nearNode;
                    drawNode(nearNode, 'lightgray', label);
                }
            }

            //zeichnet alte NK wieder weiß
            for (let nearNode of nearNodes) {
                const label = graph[nearNode].label ? graph[nearNode].label : nearNode;
                drawNode(nearNode, 'white', label);
            }

            nearNodes = [];
            let neighborNodes = Object.keys(graph[node]);

            // Schleife zum zeichnen der NK
            for (let neighbor of neighborNodes) {
                const label = graph[neighbor].label ? graph[neighbor].label : neighbor;
                drawNode(neighbor, 'lightgray', label);
                nearNodes.push(neighbor);
            }
        }

        /* NK Zufälliger Graph */
        function drawRndNode(position, color, label) {
            ctx.beginPath();
            ctx.strokeStyle = 'black';
            ctx.arc(position.x, position.y, 28, 0, 2 * Math.PI, false);
            ctx.fillStyle = label === 'node' ? 'lightgrey' : color;
            ctx.fill();
            ctx.lineWidth = 1;
            ctx.stroke();

            ctx.fillStyle = 'black';
            ctx.font = '24px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(label === 'A' ? 'A(0)' : label, position.x, position.y);
        }


        function drawRndNeighbors(currentNode, isStartNode = false) {
            // A immer gruen und Startknoten
            if (currentNode.node === 'A') {
                let startNode = nodes.find(n => n.label === 'A');
                if (startNode) {
                    drawRndNode({ x: startNode.x, y: startNode.y }, 'lightgreen', 'A');
                }
            } else {
                // Zeichne den aktuellen Knoten weiß
                drawRndNode({ x: currentNode.x, y: currentNode.y }, 'white', currentNode.node);
            }

            // Reset vorherige NK
            for (let nearNode of nearNodes) {
                let node = nodes.find(n => n.label === nearNode);
                if (node) {
                    drawRndNode({ x: node.x, y: node.y }, 'white', nearNode);
                }
            }

            nearNodes = [];

            //  NK aus graph des aktuellen Knotens und filtert alle K die nur undef. NK haben
            let neighborNodes = Object.entries(graph[currentNode.node])
                .filter(([node, value]) => value !== undefined)
                .map(([node, value]) => node);

            // Schelife zum zeichnen der NK
            for (let neighbor of neighborNodes) {
                let node = nodes.find(n => n.label === neighbor);
                if (node) {
                    drawRndNode({ x: node.x, y: node.y }, 'lightgray', neighbor);
                    nearNodes.push(neighbor);
                }
            }

            if (!isStartNode) {
                drawRndShortestPath();
            }
        }

        /* NK Eigener Graph */
        function drawOwnNeighNode(x, y, label, color) {
            ctx.strokeStyle = 'black';
            ctx.beginPath();
            ctx.arc(x, y, 30, 0, 2 * Math.PI, false);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.fillStyle = 'black';
            ctx.font = '26px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(label, x, y);
        }

        function drawOwnNeighbors(currentNode) {
            const radius = 30;
            const nodeLabel = currentNode.node;

            // Initialisierung der NK zu A
            if (nodeLabel === 'A') {
                for (let nearNode of nearNodes) {
                    let node = nodes.find(n => n.label === nearNode);
                    if (node) {
                        drawOwnNeighNode(node.x, node.y, nearNode, 'lightgray');
                    }
                }
            }

            //zeichnet alte NK wieder weiß
            for (let nearNode of nearNodes) {
                let node = nodes.find(n => n.label === nearNode);
                if (node) {
                    drawOwnNeighNode(node.x, node.y, nearNode, 'white');
                }
            }

            nearNodes = [];
            let neighborNodes = graph[nodeLabel];

            // Schleife zum zeichnen der NK
            for (let neighbor in neighborNodes) {
                let node = nodes.find(n => n.label === neighbor);
                if (node) {
                    drawOwnNeighNode(node.x, node.y, neighbor, 'lightgray');
                    nearNodes.push(neighbor);

                    // Zeichne die Verbindungslinie zwischen dem aktuellen Knoten und dem Nachbarknoten
                    let currentNodeObj = nodes.find(n => n.label === nodeLabel);
                    let position1 = { x: currentNodeObj.x, y: currentNodeObj.y };
                    let position2 = { x: node.x, y: node.y };

                    // Berechnet die Richtung und Distanz zwischen den Knoten
                    const directionX = position2.x - position1.x;
                    const directionY = position2.y - position1.y;
                    const distance = Math.sqrt(directionX * directionX + directionY * directionY);
                    const unitDirectionX = directionX / distance;
                    const unitDirectionY = directionY / distance;

                    // Berechnet die Positionen der Knotenränder
                    const borderPosition1 = {
                        x: position1.x + unitDirectionX * radius,
                        y: position1.y + unitDirectionY * radius
                    };
                    const borderPosition2 = {
                        x: position2.x - unitDirectionX * radius,
                        y: position2.y - unitDirectionY * radius
                    };

                    // Zeichnet die Linie zwischen den Knoten
                    ctx.beginPath();
                    ctx.moveTo(borderPosition1.x, borderPosition1.y);
                    ctx.lineTo(borderPosition2.x, borderPosition2.y);
                    ctx.strokeStyle = 'black';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }

        // Zeichnet den kürzesten Pfad vorgefertigt
        function drawShortestPath() {
            if (currentPathIndex < shortestPathDraw.length) {
                let path = shortestPathDraw[currentPathIndex];

                // Kanten Knoten kürzester Pfades zeichnen
                for (let i = 0; i < path.length - 1; i++) {
                    const node1 = path[i].node;
                    const node2 = path[i + 1].node;
                    drawConnection(node1, node2, 'red', 3);

                    ctx.strokeStyle = 'black'; // Setze die Linienfarbe auf Schwarz zurück
                }

                if (path.length && path.slice(-1)[0].node) {
                    drawNeighbors(path.slice(-1)[0].node);
                }

                // Alle bisher grün markierten Knoten und den aktuellen Pfad zeichnen
                for (let i = 0; i <= currentPathIndex; i++) {
                    let currentPath = shortestPathDraw[i];
                    currentPath.forEach((pathNode, index) => {
                        let position = nodes[pathNode.node];
                        ctx.beginPath();
                        ctx.arc(position.x, position.y, 32, 0, 2 * Math.PI, false);

                        if (i === currentPathIndex && index === currentPath.length - 1) {
                            ctx.fillStyle = '#FFD580'; // Helles Orange für den letzten Knoten des aktuellen Pfades
                        } else {
                            ctx.fillStyle = 'lightgreen';
                        }

                        ctx.strokeStyle = 'red'; // Setze die Linienfarbe auf rot zurück
                        ctx.fill();
                        ctx.lineWidth = 1;
                        ctx.stroke();
                        ctx.fillStyle = 'black';
                        ctx.font = '22px Arial';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillText(`${pathNode.node} (${pathNode.distance})`, position.x, position.y);
                    });
                }
            }
        }

        function drawRndShortestPath() {
            if (currentPathIndex < shortestPathDraw.length) {
                const radius = 30;

                for (let idx = 0; idx <= currentPathIndex; idx++) {
                    let path = shortestPathDraw[idx];

                    for (let i = 0; i < path.length - 1; i++) {
                        let node1 = path[i].node;
                        let node2 = path[i + 1].node;
                        let pos1 = nodes.find(n => n.label === node1);
                        let pos2 = nodes.find(n => n.label === node2);

                        if (pos1 && pos2) {
                            const angle = Math.atan2(pos2.y - pos1.y, pos2.x - pos1.x);
                            const startX = pos1.x + radius * Math.cos(angle);
                            const startY = pos1.y + radius * Math.sin(angle);
                            const endX = pos2.x - radius * Math.cos(angle);
                            const endY = pos2.y - radius * Math.sin(angle);

                            ctx.beginPath();
                            ctx.moveTo(startX, startY);
                            ctx.lineTo(endX, endY);
                            ctx.strokeStyle = 'red';
                            ctx.lineWidth = 3;
                            ctx.stroke();
                        }
                    }

                    path.forEach((pathNode, index) => {
                        let node = nodes.find(n => n.label === pathNode.node);

                        ctx.beginPath();
                        ctx.arc(node.x, node.y, 30, 0, 2 * Math.PI, false);

                        if (index === path.length - 1 && idx === currentPathIndex) {

                            ctx.fillStyle = '#FFD580';
                        } else {
                            ctx.fillStyle = 'lightgreen';
                        }

                        ctx.strokeStyle = 'red';
                        ctx.fill();
                        ctx.lineWidth = 1;
                        ctx.stroke();
                        ctx.fillStyle = 'black';
                        ctx.font = '22px Arial';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillText(`${pathNode.node} (${pathNode.distance})`, node.x, node.y);
                    });
                }
            }
        }

        function drawOwnShortestPath() {
            const radius = 30;
            if (currentPathIndex < shortestPathDraw.length) {
                let path = shortestPathDraw[currentPathIndex];

                // Kanten Knoten kürzester Pfade
                for (let i = 0; i < path.length - 1; i++) {
                    let node1Label = path[i].node;
                    let node2Label = path[i + 1].node;
                    let node1 = nodes.find(n => n.label === node1Label);
                    let node2 = nodes.find(n => n.label === node2Label);

                    if (node1 && node2) {
                        let position1 = { x: node1.x, y: node1.y };
                        let position2 = { x: node2.x, y: node2.y };

                        // Berechnet die Richtung und Distanz zwischen den Knoten
                        const directionX = position2.x - position1.x;
                        const directionY = position2.y - position1.y;
                        const distance = Math.sqrt(directionX * directionX + directionY * directionY);
                        const unitDirectionX = directionX / distance;
                        const unitDirectionY = directionY / distance;

                        // Berechnet die Positionen der Knotenränder
                        const borderPosition1 = {
                            x: position1.x + unitDirectionX * radius,
                            y: position1.y + unitDirectionY * radius
                        };
                        const borderPosition2 = {
                            x: position2.x - unitDirectionX * radius,
                            y: position2.y - unitDirectionY * radius
                        };

                        // Zeichnet die Linie zwischen den Knoten
                        ctx.beginPath();
                        ctx.moveTo(borderPosition1.x, borderPosition1.y);
                        ctx.lineTo(borderPosition2.x, borderPosition2.y);
                        ctx.strokeStyle = 'red';
                        ctx.lineWidth = 3;
                        ctx.stroke();
                    }
                }

                // Zeichne aktuellen Knoten und die Nachbarknoten
                let currentNode = path[path.length - 1];
                drawOwnNeighbors(currentNode);

                for (let i = 0; i <= currentPathIndex; i++) {
                    let currentPath = shortestPathDraw[i];
                    currentPath.forEach((pathNode, index) => {
                        let node = nodes.find(n => n.label === pathNode.node);
                        ctx.beginPath();
                        ctx.arc(node.x, node.y, 30, 0, 2 * Math.PI, false);

                        if (i === currentPathIndex && index === currentPath.length - 1) {
                            ctx.fillStyle = '#FFD580'; // Helles Orange für den letzten Knoten des aktuellen Pfades
                        } else {
                            ctx.fillStyle = 'lightgreen';
                        }


                        ctx.strokeStyle = 'red'; // Setze die Linienfarbe auf rot zurück
                        ctx.fill();
                        ctx.lineWidth = 1;
                        ctx.stroke();
                        ctx.fillStyle = 'black';
                        ctx.font = '21px Arial';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillText(`${pathNode.node}(${pathNode.distance})`, node.x, node.y);
                    });
                }

            }
        }

        // Event-Listener für Screenshot Ausgabe
        document.addEventListener('keydown', function (event) {
            if (algorithmCompleted) {
                if (event.key === 'ArrowLeft') {
                    if (currentScreenshotIndex > 0) {
                        currentScreenshotIndex--;
                        displayScreenshot();
                    }
                } else if (event.key === 'ArrowRight') {
                    if (currentScreenshotIndex < screenshots.length - 1) {
                        currentScreenshotIndex++;
                        displayScreenshot();
                    }
                }
            }
        });

        function displayScreenshot() {
            let screenshotImage = new Image();
            screenshotImage.onload = function () {
                ctx.clearRect(0, 0, canvas1.width, canvas1.height);
                ctx.drawImage(screenshotImage, 0, 0);
            };
            screenshotImage.src = screenshots[currentScreenshotIndex];
        }

        // Validierung der Benutzereingabe
        function validateInput() {
            if (algorithmCompleted) {
                return;
            }
            let sortedKeys = Object.keys(pqStates);
            if (currentIndex >= sortedKeys.length) {
                currentIndex = sortedKeys.indexOf('A');
            }

            let key = sortedKeys[currentIndex];
            let userInput, userEntries, expectedState;

            let screenshot = canvas.toDataURL();
            screenshots.push(screenshot);

            userInput = document.getElementById('inputf').value.toUpperCase().replace(/\s+/g, '');
            // Methoden zur Angleichung der Eingabe und des erwarteten Zustands
            userEntries = userInput
                .toLowerCase()
                .replace(/\s+/g, '')
                .split(',')
                .sort()
                .join(',');

            expectedState = pqStates[key]
                .map(element => `${element.node.toLowerCase()}${element.distance}`)
                .sort()
                .join(',');
            if (userEntries === expectedState) {
                userInput = userInput.split(',')
                    .sort((a, b) => {
                        let numA = parseInt(a.slice(1));
                        let numB = parseInt(b.slice(1));

                        if (numA === numB) {
                            return a[0].localeCompare(b[0]);
                        }
                        return numA - numB;
                    })
                    .join(',');

                let userInputArray = userInput.split(',');
                let formattedUserInput = userInputArray.map(element => {
                    let letter = element.charAt(0);
                    let number = element.slice(1);
                    return `${letter}(${number})`;
                }).join(',');

                // Ausgabe des kürzesten Knotens
                let shortestDistanceNode = userInputArray[0];
                let letter = shortestDistanceNode.charAt(0);
                let number = shortestDistanceNode.slice(1);
                let output = `${letter}(${number})`;
                document.getElementById('Element' + (currentIndex + 1)).value = output;
                document.getElementById('priorityQueue' + (currentIndex + 1)).value = formattedUserInput;

                // Identifiziere neue und aktualisierte Knoten aus pqStates
                let previousState = currentIndex > 0 ? pqStates[sortedKeys[currentIndex - 1]] : [];
                let currentState = pqStates[key];

                let newNodes = currentState.filter(node => !previousState.some(prevNode => prevNode.node === node.node));
                let updatedNodes = currentState.filter(node => previousState.some(prevNode => prevNode.node === node.node && prevNode.distance !== node.distance));


                if (isOwnNodesNewActive) {
                    drawOwnShortestPath(shortestPathDraw[currentPathIndex]);
                } else if (isRndNodesActive) {
                    drawRndShortestPath(shortestPathDraw[currentPathIndex]);
                    let currentNode = shortestPaths[currentIndex + 1];
                    drawRndNeighbors(currentNode);
                } else {
                    drawShortestPath(shortestPathDraw[currentPathIndex]);
                }

                currentIndex++;
                currentPathIndex++;

                // Überprüfe, ob es das letzte Element in der Priority Queue ist
                if (currentIndex === sortedKeys.length - 1) {
                    drawMessage('Glückwunsch! Dies war der letzte Knoten in der Priority Queue und du hast\nalle kürzesten Distanzen bestimmt!\n\nDijkstras Algorithmus wurde erfolgreich gelöst! :-)', 'green');
                    algorithmCompleted = true;

                    let finalScreenshot = canvas.toDataURL();
                    screenshots.push(finalScreenshot);

                    currentScreenshotIndex = screenshots.length - 1;

                } else {
                    // Ausgabe der neuen und aktualisierten Knoten
                    if (newNodes.length > 0 || updatedNodes.length > 0) {
                        let message = '';

                        if (newNodes.length > 0) {
                            message += "Neue Knoten:\n" + newNodes.map(node => `${node.node}(${node.distance})`).join(', ') + "\n\n";
                        }

                        if (updatedNodes.length > 0) {
                            message += "Aktualisierte Knoten:\n" + updatedNodes.map(node => `${node.node}(${node.distance})`).join(', ');
                        }

                        drawMessage(message, 'blue', 32);
                    } else {
                        drawMessage("Nur Ausgabe, kein Update!", 'blue', 32);
                    }

                    let remainingElements = formattedUserInput.split(',').slice(1);
                    let nextInput = remainingElements.map(element => element.replace(/\(|\)/g, '')).join(',');

                    document.getElementById('inputf').value = nextInput;
                }

                // Überprüfen, ob Zeile21 Ausgabetabelle keinen leeren Wert hat und Z22 vorhanden
                if (document.getElementById('Element21').value !== '' && !document.getElementById('Element22')) {
                    // Tabelle mit ID "distanceTable" auswählen
                    let table = document.getElementById('distanceTable');

                    // 5 neue Zeilen hinzufügen
                    for (let i = 22; i <= 26; i++) {
                        let newRow = table.insertRow();
                        let cell1 = newRow.insertCell();
                        let cell2 = newRow.insertCell();

                        cell1.innerHTML = `<input type="text" id="Element${i}" placeholder="...">`;
                        cell2.innerHTML = `<input type="text" id="priorityQueue${i + 1}" placeholder="...">`;
                    }
                }
            } else {
                drawMessage('Die Eingabe ist nicht korrekt!\nDu kannst dir per "Hilf mir" Button die korrekte Antwort anzeigen lassen!\n\nDies geht aber nur 3 mal pro Spiel!\nBitte versuche es noch einmal!', 'red');
            }
        }

        function showExpectedState() {
            event.stopPropagation();

            if (showExpectedStateCount >= 3) {
                const message = "Alle Hilfen wurden aufgebraucht. Versuche es nun selbst!";
                drawMessage(message, 'red');
                return;
            }

            let remainingUses = 3 - showExpectedStateCount;
            // Sortiert die Schlüssel der pqStates und gibt den erwarteten Zustand aus
            let sortedKeys = Object.keys(pqStates);
            if (currentIndex >= sortedKeys.length) {
                currentIndex = sortedKeys.indexOf('A');
            }
            // sortedk und currentIndex als Index für den erwarteten Zustand müssen passen!
            let key = sortedKeys[currentIndex];
            let expectedState = pqStates[key]
                .map(element => `${element.node}${element.distance}`)
                .sort()
                .join(', ');

            // Überprüfen, ob der aktuelle expectedState dem letzten angezeigten expectedState entspricht
            if (expectedState === lastExpectedState) {
                const message = `Der erwartete Zustand wurde bereits angezeigt für Knoten ${key} mit:\n\n ${expectedState}!`;
                drawMessage(message, 'red');
                return;
            }

            const message = `Die P.Q. für Knoten ${key} lautet: ${expectedState} \n\nVerbleibende Nutzungen: ${remainingUses - 1}`;

            if (remainingUses === 0) {
                message += `\nAlle Hilfen wurden aufgebraucht.\n\n Knoten ${key} mit:\n\n ${expectedState}!`;
            }

            drawMessage(message, 'red');
            showExpectedStateCount++;
            lastExpectedState = expectedState; // Speichern des aktuell angezeigten expectedState
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////// Event listener der 3 Spielmodi

        // key logger Enter
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                if (document.getElementById('inputf') === document.activeElement) {
                    validateInput();
                }
            }
        });

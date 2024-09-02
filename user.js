
// Validierung der Benutzereingabe
function validateInput() {
    let sortedKeys = Object.keys(pqStates);

    if (currentIndex >= sortedKeys.length) {
        currentIndex = sortedKeys.indexOf('A');
    }

    let key = sortedKeys[currentIndex];
    let userInput, userEntries, expectedState;

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

        // Benutzereingabe > Array, sortieren und dann wieder in String umwandeln
        userInput = userInput.split(',')
            .sort((a, b) => {
                // Extrahiert numerischen Werte und vergleicht sie
                let numA = parseInt(a.slice(1));
                let numB = parseInt(b.slice(1));

                // Zahlen gleich > vergleichen Buchstaben
                if (numA === numB) {
                    return a[0].localeCompare(b[0]);
                }
                return numA - numB;
            })
            .join(',');

        let userInputArray = userInput.split(',');

        // Formatiert die Ausgabe
        let letter = userInputArray[0].charAt(0);
        let number = userInputArray[0].slice(1);
        let output = `${letter}(${number})`;

        let formattedUserInput = userInputArray.map(element => {
            let letter = element.charAt(0);
            let number = element.slice(1);
            return `${letter}(${number})`;
        }).join(',');

        document.getElementById('priorityQueue' + (currentIndex + 1)).value = formattedUserInput;
        document.getElementById('Element' + (currentIndex + 1)).value = output;
        drawMessage(`Element ${currentIndex + 1}: ${output}`, 'black');

        if (isOwnNodesNewActive) {
            drawOwnShortestPath(shortestPathDraw[currentPathIndex]);
        } else if (isRndNodesActive) {
            drawRndShortestPath(shortestPathDraw[currentPathIndex]);
        } else {
            drawShortestPath(shortestPathDraw[currentPathIndex]);
        }

        currentIndex++;
        currentPathIndex++;

        if (currentIndex === sortedKeys.length - 1) {
            drawMessage('Glückwunsch! Dies war der letzte Knoten in der Priority Queue und du hast\nalle kürzesten Distanzen bestimmt!\n\n Dijkstras Algorithmus wurde erfolgreich gelöst! :-)', 'green');
        } else {
            drawMessage(`Korrekt! Der Knoten mit der höchsten Priorität wird nun entnommen\n\n    * ${output} * \n\nund du kannst nun die Priority Queue mit den alten Werten im Eingabefeld\nfür den neuen Knoten überarbeiten!`, 'blue');
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
        drawMessage('Die Eingabe ist nicht korrekt!\n Du kannst dir per "Hilf mir" Button die korrekte Antwort anzeigen lassen!\n\n Dies geht aber nur 3 mal pro Spiel!\n Bitte versuche es noch einmal!', 'red');
    }
}
// Methode zur Anzeige des erwarteten Zustands 'Hilf mir'
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

    const message = `Die P.Q. für Knoten ${key} lautet: ${expectedState}.\n\nVerbleibende Nutzungen : ${remainingUses - 1}.\n\nDie nächste Eingabe klappt bestimmt wieder ohne Hilfe! :-)`;

    if (remainingUses === 0) {
        message += "\nAlle Hilfen wurden aufgebraucht.";
    }

    drawMessage(message, 'red');
    showExpectedStateCount++;

}

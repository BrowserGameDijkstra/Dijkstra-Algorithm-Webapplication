class PriorityQueue {
    constructor() {
        this.heap = [];
    }

    enqueue(node, distance) {
        const element = { node, distance };
        this.heap.push(element);
        this.heapifyUp();
    }

    dequeue() {
        const root = this.heap[0];
        if (this.heap.length > 1) {
            this.heap[0] = this.heap.pop();
            this.heapifyDown();
        } else {
            this.heap.pop();
        }
        return root;
    }

    isEmpty() {
        return this.heap.length === 0;
    }

    heapifyUp() {
        let index = this.heap.length - 1;
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if (this.heap[index].distance < this.heap[parentIndex].distance) {
                this.swap(index, parentIndex);
                index = parentIndex;
            } else {
                break;
            }
        }
    }

    heapifyDown() {
        let index = 0;
        while (index < this.heap.length) {
            const leftChildIndex = 2 * index + 1;
            const rightChildIndex = 2 * index + 2;
            let smallestChildIndex = index;
            if (leftChildIndex < this.heap.length &&
                this.heap[leftChildIndex].distance < this.heap[smallestChildIndex].distance) {
                smallestChildIndex = leftChildIndex;
            }
            if (rightChildIndex < this.heap.length &&
                this.heap[rightChildIndex].distance < this.heap[smallestChildIndex].distance) {
                smallestChildIndex = rightChildIndex;
            }
            if (smallestChildIndex !== index) {
                this.swap(index, smallestChildIndex);
                index = smallestChildIndex;
            } else {
                break;
            }
        }
    }

    swap(index1, index2) {
        const temp = this.heap[index1];
        this.heap[index1] = this.heap[index2];
        this.heap[index2] = temp;
    }


    decreaseKey(node, newDistance) {
        let index = this.heap.findIndex(element => element.node === node);
        if (index === -1) return;
        this.heap[index].distance = newDistance;
        this.heapifyUp();
    }

    getQueueContents() {
        return this.heap.map(element => ({ node: element.node, distance: element.distance }));
    }
}

function dijkstra(nodes, startNode, selectedNodeCount) {
    const distances = {};
    const visited = {};
    const pq = new PriorityQueue();
    pqStates = {};
    shortestPaths = [];
    shortestPathDraw = [];

    for (let node in nodes) {
        if (node.charCodeAt(0) - 65 < selectedNodeCount) {
            distances[node] = Infinity;
            visited[node] = false;
        }
    }

    distances[startNode] = 0;
    visited[startNode] = false;
    pq.enqueue(startNode, 0);

    while (!pq.isEmpty()) {
        let { node, distance } = pq.dequeue();

        for (let neighbor in nodes[node]) {
            if (neighbor.charCodeAt(0) - 65 < selectedNodeCount) {
                let newDistance = distance + nodes[node][neighbor];
                if (!visited[neighbor] && newDistance < distances[neighbor]) {
                    distances[neighbor] = newDistance;
                    if (pq.heap.some(element => element.node === neighbor)) {
                        pq.decreaseKey(neighbor, newDistance);
                    } else {
                        pq.enqueue(neighbor, newDistance);
                    }
                }
            }
        }

        pqStates[node] = pq.getQueueContents();
        visited[node] = true;
        shortestPaths.push({ node, distance, pq: [...pq.heap] });

        path = [];
        let currentNode = node;

        while (currentNode !== startNode) {
            path.unshift({ node: currentNode, distance: distances[currentNode] });
            currentNode = Object.keys(nodes[currentNode]).find(neighbor =>
                distances[currentNode] - nodes[currentNode][neighbor] === distances[neighbor]
            );

            if (!currentNode) {
                break;
            }
        }

        path.unshift({ node: startNode, distance: 0 });
        shortestPathDraw.push(path);
    }
}


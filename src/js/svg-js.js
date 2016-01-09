//initialization
$(function() {
    initialize();
});

//--------------usage layer--------------
function initialize() {
    $.contextMenu({
        selector: '.graph',
        items: {
            "addVertex": {
                name: "Add vertex",
                callback: function() {
                    addVertex($(this), event.pageX, event.pageY);
                }
            },
            "sep1": "---------",
            "reset": {
                name: "Reset editor", 
                callback: function() {
                    reset($(this));
                }
            },
            "sep2": "---------",
            "loadGraph": {name: "Import graph"},
            "exportGraph": {name: "Export vertex"},
        },
        reposition: false
    });

    $('.graph').contextMenu({
        selector: 'circle',
        items: {
            "addNeighbor": {
                name: "Add neighbor",
                callback: function() {
                    addNeighbor($(this));
                }
            },
            "sep1": "---------",
            "deleteVertex": {
                name: "Delete vertex",
                callback: function() {
                    deleteVertex($(this));
                }
            },
            "sep2": "---------",
            "addEdge": {
                name: "Add edge from this vertex",
                callback: function() {
                    
                }
            },
            "deleteEdges": {
                name: "Delete all edges from this vertex",
                callback: function() {
                    deleteAllEdgesFromVertex($(this));
                }
            }
        },
        reposition: false
    }); 

    $('.graph').contextMenu({
        selector: 'line',
        items: {
            "deleteEdge": {
                name: "Delete edge",
                callback: function() {
                    deleteEdge($(this));
                }
            }
        },
        reposition: false
    }); 
}

function reset(editor) {
    cleanUpWorkspace(editor);
}

function exportGraph() {
    
}

function loadGraph() {
    
}
//--------------usage layer--------------


//---------------dev layer---------------
function setupEnvironment() {

}

function cleanUpWorkspace(editor) {
    editor.empty();
}

function saveWorkspaceTo() {

}

function loadWorkspaceFrom() {

}

function addVertex(editor,x,y) {
    var realX = x - editor.offset().left;
    var realY = y - editor.offset().top;
    var vertex = createVertex(realX, realY);
    editor.append(vertex);
}

function addNeighbor(vertex) {
    var editor = vertex.parent();
    var vertexX = vertex.attr('cx');
    var vertexY = vertex.attr('cy');

    var random = Math.floor((Math.random() * 50) + 50);

    var neighborX = 0;
    var neighborY = 0;

    if (vertexX < editor.width() / 2) {
        neighborX = +vertexX + random;
    } else {
        neighborX = +vertexX - random;
    } 

    if (vertexY < editor.height() / 2) {
        neighborY = +vertexY + random;
    } else {
        neighborY = +vertexY - random;
    }



    var neighbor = createVertex(neighborX, neighborY);
    editor.append(neighbor);

    var edge = createEdge(vertexX, vertexY, neighborX, neighborY);
    editor.prepend(edge);
}

function editVertex() {

}

function deleteVertex(vertex) {
    deleteAllEdgesFromVertex(vertex);
    vertex.remove();
}

function showVertexInfo() {

}

function addEdge() {

}

function editEdge() {

}

function deleteEdge(edge) {
    edge.remove();
}

function deleteAllEdgesFromVertex(vertex) {
    var edges = vertex.siblings('line');
    if (edges.length > 0) {
        for (var i = edges.length - 1; i >= 0; i--) {
            if ((edges[i].getAttribute('x1') === vertex.attr('cx') && edges[i].getAttribute('y1') === vertex.attr('cy')) 
                || (edges[i].getAttribute('x2') === vertex.attr('cx') && edges[i].getAttribute('y2') === vertex.attr('cy'))) {
                edges[i].remove();
            }
        }
    }
}

function moveVertex() {

}
//---------------dev layer---------------


//---------------low layer---------------
function createVertex(x,y) {
    var vertex = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    vertex.setAttribute("cx", x);
    vertex.setAttribute("cy", y);
    vertex.setAttribute("r", 20);
    vertex.setAttribute("stroke", "#2980b9");
    vertex.setAttribute("stroke-width", "2");
    vertex.setAttribute("fill", "#3498db");
    return vertex;
}

function createEdge(x1,y1,x2,y2) {
    var edge = document.createElementNS("http://www.w3.org/2000/svg", "line");
    edge.setAttribute("x1", x1);
    edge.setAttribute("y1", y1);
    edge.setAttribute("x2", x2);
    edge.setAttribute("y2", y2);
    edge.setAttribute("stroke", "#e74c3c");
    edge.setAttribute("stroke-width", "4");
    return edge;
}

function alignToGrid() {

}
//---------------low layer---------------


//------------------------------------------------------------------------------------------

    // $('.graph').on('click', function(e){
    //     console.log('clicked', this);
    // })  
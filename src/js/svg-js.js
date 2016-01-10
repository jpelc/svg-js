//initialization
$(function() {
    initialize();
});

//--------------usage layer--------------
function initialize() {
    setupEnvironment();
}

function reset(editor) {
    cleanUpWorkspace(editor);
}

function exportGraph() {
    saveWorkspaceTo();
}

function loadGraph() {
    loadWorkspaceFrom();
}
//--------------usage layer--------------



//---------------dev layer---------------
function setupEnvironment() {
    //context menu for editor
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
            "loadGraph": {
                name: "Import graph",
                callback: function() {
                    loadGraph();
                }
            },
            "exportGraph": {name: "Export graph",
                callback: function() {
                    exportGraph();
                }
            }
        },
        reposition: false
    });

    //context menu for vertex
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
            "editVertexStyle": {
                name: "Edit style",
                callback: function() {
                    editVertexStyle($(this));
                }
            },
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
                    addEdge($(this), event.pageX, event.pageY);
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

    //context menu for edge
    $('.graph').contextMenu({
        selector: 'line',
        items: {
            "editEdgeStyle": {
                name: "Edit style",
                callback: function() {
                    editEdgeStyle($(this));
                }
            },
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

function cleanUpWorkspace(editor) {
    editor.empty();
}

function saveWorkspaceTo() {
    window.open().document.body.innerText = $('.graph')[0].outerHTML;
}

function loadWorkspaceFrom() {
    var graph = prompt("Please enter content of svg file");
    
    if (graph != null) {
        $('.graph')[0].outerHTML = graph;
        initialize();
        registerDragAndDrop();
    }
}

function addVertex(editor,x,y) {
    var realX = x - editor.offset().left;
    var realY = y - editor.offset().top;
    var vertex = createVertex(realX, realY);
    editor.append(vertex);

    registerDragAndDrop();
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

    var edge = createEdge(vertexX, vertexY, neighbor.getAttribute('cx'), neighbor.getAttribute('cy'));
    editor.prepend(edge);

    registerDragAndDrop();
}

function editVertex() {

}

function editVertexStyle(vertex) {
    var style = prompt("Edit style for selected vertex", $(vertex).attr('style'));
    
    if (style != null) {
        $(vertex).attr('style', style);
    }
}

function deleteVertex(vertex) {
    deleteAllEdgesFromVertex(vertex);
    vertex.remove();
}

function showVertexInfo() {

}

function addEdge(vertex, mouseX, mouseY) {
    var vertexX = vertex.attr('cx');
    var vertexY = vertex.attr('cy');

    var editor = vertex.parent();

    var realX = mouseX - editor.offset().left;
    var realY = mouseY - editor.offset().top;

    var edge = createEdge(vertexX, vertexY, realX, realY);

    $(editor).mousemove(function(event) {
        edge.setAttribute('x2', event.pageX - editor.offset().left);
        edge.setAttribute('y2', event.pageY - editor.offset().top);
    });

    $('circle').click(function(event) {
        edge.setAttribute('x2', event.target.getAttribute('cx'));
        edge.setAttribute('y2', event.target.getAttribute('cy'));

        $(editor).unbind('mousemove');
        $('circle').unbind('click');
    });

    editor.prepend(edge);
}

function editEdge() {

}

function editEdgeStyle(edge) {
    var style = prompt("Edit style for selected edge", $(edge).attr('style'));
    
    if (style != null) {
        $(edge).attr('style', style);
    }
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

function registerDragAndDrop() {
    //drag$drop
    $('circle')
        .draggable()
        .bind('drag', function(event, ui){
            var oldX = event.target.getAttribute('cx');
            var oldY = event.target.getAttribute('cy');

            var newX = alignToGrid(ui.position.left - $(event.target).parent().offset().left);
            var newY = alignToGrid(ui.position.top - $(event.target).parent().offset().top);

            event.target.setAttribute('cx', newX);
            event.target.setAttribute('cy', newY);

            var edges = $(event.target).siblings('line');
            if (edges.length > 0) {
                for (var i = edges.length - 1; i >= 0; i--) {
                    if (edges[i].getAttribute('x1') === oldX && edges[i].getAttribute('y1') === oldY) {
                        edges[i].setAttribute('x1', newX);
                        edges[i].setAttribute('y1', newY);
                    } else if (edges[i].getAttribute('x2') === oldX && edges[i].getAttribute('y2') === oldY) {
                        edges[i].setAttribute('x2', newX);
                        edges[i].setAttribute('y2', newY);
                    }
                }
            }
        });
}
//---------------dev layer---------------



//---------------low layer---------------
function createVertex(x,y) {
    var vertex = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    vertex.setAttribute("cx", alignToGrid(x));
    vertex.setAttribute("cy", alignToGrid(y));
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

function alignToGrid(value) {
    var val = Math.floor(value);

    if (val % 25 !== 0) {
        var rest = val % 25;
        if (rest < 13) {
            val -= rest;
        } else {
            val += (25 - rest);
        }
    }

    return val;
}
//---------------low layer---------------
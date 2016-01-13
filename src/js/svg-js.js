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

function exportGraph(editor) {
    saveWorkspaceTo(editor);
}

function loadGraph(editor) {
    loadWorkspaceFrom(editor);
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
                    loadGraph($(this));
                }
            },
            "exportGraph": {name: "Export graph",
                callback: function() {
                    exportGraph($(this));
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
            "editVertexText": {
                name: "Edit vertex label",
                callback: function() {
                    editVertexText($(this));
                }
            },
            "editVertexStyle": {
                name: "Edit vertex style",
                callback: function() {
                    editVertexStyle($(this));
                }
            },
            "editTextStyle": {
                name: "Edit text style",
                callback: function() {
                    editVertexTextStyle($(this));
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
            "editEdgeText": {
                name: "Edit edge label",
                callback: function() {
                    editEdgeText($(this));
                }
            },
            "editEdgeStyle": {
                name: "Edit style",
                callback: function() {
                    editEdgeStyle($(this));
                }
            },
            "editTextStyle": {
                name: "Edit text style",
                callback: function() {
                    editEdgeTextStyle($(this));
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

function saveWorkspaceTo(editor) {
    window.open().document.body.innerText = editor[0].outerHTML;
}

function loadWorkspaceFrom(editor) {
    var graph = prompt("Please enter content of svg file");
    
    if (graph != null) {
        editor[0].outerHTML = graph;
        initialize();
        registerDragAndDrop();
    }
}

function addVertex(editor,x,y) {
    var realX = x - editor.offset().left;
    var realY = y - editor.offset().top;
    var vertexGroup = createVertex(realX, realY);
    editor.append(vertexGroup);

    registerDragAndDrop();
}

function addNeighbor(vertex) {
    var editor = vertex.parent().parent();
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

    var neighborGroup = createVertex(neighborX, neighborY);
    editor.append(neighborGroup);

    var edgeGroup = createEdge(vertexX, vertexY, neighborGroup.getElementsByTagName('circle')[0].getAttribute('cx'), 
        neighborGroup.getElementsByTagName('circle')[0].getAttribute('cy'));
    editor.prepend(edgeGroup);

    registerDragAndDrop();
}

function editVertexText(vertex) {
    var text = prompt("Edit vertex label", $(vertex).siblings('text')[0].innerHTML);
    
    if (text != null) {
        $(vertex).siblings('text')[0].innerHTML = text;
    }
}

function editVertexStyle(vertex) {
    var style = prompt("Edit style for selected vertex", $(vertex).attr('style'));
    
    if (style != null) {
        $(vertex).attr('style', style);
    }
}

function editVertexTextStyle(vertex) {
    var style = prompt("Edit style for selected vertex text", $(vertex).siblings('text')[0].getAttribute('style'));
    
    if (style != null) {
        $(vertex).siblings('text')[0].setAttribute('style', style);
    }
}

function deleteVertex(vertex) {
    deleteAllEdgesFromVertex(vertex);
    $(vertex).parent().remove();
}

function addEdge(vertex, mouseX, mouseY) {
    var vertexX = vertex.attr('cx');
    var vertexY = vertex.attr('cy');

    var editor = vertex.parent().parent();

    var realX = mouseX - editor.offset().left;
    var realY = mouseY - editor.offset().top;

    var edgeGroup = createEdge(vertexX, vertexY, realX, realY);

    $(editor).mousemove(function(event) {
        var edgeX = event.pageX - editor.offset().left;
        var edgeY = event.pageY - editor.offset().top;

        var edge = edgeGroup.childNodes[0];
        var text = edgeGroup.childNodes[1];

        edge.setAttribute('x2', edgeX);
        edge.setAttribute('y2', edgeY);

        text.setAttribute("x", Math.floor((parseInt(edge.getAttribute('x1'))+parseInt(edge.getAttribute('x2')))/2));
        text.setAttribute("y", Math.floor((parseInt(edge.getAttribute('y1'))+parseInt(edge.getAttribute('y2')))/2));
    });

    $('circle').click(function(event) {
        var edge = edgeGroup.childNodes[0];
        var text = edgeGroup.childNodes[1];

        edge.setAttribute('x2', event.target.getAttribute('cx'));
        edge.setAttribute('y2', event.target.getAttribute('cy'));

        text.setAttribute("x", Math.floor((parseInt(edge.getAttribute('x1'))+parseInt(edge.getAttribute('x2')))/2));
        text.setAttribute("y", Math.floor((parseInt(edge.getAttribute('y1'))+parseInt(edge.getAttribute('y2')))/2));

        $(editor).unbind('mousemove');
        $('circle').unbind('click');
    });

    editor.prepend(edgeGroup);
}

function editEdgeText(edge) {
    var text = prompt("Edit edge label", $(edge).siblings('text')[0].innerHTML);
    
    if (text != null) {
        $(edge).siblings('text')[0].innerHTML = text;
    }
}

function editEdgeStyle(edge) {
    var style = prompt("Edit style for selected edge", $(edge).attr('style'));
    
    if (style != null) {
        $(edge).attr('style', style);
    }
}

function editEdgeTextStyle(edge) {
    var style = prompt("Edit style for selected edge text", $(edge).siblings('text')[0].getAttribute('style'));
    
    if (style != null) {
        $(edge).siblings('text')[0].setAttribute('style', style);
    }
}

function deleteEdge(edge) {
    $(edge).parent().remove();
}

function deleteAllEdgesFromVertex(vertex) {
    var edges = $(vertex).parent().parent().find('line');
    if (edges.length > 0) {
        for (var i = edges.length - 1; i >= 0; i--) {
            if ((edges[i].getAttribute('x1') === vertex.attr('cx') && edges[i].getAttribute('y1') === vertex.attr('cy')) 
                || (edges[i].getAttribute('x2') === vertex.attr('cx') && edges[i].getAttribute('y2') === vertex.attr('cy'))) {
                $(edges[i]).parent().remove();
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

            var newX = alignToGrid(ui.position.left - $(event.target).parent().parent().offset().left);
            var newY = alignToGrid(ui.position.top - $(event.target).parent().parent().offset().top);

            event.target.setAttribute('cx', newX);
            event.target.setAttribute('cy', newY);

            event.target.nextSibling.setAttribute('x', newX-8);
            event.target.nextSibling.setAttribute('y', newY+40);

            var edges = $(event.target).parent().parent().find('line');
            if (edges.length > 0) {
                for (var i = edges.length - 1; i >= 0; i--) {
                    if (edges[i].getAttribute('x1') === oldX && edges[i].getAttribute('y1') === oldY) {
                        edges[i].setAttribute('x1', newX);
                        edges[i].setAttribute('y1', newY);
                    } else if (edges[i].getAttribute('x2') === oldX && edges[i].getAttribute('y2') === oldY) {
                        edges[i].setAttribute('x2', newX);
                        edges[i].setAttribute('y2', newY);
                    }

                    var text = edges[i].nextSibling;
                    text.setAttribute("x", Math.floor((parseInt(edges[i].getAttribute('x1'))+parseInt(edges[i].getAttribute('x2')))/2));
                    text.setAttribute("y", Math.floor((parseInt(edges[i].getAttribute('y1'))+parseInt(edges[i].getAttribute('y2')))/2));
                }
            }
        });
}
//---------------dev layer---------------



//---------------low layer---------------
function createVertex(x,y) {
    var vertex = document.createElementNS("http://www.w3.org/2000/svg", "circle");

    var alignedX = alignToGrid(x);
    var alignedY = alignToGrid(y);

    vertex.setAttribute("cx", alignedX);
    vertex.setAttribute("cy", alignedY);
    vertex.setAttribute("r", 20);
    vertex.setAttribute("stroke", "#2980b9");
    vertex.setAttribute("stroke-width", "2");
    vertex.setAttribute("fill", "#3498db");

    var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", alignedX-8);
    text.setAttribute("y", alignedY+40);
    text.setAttribute("style", "fill:black");
    text.innerHTML ='V';

    var group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.appendChild(vertex);
    group.appendChild(text);
    return group;
}

function createEdge(x1,y1,x2,y2) {
    var edge = document.createElementNS("http://www.w3.org/2000/svg", "line");
    edge.setAttribute("x1", x1);
    edge.setAttribute("y1", y1);
    edge.setAttribute("x2", x2);
    edge.setAttribute("y2", y2);
    edge.setAttribute("stroke", "#e74c3c");
    edge.setAttribute("stroke-width", "4");

    var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", Math.floor((parseInt(x1)+parseInt(x2))/2));
    text.setAttribute("y", Math.floor((parseInt(y1)+parseInt(y2))/2));
    text.setAttribute("style", "fill:black");
    text.innerHTML ='E';
    
    var group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.appendChild(edge);
    group.appendChild(text);
    return group;
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
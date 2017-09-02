let ME;
let url_base
let url;
let clrcol = [0.875, 0.875, 0.875, 1];
let param = [];
let PreviousMousePosition = new Point(0, 0);
let MousePosition = new Point(0, 0);
let MouseButton = 0;
let offsetY = 0;
let RC3;
let RC2;
let g;

let graph;

let selectedNode = null;
let selectedNodeIndex = -1;

let inPropertyWindow = false;
let bulkcreate = 0;
let createNeighbor = false;
let bindtonode = false;

let start = null;
let end = null;

let json;

let cursor_default = new Image;
let cursor_move = new Image;
let c = 0;

let cinj = "";

let RenderedFloor = 1;

function Main()
{
    graph = new Graph();
    url = ParseURL();
    RC3 = document.getElementById("studios.vanish.component.3D");
    RC2 = document.getElementById("studios.vanish.component.2D");
    window.addEventListener("_event_navigation_select_", _event_onNavigationSelect);
    window.addEventListener("_event_modal_ok_", _event_modal_onOk);
    window.addEventListener("_event_modal_delete_", _event_modal_onDelete);
    window.addEventListener("_event_modal_createneighbor_", _event_modal_onCreateNeighbor);
    window.addEventListener("_event_rebuild_element_", _event_modal_onElementRebuild);
    window.addEventListener("_event_element_addvertex_", _event_modal_onElementVertexAdd);
    window.addEventListener("_event_element_addindex_", _event_modal_onElementIndexAdd);
    window.addEventListener("_event_element_executevertexcode_", _event_modal_onElementExecuteVertex);
    window.addEventListener("_event_element_executeindexcode_", _event_modal_onElementExecuteIndex);
    window.addEventListener("_event_modal_element_delete_", _event_modal_onElementDelete);
    window.addEventListener("_event_modal_bindtonode_", _event_modal_onBindToNode);
    window.addEventListener("_event_onInjectChange", _event_onInjectChange);
    window.addEventListener("_event_onSignalFloorChange", _event_onSignalFloorChange);
    RC2.addEventListener("mousedown", _event_onMouseDown);
    RC2.addEventListener("touchstart", _event_onTouchDown);
    RC2.addEventListener("mouseup", _event_onMouseUp);
    RC2.addEventListener("touchend", _event_onTouchUp);
    RC2.addEventListener("mousemove", _event_onMouseMove);
    RC2.addEventListener("mouseover", _event_onMouseMove);
    window.addEventListener("keydown", _event_onKeyPress);
    RC2.addEventListener("touchmove", _event_onTouchMove);
    RC2.addEventListener("mousewheel", _event_onMouseWheel);
    RC2.addEventListener("DOMMouseScroll", _event_onMouseWheel);
    offsetY = RC2.style.top;
    offsetY = offsetY.substring(0, offsetY.length - 2);
    offsetY = parseInt(offsetY);
    ME = new Engine(RC2, RC3);
    ME.Camera.Location = tmp_location;
    ME.Camera.Rotation = tmp_rotation;
    Initialize();
    MainLoop();
    UpdateURL();
}
function EnableCodeInjection()
{
    window.dispatchEvent(new CustomEvent("_event_onSignalCodeInjection"), {});
    return 0;
}
function UpdateURL()
{
    let url = "?@" + round(ME.Camera.Location.X, 2) + "," + round(ME.Camera.Location.Y, 2) + "," + round(ME.Camera.Location.Z, 2) + "z" + RenderedFloor;
    //url += "&graph=" + JSON.stringify(graph.ToJson());
    
    window.dispatchEvent(new CustomEvent("_event_onURLChange", {
        detail: {
            camera: round(ME.Camera.Location.X, 2) + ", " + round(ME.Camera.Location.Y, 2) + ", " + round(ME.Camera.Location.Z, 2),
            startNode: start,
            endNode: end
        }
    }));
    window.history.replaceState({ "html": url }, "", url)
}
function round(num, p)
{
    return "" + parseFloat(Number(Math.round(num + 'e' + p) + 'e-' + p));
}
function ParseURL()
{
    let url = document.URL;
    if (url.includes("@"))
    {
        let paramstr = url.substring(url.indexOf("@") + 1);
        if (paramstr.includes("&"))
        {
            paramstr = paramstr.substring(0, url.indexOf("?"));
        }
        while (paramstr.includes(","))
        {
            param.push(paramstr.substring(0, paramstr.indexOf(",")));
            paramstr = paramstr.substring(paramstr.indexOf(",") + 1);
        }
        param.push(paramstr);
        if (param.length == 3)
        {
            tmp_location = new Vertex(parseFloat(param[0]), parseFloat(param[1]), parseFloat(param[2].substring(0, param[2].indexOf("z"))));
            tmp_rotation = new Vertex(0, 0, 0);
            RenderedFloor = (parseInt(param[2].substring(param[2].indexOf("z") + 1)));
        }
        else
        {
            tmp_location = new Vertex(0, 0, 5);
            tmp_rotation = new Vertex(0, 0, 0);
            RenderedFloor = 1;
        }
    }
    else
    {
        tmp_location = new Vertex(0, 0, 5);
        tmp_rotation = new Vertex(0, 0, 0);
        RenderedFloor = 1;
    }
    let url_search = new URL(url);
    json = url_search.searchParams.get("graph");
    url = url.substring(url.indexOf("/") + 1);
    if (url.includes("?")) url = url.substring(0, url.indexOf("?"));
    if (url.endsWith("/")) url = url.substring(0, url.length - 1);
    url_base = url.substring(url.indexOf("/") + 1);
    url_base = url_base.substring(url_base.indexOf("/"));
    url = url.substring(url.indexOf("/") + 1, url.lastIndexOf("/") + 1);
    url = url.substring(url.indexOf("/"));
    return url;
}
function Initialize()
{
    if (json)
    {
        graph.FromJson(ME, JSON.parse(json));
    }    
    cursor_default.src = "/bench/component/cursor/default.png";
    cursor_move.src = "/bench/component/cursor/move.png";
}
function _event_onKeyPress(event)
{
    if (selectedNode)
    {
        if (!inPropertyWindow)
        {
            let speed = 0.1;
            if (event.key === "ArrowUp")
            {
                selectedNode.Location.Y += speed;
            }
            if (event.key === "ArrowDown")
            {
                selectedNode.Location.Y -= speed;
            }
            if (event.key === "ArrowLeft")
            {
                selectedNode.Location.X -= speed;
            }
            if (event.key === "ArrowRight")
            {
                selectedNode.Location.X += speed;
            }
            if (event.key === "PageUp")
            {
                selectedNode.Location.Z -= speed;
            }
            if (event.key === "PageDown")
            {
                selectedNode.Location.Z += speed;
            }
            if (event.key === "i")
            {
                window.dispatchEvent(new CustomEvent("_event_onSignalProperties", { detail: { node: selectedNode } }));
                inPropertyWindow = true;
            }
            if (event.key === "e")
            {
                for (let i = 0; i < graph.Elements.length; i++)
                {
                    if (graph.Elements[i].Node === selectedNode)
                    {
                        window.dispatchEvent(new CustomEvent("_event_onSignalElements", { detail: { element: graph.Elements[i] } }));
                        inPropertyWindow = true;                        
                        break;
                    }
                }
            }
        }
    }
}
function _event_onNodeSelect(event, nIndex)
{
    if (!selectedNode)
    {
        selectedNode = event;
        selectedNode.Selected = true;
        selectedNodeIndex = nIndex;
    }
    if (createNeighbor)
    {
        if (event != selectedNode)
        {
            selectedNode.CreatePathTo(event, true);
            createNeighbor = false;
            window.dispatchEvent(new CustomEvent("_event_onSignalNeighbor", { detail: {} }));
        }
    }
    if (bindtonode)
    {
        selectedNode = event;
        selectedNode.Selected = true;
        selectedNodeIndex = nIndex;
        bindtonode = false;
        window.dispatchEvent(new CustomEvent("_event_onSignalBind", { detail: {node: event} }));
    }
}
function _event_onNavigationSelect(event)
{
    let navigation = event.detail.key;
    if (navigation === "_navigation_element_create")
    {
        let Vertices = [
            new GraphicsVertex(-1.0, +1.0, +0.0, +1.0, +1.0, +1.0, +1.0),
            new GraphicsVertex(+1.0, +1.0, +0.0, +1.0, +1.0, +1.0, +1.0),
            new GraphicsVertex(+1.0, -1.0, +0.0, +1.0, +1.0, +1.0, +1.0),
            new GraphicsVertex(-1.0, -1.0, +0.0, +1.0, +1.0, +1.0, +1.0),
        ]
        let Indices = [
            new Index(0, 1, 2),
            new Index(0, 2, 3),
        ]
        obj = new Object3D(ME, Vertices, Indices, "New Object");
        let N = new Element(obj, "New Element", "Generic");
        N.BindToNode(selectedNode);
        selectedElement = N;
        graph.RegisterElement(N);
        window.dispatchEvent(new CustomEvent("_event_onSignalElements", { detail: { element: N } }));
        inPropertyWindow = true;
    }
    else if (navigation === "_navigation_element_inspect")
    {
        if (selectedNode)
        {
            for (let i = 0; i < graph.Elements.length; i++)
            {
                if (graph.Elements[i].Node === selectedNode)
                {
                    window.dispatchEvent(new CustomEvent("_event_onSignalElements", { detail: { element: graph.Elements[i] } }));
                    inPropertyWindow = true;
                    break;
                }
            }
        }
    }
    else if (navigation === "_navigation_element_remove")
    {
        if (selectedNode)
        {
            _event_modal_onElementDelete();
        }    
    }    
    else if (navigation === "_navigation_node_create")
    {
        let N = new Node("New Node", new Vertex(0, 0, 0));
        graph.RegisterNode(N);
        if (selectedNode != null)
        {
            selectedNode.Selected = false;
        }
        selectedNode = null;
        selectedNodeIndex = -1;
        _event_onNodeSelect(graph.Nodes[graph.Nodes.length - 1], graph.Nodes.length - 1);
        window.dispatchEvent(new CustomEvent("_event_onSignalProperties", { detail: { node: selectedNode } }));
        inPropertyWindow = true;
    }
    else if (navigation === "_navigation_node_bulkcreate")
    {
        bulkcreate = event.detail.number;
        if (bulkcreate > 0)
        {
            _event_onNavigationSelect({ detail: { key: "_navigation_node_create" } });
            bulkcreate--;
        }
    }
    else if (navigation === "_navigation_node_inspect")
    {
        window.dispatchEvent(new CustomEvent("_event_onSignalProperties", { detail: { node: selectedNode } }));
        inPropertyWindow = true;
    }
    else if (navigation === "_navigation_node_remove")
    {
        _event_modal_onDelete();
    }
    else if (navigation === "_navigation_view_zoomin")
    {
        ME.Camera.Location.Z -= 1;
        UpdateURL();
    }
    else if (navigation === "_navigation_view_zoomout")
    {
        ME.Camera.Location.Z += 1;
        UpdateURL();
    }
    else if (navigation === "_navigation_view_resetcamera")
    {
        ME.Camera.Location = new Vertex(0, 0, 5);
        ME.Camera.Rotation = new Vertex(0, 0, 0);
        UpdateURL();
    }
    else if (navigation === "_navigation_path_start")
    {
        if (selectedNode)
        {
            start = selectedNode;
        }
    }
    else if (navigation === "_navigation_path_end")
    {
        if (selectedNode)
        {
            end = selectedNode;
        }
    }
    else if (navigation === "_navigation_path_calc")
    {
        if (start && end)
        {
            graph.GetPath(start, end);
        }
    }
    else if (navigation === "_navigation_file_new")
    {
        graph = new Graph();
    }    
    else if (navigation === "_navigation_file_save")
    {
        let file = new Blob([JSON.stringify(graph.ToJson())], { type: "text/plain" });
        let a = document.createElement("a");
        a.href = URL.createObjectURL(file);
        a.download = "graph.gbench";
        a.click();
    }
    else if (navigation === "_navigation_file_open")
    {
        let input = document.createElement("input");
        input.setAttribute("type", "file");
        input.click();
        input.onchange = (e) =>
        {
            let reader = new FileReader();
            reader.onload = () =>
            {
                try
                {
                    graph.FromJson(ME, JSON.parse(reader.result));
                }
                catch (e)
                {
                    
                }
            }
            reader.readAsText(input.files[0]);
        }
    }
    else if (navigation === "_navigation_file_link")
    {
        console.log(window.location);
        let url = window.location.origin;
        url += "/bench/?@" + round(ME.Camera.Location.X, 2) + "," + round(ME.Camera.Location.Y, 2) + "," + round(ME.Camera.Location.Z, 2) + "z" + RenderedFloor;
        url += "&graph=" + JSON.stringify(graph.ToJson());
        window.dispatchEvent(new CustomEvent("_event_onSignalURL", { detail: { url: url } }));
    }
    else if (navigation === "_navigation_about")
    {
        window.dispatchEvent(new CustomEvent("_event_onSignalAbout", { detail: { } }));
    }
    else if (navigation === "_navigation_inject")
    {
        window.dispatchEvent(new CustomEvent("_event_onSignalShowInject", { detail: { cinj: cinj } }));
    }
    else if (navigation === "_navigation_view_camera")
    {
        window.dispatchEvent(new CustomEvent("_event_onSignalCamera", { detail: { camera: ME.Camera } }));
    }
    else if (navigation === "_navigation_view_floors")
    {
        window.dispatchEvent(new CustomEvent("_event_onSignalFloors", { detail: { floor: RenderedFloor, floors: graph.Floors } }));
    }
    else if (navigation === "_navigation_view_floordown")
    {
        _event_onSignalFloorChange({ detail: { floor: RenderedFloor - 1 } });
    }
    else if (navigation === "_navigation_view_floorup")
    {
        _event_onSignalFloorChange({ detail: { floor: RenderedFloor + 1 } });
    }
}
function _event_onMouseDown(event)
{
    MouseButton = 1;
    PreviousMousePosition = new Point(event.clientX, event.clientY - offsetY);
    c = 1;
}
function _event_onTouchDown(event)
{

}
function _event_onMouseUp(event)
{
    MouseButton = 0;
    UpdateURL();
    if (!createNeighbor)
    {
        selectedNode = null;
        selectedNodeIndex = -1;
    }    
    for (let i = 0; i < graph.Nodes.length; i++)
    {
        let child = graph.Nodes[i];
        if (child.Hovered)
        {
            _event_onNodeSelect(child, i);
        }
        else
        {
            if (!createNeighbor)
            {
                child.Selected = false;
            }    
        }
    }
    c = 0;
}
function _event_onTouchUp(event)
{

}
function _event_onMouseMove(event)
{
    MousePosition = new Point(event.clientX, event.clientY - offsetY);
    for (let i = 0; i < graph.Nodes.length; i++)
    {
        let child = graph.Nodes[i];
        if (graph.DistanceToNode(i, new Vertex(MousePosition.X, MousePosition.Y, 0)) < 10)
        {
            graph.Nodes[i].Hovered = true;
        }
        else
        {
            graph.Nodes[i].Hovered = false;
        }
    }
}
function _event_onTouchMove(event)
{

}
function _event_onMouseWheel(event)
{
    let e = window.event || event;
    let speed = 0.1;
    let delta = Math.max(-speed, Math.min(speed, (e.wheelDelta || -e.detail)));
    ME.Camera.Location.Z -= (delta);
    UpdateURL();
}
function _event_modal_onOk(event)
{
    inPropertyWindow = false;
    if (bulkcreate > 0)
    {
        setTimeout(() =>
        {
            _event_onNavigationSelect({ detail: { key: "_navigation_node_bulkcreate", number: bulkcreate-- } });
        }, 1);
    }
    UpdateURL();
}
function _event_modal_onDelete(event)
{
    graph.Nodes.splice(selectedNodeIndex, 1);
    inPropertyWindow = false;
    if (bulkcreate > 0)
    {
        setTimeout(() =>
        {
            _event_onNavigationSelect({ detail: { key: "_navigation_node_bulkcreate", number: bulkcreate-- } });
        }, 1);
    }
    selectedNode = null;
    selectedNodeIndex = -1;
    UpdateURL();
}
function _event_modal_onCreateNeighbor(event)
{
    createNeighbor = true;
}
function _event_modal_onElementRebuild(event)
{
    event.detail.element.Object.rebuild(ME);
}
function _event_modal_onElementVertexAdd(event)
{    
    event.detail.element.Object.Vertices.push(new GraphicsVertex(0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0));
    _event_modal_onElementRebuild(event);
}
function _event_modal_onElementIndexAdd(event)
{    
    event.detail.element.Object.Indices.push(new Index(0, 0, 0));
    _event_modal_onElementRebuild(event);
}
function _event_modal_onElementExecuteVertex(event)
{
    let c = event.detail.code;
    while (c.includes("["))
    {
        c = c.replace("[", "new GraphicsVertex(");
    }
    while (c.includes("]"))
    {
        c = c.replace("]", ")");
    }
    let code = "[\n" + c + "\n]";
    try
    {
        event.detail.element.Object.Vertices = eval(code);
        _event_modal_onElementRebuild(event);        
    }
    catch (e)
    {
        
    }
}
function _event_modal_onElementExecuteIndex(event)
{
    let c = event.detail.code;
    while (c.includes("["))
    {
        c = c.replace("[", "new Index(");
    }
    while (c.includes("]"))
    {
        c = c.replace("]", ")");
    }
    let code = "[\n" + c + "\n]";
    try
    {
        event.detail.element.Object.Indices = eval(code);
        _event_modal_onElementRebuild(event);        
    }
    catch (e)
    {
        
    }    
}
function _event_modal_onElementDelete(event)
{    
    UpdateURL();
    for (let i = 0; i < graph.Elements.length; i++)
    {
        if (graph.Elements[i].Node === selectedNode)
        {
            graph.Elements.splice(i, 1);
            break;
        }
    }
    inPropertyWindow = false;
}
function _event_modal_onBindToNode(event)
{
    bindtonode = true;
}
function _event_onInjectChange(event)
{
    cinj = event.detail.cinj;
}
function _event_onSignalFloorChange(event)
{
    RenderedFloor = parseFloat(event.detail.floor);
    graph.RenderedFloor = parseFloat(event.detail.floor);
    UpdateURL();
}
function MainLoop()
{
    requestAnimFrame(MainLoop);
    Render();
    Update();
}
function Update()
{
    if (MouseButton == 1)
    {
        DeltaMouse = new Point(PreviousMousePosition.X - MousePosition.X, PreviousMousePosition.Y - MousePosition.Y);
        PreviousMousePosition = new Point(MousePosition.X, MousePosition.Y);
        ME.Camera.Location.X += DeltaMouse.X / (1236.984 * Math.pow(ME.Camera.Location.Z, -0.9845149));
        ME.Camera.Location.Y -= DeltaMouse.Y / (1236.984 * Math.pow(ME.Camera.Location.Z, -0.9845149));
    }
}
function Render()
{
    ME.Clear(clrcol[0], clrcol[1], clrcol[2], clrcol[3]);
    let scale = parseInt((Math.pow(1.0293, -ME.Camera.Location.Z + 135) + 5));
    scale = 15;
    ME.Device2D.font = scale.toString() + "px Calibri";
    ME.Device2D.lineWidth = 0.15;
    ME.Device2D.beginPath();
    ME.Device2D.moveTo(MousePosition.X, 0);
    ME.Device2D.lineTo(MousePosition.X, ME.Device.viewportHeight);
    ME.Device2D.stroke();
    ME.Device2D.beginPath();
    ME.Device2D.moveTo(0, MousePosition.Y);
    ME.Device2D.lineTo(ME.Device.viewportWidth, MousePosition.Y);
    ME.Device2D.stroke();
    ME.Device2D.lineWidth = 0.3;
    graph.Render(ME, 0);
    if (createNeighbor && selectedNode)
    {
        let p = ME.ProjectVertex(selectedNode.Location, 0);
        ME.Device2D.beginPath();
        ME.Device2D.moveTo(p.X, p.Y);
        ME.Device2D.lineTo(MousePosition.X, MousePosition.Y);
        ME.Device2D.stroke();
    }
    if (c === 0)
    {
        ME.Device2D.drawImage(cursor_default, MousePosition.X - 3, MousePosition.Y - 2, 25, 25);
    }
    else if (c === 1)
    {
        ME.Device2D.drawImage(cursor_move, MousePosition.X - 15, MousePosition.Y - 15, 30, 30);
    }
    try
    {
        eval(cinj);
    }
    catch (e)
    {
        
    }
}    

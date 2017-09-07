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

let graph;

let RenderedFloor = 1;

function Main()
{
    graph = new Graph();
    url = ParseURL();
    RC3 = document.getElementById("studios.vanish.component.3D");
    RC2 = document.getElementById("studios.vanish.component.2D");
    RC2.addEventListener("mousedown", _event_onMouseDown);
    RC2.addEventListener("touchstart", _event_onTouchDown);
    RC2.addEventListener("mouseup", _event_onMouseUp);
    RC2.addEventListener("touchend", _event_onTouchUp);
    RC2.addEventListener("mousemove", _event_onMouseMove);
    RC2.addEventListener("mouseover", _event_onMouseMove);
    RC2.addEventListener("touchmove", _event_onTouchMove);
    RC2.addEventListener("mousewheel", _event_onMouseWheel);
    RC2.addEventListener("DOMMouseScroll", _event_onMouseWheel);
    window.addEventListener("_event_onZoomRoom", _event_onZoomRoom);
    window.addEventListener("_event_onQuery", _event_onQuery);
    window.addEventListener("_event_onGetDirections", _event_onGetDirections);
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
function UpdateURL()
{
    let url = "?@" + round(ME.Camera.Location.X, 2) + "," + round(ME.Camera.Location.Y, 2) + "," + round(ME.Camera.Location.Z, 2) + "z" + RenderedFloor;
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
    graph.RenderedFloor = RenderedFloor;
    let url_search = new URL(url);
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
    var raw = new XMLHttpRequest();
    raw.open("GET", "resources/graph.gbench", false);
    raw.onreadystatechange = function()
    {
        if (this.readyState == 4)
        {
            if (this.status == 200)
            {
                source = raw.responseText;
                let js = JSON.parse(source);
                graph.FromJson(ME, js);
            }
        }
    }
    raw.send();
}
function _event_onMouseDown(event)
{
    MouseButton = 1;
    PreviousMousePosition = new Point(event.clientX, event.clientY - offsetY);
}
function _event_onTouchDown(event)
{

}
function _event_onMouseUp(event)
{
    MouseButton = 0;
    UpdateURL();
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
    let speed = 1;
    let delta = Math.max(-speed, Math.min(speed, (e.wheelDelta || -e.detail)));
    ME.Camera.Location.Z -= (delta);
    UpdateURL();
}
function _event_onQuery(event)
{
    let val = graph.GetAllElements(event.detail.query);
    event.detail.callback(val);
}
function getNode(txt)
{
    let element = graph.GetElement(txt);
    let node = null;
    if (element != null)
    {
        node = element.Node;
    }
    else
    {
        let elements = graph.GetAllElements(txt);
        if (elements.length > 0)
        {
            node = elements[0].Node;
        }
    }
    return node;
}
function _event_onZoomRoom(event)
{
    let node = getNode(event.detail.text);
    if (node)
    {
        RenderedFloor = graph.GetFloor(node) + 1;
        graph.RenderedFloor = RenderedFloor;
        ME.Camera.Location = new Vertex(node.Location.X, node.Location.Y, node.Location.Z + 10);
        UpdateURL();
    }
    return node;
}
function _event_onGetDirections(event)
{
    let n1 = getNode(event.detail.loc1);
    let n2 = getNode(event.detail.loc2);
    if (n1 && n2)
    {
        graph.GetPath(n1, n2);
    }
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
    ME.Device2D.font = scale.toString() + "px Calibri";
    graph.Scale = scale;
    graph.Render(ME, 0);
}    

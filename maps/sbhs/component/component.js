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
let directions;

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
    window.addEventListener("_event_onZoomIn", _event_onZoomIn);
    window.addEventListener("_event_onZoomOut", _event_onZoomOut);
    window.addEventListener("_event_onFloorUp", _event_onFloorUp);
    window.addEventListener("_event_onFloorDown", _event_onFloorDown);
    window.addEventListener("_event_onSetFloor", _event_onSetFloor);
    window.addEventListener("_event_onSetDirection", _event_onSetDirection);
    window.addEventListener("_event_onHideInfo", _event_onHideInfo);
    window.addEventListener("_event_onDirSelect", _event_onDirSelect);
    window.addEventListener("_event_onCameraRotate", _event_onCameraRotate);
    window.addEventListener("_event_onCameraResetRotate", _event_onCameraResetRotate);
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
    raw.open("GET", "/maps/sbhs/resources/graph.gbench", false);
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
function ParseDir(dir)
{
    let mag = (a) =>
    {
        return Math.sqrt(Math.pow(a.X, 2) + Math.pow(a.Y, 2) + Math.pow(a.Z, 2));
    }
    let dist = (a, b) =>
    {
        return Math.sqrt(Math.pow(a.X - b.X, 2) + Math.pow(a.Y - b.Y, 2) + Math.pow(a.Z - b.Z, 2));
    }
    let cross = (a, b) =>
    {
        return new Vertex((a.Y * b.Z) - (a.Z * b.Y), (a.Z * b.X) - (a.X * b.Z), (a.X * b.Y) - (a.Y * b.X));
    }
    let dot = (a, b) =>
    {
        return (a.X * b.X) + (a.Y * b.Y) + (a.Z * b.Z);
    }
    let xDueZRot = 0; // Math.sin(ME.Camera.Rotation.Z * Math.PI / 180);
    let yDueZRot = 1; // Math.cos(ME.Camera.Rotation.Z * Math.PI / 180);
    let parent = new Vertex(dir[0].CNode.Location.X + xDueZRot, dir[0].CNode.Location.Y + yDueZRot, dir[0].CNode.Location.Z);
    for (let i = 0; i < dir.length; i++)
    {
        let current = new Vertex(dir[i].CNode.Location.X, dir[i].CNode.Location.Y, dir[i].CNode.Location.Z);
        let child = new Vertex(dir[i].Node.Location.X, dir[i].Node.Location.Y, dir[i].Node.Location.Z);
        let vector1 = new Vertex(current.X - parent.X, current.Y - parent.Y, 0);
        let vector2 = new Vertex(child.X - current.X, child.Y - current.Y, 0);
        let ang = Math.atan2(mag(cross(vector1, vector2)), dot(vector1, vector2));
        ang *= 180 / Math.PI;
        let StraightOffset = 15;
        if (cross(vector1, vector2).Z < 0)
        {
            ang *= -1;
        }
        if (i === 0 && ang % 180 === 0)
        {
            ang -= 180;
        }    
        dir[i].angle = ang;
        if (dir[i].Direction === "Right" || dir[i].Direction === "Left")
        {
            if (dir[i - 1].Direction === "Right")
            {
                dir[i].angle = dir[i - 1].angle + 90;
            }
            else if (dir[i - 1].Direction === "Left")
            {
                dir[i].angle = dir[i - 1].angle - 90;
            }
            else
            {
                dir[i].angle = dir[i - 1].angle;
            }    
        }
        else if (dir[i].Direction === "Straight" || dir[i].Direction === "Destination" || dir[i].Direction === "Up" || dir[i].Direction === "Down")
        {
            if (dir[i - 1].Direction === "Right")
            {
                dir[i].angle = dir[i - 1].angle + 90;
            }
            else if (dir[i - 1].Direction === "Left")
            {
                dir[i].angle = dir[i - 1].angle - 90;
            }
            else
            {
                dir[i].angle = dir[i - 1].angle;
            }    
        }    
        console.log(dir[i].CNode.Name + " to " + dir[i].Node.Name + " = " + dir[i].angle);
        parent = current;
    }
    return dir;
}
function _event_onMouseDown(event)
{
    MouseButton = 1;
    PreviousMousePosition = new Point(event.clientX, event.clientY - offsetY);
    for (let i = 0; i < graph.Elements.length; i++)
    {
        let child = graph.Elements[i];
        if (child.Node != null)
        {
            if (child.Type === "Room")
            {
                if (graph.DistanceToNode(child.Node, new Vertex(MousePosition.X, MousePosition.Y, 0)) < child.Node.TextSize)
                {
                    graph.Elements[i]._on_down_ = true;
                }
                else
                {
                    graph.Elements[i]._on_down_ = false;
                }
            }
        }
    }
}
function _event_onTouchDown(event)
{

}
function _event_onMouseUp(event)
{
    MouseButton = 0;
    for (let i = 0; i < graph.Elements.length; i++)
    {
        let child = graph.Elements[i];
        if (child.Node != null)
        {
            if (child.Type === "Room")
            {
                if (graph.Elements[i]._on_down_ && (graph.DistanceToNode(child.Node, new Vertex(MousePosition.X, MousePosition.Y, 0)) < child.Node.TextSize))
                {
                    window.dispatchEvent(new CustomEvent("_event_onElementClick", { detail: { button: event.button, element: child, offsetX: event.offsetX, offsetY: event.offsetY } }));
                }
            }
        }
    }
    UpdateURL();
}
function _event_onTouchUp(event)
{

}
function _event_onMouseMove(event)
{
    MousePosition = new Point(event.clientX, event.clientY - offsetY);
    _event_onUpdateColors();
}
function _event_onUpdateColors() 
{
    let run = true;
    for (let i = 0; i < graph.Elements.length; i++)
    {
        let child = graph.Elements[i];
        run = true;
        if (child.Node != null)
        {
            if (graph.DistanceToNode(child.Node, new Vertex(MousePosition.X, MousePosition.Y, 0)) < child.Node.TextSize)
            {
                if (graph.SelectedPath && graph.SelectedPath.length > 0)
                {
                    if (child === graph.GetElementByNodeID(graph.SelectedPath[0].ID))
                    {
                        run = false;
                        child.Object.ShadeG = 0.6;
                    }
                    else if (child === graph.GetElementByNodeID(graph.SelectedPath[graph.SelectedPath.length - 1].ID))
                    {
                        run = false;
                        child.Object.ShadeR = 0.8;
                    }
                }
                if (run)
                {
                    child.Object.ShadeR = 0.8;
                    child.Object.ShadeG = 0.8;
                    child.Object.ShadeB = 0.8;
                }
            }
            else
            {
                if (graph.SelectedPath && graph.SelectedPath.length > 0)
                {
                    if (child === graph.GetElementByNodeID(graph.SelectedPath[0].ID))
                    {
                        run = false;
                        child.Object.ShadeR = 146 / 255;
                        child.Object.ShadeG = 204 / 255;
                        child.Object.ShadeB = 065 / 255;
                    }
                    else if (child === graph.GetElementByNodeID(graph.SelectedPath[graph.SelectedPath.length - 1].ID))
                    {
                        run = false;
                        child.Object.ShadeR = 255 / 255;
                        child.Object.ShadeG = 157 / 255;
                        child.Object.ShadeB = 133 / 255;
                    }
                }
                if (run)
                {
                    child.Object.ShadeR = 1;
                    child.Object.ShadeG = 1;
                    child.Object.ShadeB = 1;
                }
            }
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
        directions = ParseDir(graph.GetDynamicDirections());
        _event_onUpdateColors();
        window.dispatchEvent(new CustomEvent("_event_onShowInfo", { detail: { dirArr: directions } }));
    }
}
function _event_onZoomIn(event)
{
    let times = 0;
    let i = () =>
    {
        setTimeout(() =>
        {
            ME.Camera.Location.Z -= 1;
            times++;
            if (times < 10)
            {
                i();
            }
        }, 10);
    };
    i();
}
function _event_onZoomOut(event)
{
    let times = 0;
    let i = () =>
    {
        setTimeout(() =>
        {
            ME.Camera.Location.Z += 1;
            times++;
            if (times < 10)
            {
                i();
            }
        }, 10);
    };
    i();
}
function _event_onFloorUp(event)
{
    RenderedFloor += 1;
    if (RenderedFloor === 4)
    {
        RenderedFloor = 3;
    }
    graph.RenderedFloor = RenderedFloor;
    UpdateURL();
}
function _event_onFloorDown(event)
{
    RenderedFloor -= 1;
    if (RenderedFloor === 0)
    {
        RenderedFloor = 1;
    }
    graph.RenderedFloor = RenderedFloor;
    UpdateURL();
}
function _event_onSetFloor(event)
{
    RenderedFloor = event.detail.floor;
    graph.RenderedFloor = RenderedFloor;
    UpdateURL();
}
function _event_onSetDirection(event)
{
    let min = Number.MAX_SAFE_INTEGER;
    let element = null;
    if (!event.detail.element)
    {
        for (let i = 0; i < graph.Elements.length; i++)
        {
            let child = graph.Elements[i];
            if (child.Node != null)
            {
                if (child.Type === "Room")
                {
                    let dis = graph.DistanceToNode(child.Node, new Vertex(MousePosition.X, MousePosition.Y, 0));
                    if (dis < min)
                    {
                        min = dis;
                        element = child;
                    }
                }
            }
        }
    }
    else
    {
        element = event.detail.element;
    }
    if (event.detail.dir === "from")
    {
        document.getElementById("searchbar1").value = element.Name;
    }
    else if (event.detail.dir === "to")
    {
        document.getElementById("searchbar2").value = element.Name;
        window.dispatchEvent(new CustomEvent("_event_onPostSetDirection", {}));
    }    
}
function _event_onHideInfo(event)
{
    graph.SelectedPath = null;
    directions = null;
    _event_onUpdateColors();
}
function _event_onDirSelect(event)
{
    ME.Camera.Location = new Vertex(event.detail.node.Location.X, event.detail.node.Location.Y, event.detail.node.Location.Z + 5);
    RenderedFloor = graph.GetFloor(event.detail.node) + 1;
    graph.RenderedFloor = RenderedFloor;
    ME.Camera.Rotation.Z = event.detail.angle;
    UpdateURL();
}
function _event_onCameraRotate(event)
{
    let stop = ME.Camera.Rotation.Z + event.detail.rotate;
    let dir = 1;
    if (event.detail.rotate < 0)
    {
        dir = -1;
    }
    let times = 0;
    let i = () =>
    {
        setTimeout(() =>
        {
            ME.Camera.Rotation.Z += 1 * dir;
            times++;
            if (dir > 0 && ME.Camera.Rotation.Z < stop && times < 365)
            {
                i();
            }   
            if (dir < 0 && ME.Camera.Rotation.Z > stop && times < 365)
            {
                i();
            }
        }, 5);
    };
    i();
}
function _event_onCameraResetRotate(event)
{
    if (ME.Camera.Rotation.Z !== 0)
    {
        _event_onCameraRotate({ detail: { rotate: -ME.Camera.Rotation.Z } });
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
        ME.Camera.Location.X -= DeltaMouse.Y / (1236.984 * Math.pow(ME.Camera.Location.Z, -0.9845149)) * Math.sin(ME.Camera.Rotation.Z * Math.PI / 180);
        ME.Camera.Location.Y -= DeltaMouse.Y / (1236.984 * Math.pow(ME.Camera.Location.Z, -0.9845149)) * Math.cos(ME.Camera.Rotation.Z * Math.PI / 180);
        ME.Camera.Location.X += DeltaMouse.X / (1236.984 * Math.pow(ME.Camera.Location.Z, -0.9845149)) * Math.cos(ME.Camera.Rotation.Z * Math.PI / 180);
        ME.Camera.Location.Y -= DeltaMouse.X / (1236.984 * Math.pow(ME.Camera.Location.Z, -0.9845149)) * Math.sin(ME.Camera.Rotation.Z * Math.PI / 180);
    }
}
function Render()
{
    let z_rot = 0;
    ME.Clear(clrcol[0], clrcol[1], clrcol[2], clrcol[3]);
    let scale = parseInt((Math.pow(1.0293, -ME.Camera.Location.Z + 135) + 5));
    ME.Device2D.font = scale.toString() + "px Calibri";
    graph.Scale = scale;
    graph.Render(ME, z_rot);
    if (directions)
    {
        for (let i = 0; i < directions.length; i++)
        {
            if (graph.NodeInFloor(directions[i].CNode))
            {
                let p = ME.ProjectVertex(directions[i].CNode.Location, z_rot);
                ME.Device2D.beginPath();
                ME.Device2D.arc(p.X, p.Y, 5, 0, 2 * Math.PI);
                ME.Device2D.fill();
            }    
        }
    }
}

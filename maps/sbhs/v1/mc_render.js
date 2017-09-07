var ME;
var Map = new Array(6);
var Map_Labels = new Array(6);
var RenderedFloor = 0;
var MouseButton = 0;
var MousePosition = new Point(0, 0);
var DeltaMouse = new Point(0, 0);
var PreviousMousePosition = new Point(0, 0);
var tmp_location;
var tmp_rotation;
var url_base
var z_rotation = 0;
var ico_b_f = new Image;
var ico_b_m = new Image;
var ico_c_a = new Image;
var ico_c_b = new Image;
var ico_m_o = new Image;
var ico_l_a = new Image;
var ico_g_a = new Image;
var ico_l_m = new Image;
var ico_l_f = new Image;
var ico_c_y = new Image;
var clrcol = [0.875, 0.875, 0.875, 1];
function Main()
{
    url = ParseURL();
    window.addEventListener("mousedown", Event_Down);
    window.addEventListener("touchstart", Event_TDown);
    window.addEventListener("mouseup", Event_Up);
    window.addEventListener("touchend", Event_Up);
    window.addEventListener("mousemove", Event_Move);
    window.addEventListener("mouseover", Event_Move);
    window.addEventListener("touchmove", Event_TMove);
    window.addEventListener("mousewheel", Event_Wheel);
    window.addEventListener("DOMMouseScroll", Event_Wheel);
    var RC3 = document.getElementById("studios.vanish.mc.3D");
    var RC2 = document.getElementById("studios.vanish.mc.2D");
    ME = new Engine(RC2, RC3, url);
    ME.Camera.Location = tmp_location;
    ME.Camera.Rotation = tmp_rotation;
    UpdateURL();
    Initialize();
    MainLoop();
}
function UpdateURL()
{
    var url = "?floor=" + RenderedFloor + "&lox=" + ME.Camera.Location.X + "&loy=" + ME.Camera.Location.Y + "&loz=" + ME.Camera.Location.Z;
    url += "&rox=" + ME.Camera.Rotation.X + "&roy=" + ME.Camera.Rotation.Y + "&roz=" + z_rotation;
    window.history.replaceState({"html": url}, "", url)
}
function ParseURL()
{
    var url = document.URL;
    var url_search = new URL(url);
    url = url.substring(url.indexOf("/") + 1);
    if (url.includes("?")) url = url.substring(0, url.indexOf("?"));
    if (url.endsWith("/")) url = url.substring(0, url.length - 1);
    url_base = url.substring(url.indexOf("/") + 1);
    url_base = url_base.substring(url_base.indexOf("/"));
    url = url.substring(url.indexOf("/") + 1, url.lastIndexOf("/") + 1);
    url = url.substring(url.indexOf("/"));
    RenderedFloor = parseInt(url_search.searchParams.get("floor"));
    if (!RenderedFloor) RenderedFloor = 0;
    var x = parseFloat(url_search.searchParams.get("lox"));
    if (!x) x = 50;
    var y = parseFloat(url_search.searchParams.get("loy"));
    if (!y) y = 50;
    var z = parseFloat(url_search.searchParams.get("loz"));
    if (!z) z = 60;
    tmp_location = new Vertex(x, y, z);
    x = parseFloat(url_search.searchParams.get("rox"));
    if (!x) x = 0;
    y = parseFloat(url_search.searchParams.get("roy"));
    if (!y) y = 0;
    z = parseFloat(url_search.searchParams.get("roz"));
    if (!z) z = 0;
    clrcol[0] = parseFloat(url_search.searchParams.get("br"));
    if (!clrcol[0]) clrcol[0] = 0.875;
    clrcol[1] = parseFloat(url_search.searchParams.get("bg"));
    if (!clrcol[1]) clrcol[1] = 0.875;
    clrcol[2] = parseFloat(url_search.searchParams.get("bb"));
    if (!clrcol[2]) clrcol[2] = 0.875;
    tmp_rotation = new Vertex(x, y, 0);
    z_rotation = z;
    return url;
}
function InitializeResources()
{
    ico_b_f.src = url + "icons/ico_b_f.png";
    ico_b_m.src = url + "icons/ico_b_m.png";
    ico_c_a.src = url + "icons/ico_c_a.png";
    ico_c_b.src = url + "icons/ico_c_b.png";
    ico_m_o.src = url + "icons/ico_m_o.png";
    ico_l_a.src = url + "icons/ico_l_a.png";
    ico_g_a.src = url + "icons/ico_g_a.png";
    ico_l_m.src = url + "icons/ico_l_m.png";
    ico_l_f.src = url + "icons/ico_l_f.png";
    ico_c_y.src = url + "icons/ico_c_y.png";
}
function Initialize()
{
    var source = "";
    var raw = new XMLHttpRequest();
    InitializeResources();
    raw.open("GET", url + "map.ngm", false);
    raw.onreadystatechange = function()
    {
        if (this.readyState == 4)
        {
            if (this.status == 200)
            {
                source = raw.responseText;
            }
        }
    }
    raw.send(null);
    var JSONObject = JSON.parse(source);
    for (var i = 0; i < 6; i++)
    {
        Map[i] = [];
        Map_Labels[i] = [];
    }
    for (var i = 0; i < JSONObject.nodes.length; i++)
    {
        var s = 0;
        var ds = 0;
        var a = 1;
        var r = 0;
        var g = 0;
        var b = 0;
        var type = "U";
        var name = JSONObject.nodes[i].friendly;
        var fName = JSONObject.nodes[i].friendly;
        if (JSONObject.nodes[i].object.type == "WastedSpace")
        {
            ds = clrcol[0];
            s = clrcol[0];
            r = s;
            g = s;
            b = s;
            type = "W";
        }
        else if (JSONObject.nodes[i].object.type == "Building")
        {
            ds = 0.784;
            s = 0.968;
            r = s;
            g = s;
            b = s;
            type = "B";
        }
        else if (JSONObject.nodes[i].object.type == "Path")
        {
            ds = 1;
            s = 1;
            r = s;
            g = s;
            b = s;
            type = "P";
        }
        var offset = 0.01;
        var height = 0.5;
        if (name == "" || name.includes("Library") || name.includes("208 (F") || name.includes("208 E") || name.includes("Locker") || name.includes("C212") || name.includes("D102") || name.includes("D104"))
        {
            offset = 0.0;
        }
        else if (name == "Court Yard")
        {
            height = 0.25;
            offset = 0.0;
            r = 0.796;
            g = 0.902;
            b = 0.639;
        }
        else if (name.includes("Bathroom"))
        {
            if (fName.includes("(B)"))
            {
                r = 0.639;
                g = 0.8;
                b = 1;
            }
            else if (fName.includes("(G)"))
            {
                g = 0.639;
                b = 0.8;
                r = 1;
            }
            height = 0.35;
        }
        else if (name.includes("Dark"))
        {
            r = 0.5;
            g = 0.5;
            b = 0.5;
        }
        var vertices = 
        [
            new GraphicsVertex(JSONObject.nodes[i].object.BL.x, JSONObject.nodes[i].object.BL.y, JSONObject.nodes[i].object.BL.z, ds, ds, ds, a),
            new GraphicsVertex(JSONObject.nodes[i].object.TL.x, JSONObject.nodes[i].object.TL.y, JSONObject.nodes[i].object.TL.z, ds, ds, ds, a),
            new GraphicsVertex(JSONObject.nodes[i].object.TR.x, JSONObject.nodes[i].object.TR.y, JSONObject.nodes[i].object.TR.z, ds, ds, ds, a),
            new GraphicsVertex(JSONObject.nodes[i].object.BR.x, JSONObject.nodes[i].object.BR.y, JSONObject.nodes[i].object.BR.z, ds, ds, ds, a),
        ];
        var indices = 
        [
            new Index(0, 1, 2),
            new Index(0, 2, 3)
        ];
        if (type == "B")
        {            
            vertices = 
            [
                /**
                 * BOTTOM
                 */
                new GraphicsVertex(JSONObject.nodes[i].object.BL.x, JSONObject.nodes[i].object.BL.y, JSONObject.nodes[i].object.BL.z, ds, ds, ds, a),
                new GraphicsVertex(JSONObject.nodes[i].object.TL.x, JSONObject.nodes[i].object.TL.y, JSONObject.nodes[i].object.TL.z, ds, ds, ds, a),
                new GraphicsVertex(JSONObject.nodes[i].object.TR.x, JSONObject.nodes[i].object.TR.y, JSONObject.nodes[i].object.TR.z, ds, ds, ds, a),
                new GraphicsVertex(JSONObject.nodes[i].object.BR.x, JSONObject.nodes[i].object.BR.y, JSONObject.nodes[i].object.BR.z, ds, ds, ds, a),
                /**
                 * TOP
                 */
                new GraphicsVertex(JSONObject.nodes[i].object.BL.x + offset, JSONObject.nodes[i].object.BL.y + offset, JSONObject.nodes[i].object.BL.z + height, r, g, b, a),
                new GraphicsVertex(JSONObject.nodes[i].object.TL.x + offset, JSONObject.nodes[i].object.TL.y - offset, JSONObject.nodes[i].object.TL.z + height, r, g, b, a),
                new GraphicsVertex(JSONObject.nodes[i].object.TR.x - offset, JSONObject.nodes[i].object.TR.y - offset, JSONObject.nodes[i].object.TR.z + height, r, g, b, a),
                new GraphicsVertex(JSONObject.nodes[i].object.BR.x - offset, JSONObject.nodes[i].object.BR.y + offset, JSONObject.nodes[i].object.BR.z + height, r, g, b, a),
                /**
                 * LEFT
                 */
                new GraphicsVertex(JSONObject.nodes[i].object.BL.x, JSONObject.nodes[i].object.BL.y, JSONObject.nodes[i].object.BL.z, ds, ds, ds, a),
                new GraphicsVertex(JSONObject.nodes[i].object.TL.x, JSONObject.nodes[i].object.TL.y, JSONObject.nodes[i].object.TL.z, ds, ds, ds, a),
                new GraphicsVertex(JSONObject.nodes[i].object.TL.x + offset, JSONObject.nodes[i].object.TL.y - offset, JSONObject.nodes[i].object.TL.z + height, ds, ds, ds, a),
                new GraphicsVertex(JSONObject.nodes[i].object.BL.x + offset, JSONObject.nodes[i].object.BL.y + offset, JSONObject.nodes[i].object.BL.z + height, ds, ds, ds, a),
                /**
                 * RIGHT
                 */
                new GraphicsVertex(JSONObject.nodes[i].object.BR.x, JSONObject.nodes[i].object.BR.y, JSONObject.nodes[i].object.BR.z, ds, ds, ds, a),
                new GraphicsVertex(JSONObject.nodes[i].object.TR.x, JSONObject.nodes[i].object.TR.y, JSONObject.nodes[i].object.TR.z, ds, ds, ds, a),
                new GraphicsVertex(JSONObject.nodes[i].object.TR.x - offset, JSONObject.nodes[i].object.TR.y - offset, JSONObject.nodes[i].object.TR.z + height, ds, ds, ds, a),
                new GraphicsVertex(JSONObject.nodes[i].object.BR.x - offset, JSONObject.nodes[i].object.BR.y + offset, JSONObject.nodes[i].object.BR.z + height, ds, ds, ds, a),
                /**
                 * FRONT
                 */
                new GraphicsVertex(JSONObject.nodes[i].object.BL.x, JSONObject.nodes[i].object.BL.y, JSONObject.nodes[i].object.BL.z, ds, ds, ds, a),
                new GraphicsVertex(JSONObject.nodes[i].object.BR.x, JSONObject.nodes[i].object.BR.y, JSONObject.nodes[i].object.BR.z, ds, ds, ds, a),
                new GraphicsVertex(JSONObject.nodes[i].object.BR.x - offset, JSONObject.nodes[i].object.BR.y + offset, JSONObject.nodes[i].object.BR.z + height, ds, ds, ds, a),
                new GraphicsVertex(JSONObject.nodes[i].object.BL.x + offset, JSONObject.nodes[i].object.BL.y + offset, JSONObject.nodes[i].object.BL.z + height, ds, ds, ds, a),
                /**
                 * BACK
                 */                
                new GraphicsVertex(JSONObject.nodes[i].object.TL.x, JSONObject.nodes[i].object.TL.y, JSONObject.nodes[i].object.TL.z, ds, ds, ds, a),
                new GraphicsVertex(JSONObject.nodes[i].object.TR.x, JSONObject.nodes[i].object.TR.y, JSONObject.nodes[i].object.TR.z, ds, ds, ds, a),
                new GraphicsVertex(JSONObject.nodes[i].object.TR.x - offset, JSONObject.nodes[i].object.TR.y - offset, JSONObject.nodes[i].object.TR.z + height, ds, ds, ds, a),
                new GraphicsVertex(JSONObject.nodes[i].object.TL.x + offset, JSONObject.nodes[i].object.TL.y - offset, JSONObject.nodes[i].object.TL.z + height, ds, ds, ds, a),
            ];
            indices = 
            [
                //new Index(0, 1, 2),
                //new Index(0, 2, 3),

                new Index(4, 5, 6),
                new Index(4, 6, 7),

                new Index(8, 9, 10),
                new Index(8, 10, 11),
                
                new Index(12, 13, 14),
                new Index(12, 14, 15),
                
                new Index(16, 17, 18),
                new Index(16, 18, 19),
                
                new Index(20, 21, 22),
                new Index(20, 22, 23),
            ];
        }
        if (vertices[0].Z === vertices[1].Z && vertices[1].Z === vertices[2].Z && vertices[2].Z === vertices[3].Z)
        {
            if (vertices[0].Z != -1)
            {
                var floor = vertices[0].Z;
                Map[floor].push(new Object3D(ME, vertices, indices, name));
                var sendName = name;                
                if (name.indexOf("(") > 2)
                {
                    sendName = name.substring(0, name.indexOf("("));
                }
                if (sendName.includes("208 E"))
                {
                    sendName = "";
                }
                Map_Labels[floor].push(new Label(sendName, Map[floor][Map[floor].length - 1].GetCenterVertexPoint_HighZ(), 12));
            }
        }
    }
}
function Event_Down(event)
{
    MouseButton = 1;
    PreviousMousePosition = new Point(event.clientX, event.clientY);
}
function Event_TDown(event)
{
    MouseButton = 1;
    PreviousMousePosition = new Point(event.touches[0].pageX, event.touches[0].pageY);
}
function Event_Up(event)
{
    MouseButton = 0;
    UpdateURL();
}
function Event_Move(event)
{
    MousePosition = new Point(event.clientX, event.clientY);
}
function Event_TMove(event)
{
    MousePosition = new Point(event.touches[0].pageX, event.touches[0].pageY);
}
function Event_Wheel(event)
{
    var e = window.event || event;
	var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
    if (ME.Camera.Location.Z - (delta * 2) < 150 && ME.Camera.Location.Z - (delta * 2) > 10)
    {
        ME.Camera.Location.Z -= (delta * 2);
    }
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
    var selected = false;
    var scale = Math.pow(1.039, -ME.Camera.Location.Z + 135) + 10;
    for (var i = 0; i < Map[RenderedFloor].length; i++)
    {
        Map_Labels[RenderedFloor][i].Update(ME, z_rotation);
        try
        {
            if (Map_Labels[RenderedFloor][i].Collision(MousePosition, scale, scale) && selected == false && !Map_Labels[RenderedFloor][i].Text.startsWith("("))
            {
                Map[RenderedFloor][i].ShadeR = 0.80;
                Map[RenderedFloor][i].ShadeG = 0.80;
                Map[RenderedFloor][i].ShadeB = 0.80;
                Map[RenderedFloor][i].ShadeA = 1;
                selected = true;
            }
            else
            {
                Map[RenderedFloor][i].ShadeR = 1;
                Map[RenderedFloor][i].ShadeG = 1;
                Map[RenderedFloor][i].ShadeB = 1;
                Map[RenderedFloor][i].ShadeA = 1;
            }
        }
        catch (e)
        {

        }
    }
}
function DrawImage(image, projection, i)
{
    var scale = Math.pow(1.039, -ME.Camera.Location.Z + 135) + 10;
    Map_Labels[RenderedFloor][i].Icon = true;
    ME.Device2D.drawImage(image, projection.X - (scale / 2), projection.Y - (scale / 2), scale, scale);
}
function Render()
{
    ME.Clear(clrcol[0], clrcol[1], clrcol[2], clrcol[3]);
    var scale = parseInt((Math.pow(1.0293, -ME.Camera.Location.Z + 135) + 5));
    ME.Device2D.font = scale.toString() + "px Calibri";
    for (var i = 0; i < Map[RenderedFloor].length; i++)
    {
        Map[RenderedFloor][i].Revolution.Z = z_rotation;
        Map[RenderedFloor][i].Render(ME);
        var n = Map[RenderedFloor][i].name;
        if (n.includes("(h)") == false && n.includes("(s)") == false)
        {
            var Projection = ME.ProjectVertex(Map_Labels[RenderedFloor][i].Location, z_rotation);
            if (n.includes("Bathroom"))
            {
                if (n.includes("(B)"))
                {
                    DrawImage(ico_b_m, Projection , i);
                }
                else if (n.includes("(G)"))
                {
                    DrawImage(ico_b_f, Projection, i);
                }
            }
            else if (n.includes("Cafeteria"))
            {
                DrawImage(ico_c_a, Projection, i);
            }
            else if (n.includes("Cafe"))
            {
                DrawImage(ico_c_b, Projection, i);
            }
            else if (n.includes("Main Office"))
            {
                DrawImage(ico_m_o, Projection, i);
            }
            else if (n.includes("Library"))
            {
                DrawImage(ico_l_a, Projection, i);
            }
            else if (n.includes("Gym"))
            {
                DrawImage(ico_g_a, Projection, i);
            }
            else if (n.includes("Locker Room"))
            {
                if (n.includes("Boys"))
                {
                    DrawImage(ico_l_m, Projection, i);
                }
                else if (n.includes("Girls"))
                {
                    DrawImage(ico_l_f, Projection, i);
                }
            }
            else if (n.includes("Court"))
            {
                DrawImage(ico_c_y, Projection, i);
            }
            else
            {
                Map_Labels[RenderedFloor][i].Size.Y = scale;
                Map_Labels[RenderedFloor][i].Render(ME, z_rotation);
            }
        }
    }
}

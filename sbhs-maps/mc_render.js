var ME;
var Map = new Array(6);
var RenderedFloor = 0;
var MouseButton = 0;
var MousePosition = new Point(0, 0);
var DeltaMouse = new Point(0, 0);
var PreviousMousePosition = new Point(0, 0);
function Main()
{
    var RenderingCanvas = document.getElementById("studios.vanish.mc.3D");
    RenderingCanvas.addEventListener("mousedown", Event_Down);
    RenderingCanvas.addEventListener("mouseup", Event_Up);
    RenderingCanvas.addEventListener("mousemove", Event_Move);
    RenderingCanvas.addEventListener("mouseover", Event_Move);
    RenderingCanvas.addEventListener("mousewheel", Event_Wheel);
    RenderingCanvas.addEventListener("DOMMouseScroll", Event_Wheel);
    RenderingCanvas.width = document.body.clientWidth;
    RenderingCanvas.height = window.innerHeight - 5;
    ME = new Engine(RenderingCanvas);
    Initialize();
    MainLoop();
}
function Initialize()
{
    var source = "";
    var raw = new XMLHttpRequest();
    raw.open("GET", "map.ngm", false);
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
    }
    for (var i = 0; i < JSONObject.nodes.length; i++)
    {
        var s = 0;
        var a = 1;
        var type = "U";
        if (JSONObject.nodes[i].object.type == "WastedSpace")
        {
            s = 0.8745;
            type = "W";
        }
        else if (JSONObject.nodes[i].object.type == "Building")
        {
            s = 0.968;
            type = "B";
        }
        else if (JSONObject.nodes[i].object.type == "Path")
        {
            s = 1;
            type = "P";
        }
        var vertices = 
        [
            new GraphicsVertex(JSONObject.nodes[i].object.BL.x, JSONObject.nodes[i].object.BL.y, JSONObject.nodes[i].object.BL.z, s, s, s, a),
            new GraphicsVertex(JSONObject.nodes[i].object.TL.x, JSONObject.nodes[i].object.TL.y, JSONObject.nodes[i].object.TL.z, s, s, s, a),
            new GraphicsVertex(JSONObject.nodes[i].object.TR.x, JSONObject.nodes[i].object.TR.y, JSONObject.nodes[i].object.TR.z, s, s, s, a),
            new GraphicsVertex(JSONObject.nodes[i].object.BR.x, JSONObject.nodes[i].object.BR.y, JSONObject.nodes[i].object.BR.z, s, s, s, a),
        ];
        var indices = 
        [
            new Index(0, 1, 2),
            new Index(0, 2, 3)
        ];
        if (vertices[0].Z === vertices[1].Z && vertices[1].Z === vertices[2].Z && vertices[2].Z === vertices[3].Z)
        {
            if (vertices[0].Z != -1)
            {
                var floor = vertices[0].Z;
                Map[floor].push(new Object3D(ME, vertices, indices));
                if (type === "B")
                {
                    for (var j = 0; j < vertices.length; j++)
                    {
                        vertices[j].Z += 0.01;
                        vertices[j].R = 0.784;
                        vertices[j].G = 0.784;
                        vertices[j].B = 0.784;
                    }
                    var v = 
                    [
                        vertices[0],
                        vertices[1],
                        vertices[1],
                        vertices[2],
                        vertices[2],
                        vertices[3],
                        vertices[3],
                        vertices[0],
                    ];
                    var k = 
                    [
                        new Index(0, 1, 2),
                        new Index(1, 2, 3),
                        new Index(2, 3, 4),
                        new Index(3, 4, 5),
                        new Index(6, 7, 0),
                        new Index(7, 0, 1),
                    ];
                    Map[floor].push(new Object3D(ME, v, k));
                    Map[floor][Map[floor].length - 1].RenderMode = "Lines";
                }
            }
        }
    }
    ME.Camera.Location.X = 50;
    ME.Camera.Location.Y = 50;
    ME.Camera.Location.Z = 200;
    //ME.Camera.Rotation.X = -60;
}
function Event_Down(event)
{
    MouseButton = 1;
    PreviousMousePosition = new Point(event.clientX, event.clientY);
}
function Event_Up(event)
{
    MouseButton = 0;
}
function Event_Move(event)
{
    MousePosition = new Point(event.clientX, event.clientY);
}
function Event_Wheel(event)
{
    var e = window.event || event;
	var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
    ME.Camera.Location.Z -= delta;
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
        ME.Camera.Location.X += (DeltaMouse.X * 10) / (500 - ME.Camera.Location.Z);
        ME.Camera.Location.Y -= (DeltaMouse.Y * 10) / (500 - ME.Camera.Location.Z);
    }
}
function Render()
{
    ME.Clear(0.875, 0.875, 0.875, 1);
    for (var i = 0; i < Map[RenderedFloor].length; i++)
    {
        Map[RenderedFloor][i].Render(ME);
    }
}
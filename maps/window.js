var Engine = class Engine
{
    /**
     * Creates and initializes a new rendering window for OpenGL
     * @param {Element} canvas 
     */
    constructor(canvas)
    {
        this.RenderingCanvas = canvas;
        this.Device = this.RenderingCanvas.getContext('webgl');
        this.Device.viewportWidth = this.RenderingCanvas.width;
        this.Device.viewportHeight = this.RenderingCanvas.height;

        this.Shader_Vertex = this.LoadShaderFile("shader.MSV");
        this.Shader_Pixel = this.LoadShaderFile("shader.MSP");

        this.Shader_Program = this.Device.createProgram();
        this.Device.attachShader(this.Shader_Program, this.Shader_Vertex);
        this.Device.attachShader(this.Shader_Program, this.Shader_Pixel);
        this.Device.linkProgram(this.Shader_Program);
        if (!this.Device.getProgramParameter(this.Shader_Program, this.Device.LINK_STATUS))
        {
            alert("Could not initialize shaders");
        }
        this.Device.useProgram(this.Shader_Program);
        this.Shader_Program.vertexPositionAttribute = this.Device.getAttribLocation(this.Shader_Program, "vertexPosition");
        this.Device.enableVertexAttribArray(this.Shader_Program.vertexPositionAttribute);
        this.Shader_Program.vertexColorAttribute = this.Device.getAttribLocation(this.Shader_Program, "vertexColor");
        this.Device.enableVertexAttribArray(this.Shader_Program.vertexColorAttribute);
        this.Shader_Program.pMatrixUniform = this.Device.getUniformLocation(this.Shader_Program, "uPMatrix");
        this.Shader_Program.mvMatrixUniform = this.Device.getUniformLocation(this.Shader_Program, "uMVMatrix");
        
        this.Device.clearColor(0.0, 0.0, 0.0, 1.0);
        this.Device.enable(this.Device.DEPTH_TEST);

        this.mvMatrix = mat4.create();
        this.pMatrix = mat4.create();

        //DELHERE
        this.triangleVertexPositionBuffer = this.Device.createBuffer();
        this.Device.bindBuffer(this.Device.ARRAY_BUFFER, this.triangleVertexPositionBuffer);
        var vertices = 
        [
            +0.0, +1.0, +0.0,
            -1.0, -1.0, +0.0,
            +1.0, -1.0, +0.0
        ];
        this.Device.bufferData(this.Device.ARRAY_BUFFER, new Float32Array(vertices), this.Device.STATIC_DRAW);
        this.triangleVertexPositionBuffer.itemSize = 3;
        this.triangleVertexPositionBuffer.numItems = 3;

        this.triangleVertexColorBuffer = this.Device.createBuffer();
        this.Device.bindBuffer(this.Device.ARRAY_BUFFER, this.triangleVertexColorBuffer);
        var colors = 
        [
            1.0, 0.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 1.0
        ];
        this.Device.bufferData(this.Device.ARRAY_BUFFER, new Float32Array(colors), this.Device.STATIC_DRAW);
        this.triangleVertexColorBuffer.itemSize = 4;
        this.triangleVertexColorBuffer.numItems = 3;
        //RENDERING
        this.Device.viewport(0, 0, this.Device.viewportWidth, this.Device.viewportHeight);
        this.Device.clear(this.Device.COLOR_BUFFER_BIT | this.Device.DEPTH_BUFFER_BIT);

        mat4.perspective(45, this.Device.viewportWidth / this.Device.viewportHeight, 0.1, 100.0, this.pMatrix);
        mat4.identity(this.mvMatrix);
        mat4.translate(this.mvMatrix, [0, 0.0, -7.0]);
        this.Device.bindBuffer(this.Device.ARRAY_BUFFER, this.triangleVertexPositionBuffer);
        this.Device.vertexAttribPointer(this.Shader_Program.vertexPositionAttribute, this.triangleVertexPositionBuffer.itemSize, this.Device.FLOAT, false, 0, 0);
        this.Device.bindBuffer(this.Device.ARRAY_BUFFER, this.triangleVertexColorBuffer);
        this.Device.vertexAttribPointer(this.Shader_Program.vertexColorAttribute, this.triangleVertexColorBuffer.itemSize, this.Device.FLOAT, false, 0, 0);
        this.setMatrixUniforms();
        this.Device.drawArrays(this.Device.LINE_LOOP, 0, this.triangleVertexPositionBuffer.numItems);
    }
    setMatrixUniforms()
    {
        this.Device.uniformMatrix4fv(this.Shader_Program.pMatrixUniform, false, this.pMatrix);
        this.Device.uniformMatrix4fv(this.Shader_Program.mvMatrixUniform, false, this.mvMatrix);
    }
    /**
     * Reads a shader file and loads it into a shader object for later use
     * @param {String} file 
     */
    LoadShaderFile(file)
    {
        var location = window.location.href.substr(0, window.location.href.lastIndexOf("/"));
        var source = "";
        var raw = new XMLHttpRequest();
        raw.open("GET", file, false);
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
        raw.send();
        var shader;
        if (file.endsWith(".MSV"))
        {
            shader = this.Device.createShader(this.Device.VERTEX_SHADER);
        }
        else if (file.endsWith(".MSP"))
        {
            shader = this.Device.createShader(this.Device.FRAGMENT_SHADER);
        }
        else
        {
            return null;
        }
        this.Device.shaderSource(shader, source);
        this.Device.compileShader(shader);
        if (!this.Device.getShaderParameter(shader, this.Device.COMPILE_STATUS))
        {
            alert(this.Device.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }
}
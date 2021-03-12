(this.webpackJsonpmaze=this.webpackJsonpmaze||[]).push([[0],{67:function(e,t,r){"use strict";r.r(t);var n=r(0),a=r.n(n),o=r(9),i=r.n(o),c=r(14),s=r(107),l=r(102),u=r(106),h=r(45),d=r(99),f=Object(h.a)({palette:{type:"dark",background:{default:"rgba(3, 7, 54, 1)"},primary:d.a}}),p=r(100),b=Object(p.a)((function(e){return{root:{background:"url(background.jpg)",backgroundRepeat:"no-repeat",backgroundPosition:"center",height:"100vh",display:"flex"}}})),m=r(109),g=r(104),v=r(108),x=r(105),j=r(69),w=Object(p.a)((function(e){return{root:{background:"url(background.jpg)",backgroundRepeat:"no-repeat",backgroundPosition:"center",height:"100vh",display:"flex"},wrapper:{padding:e.spacing(10),justifyContent:"center",backdropFilter:"blur(10px)",display:"flex",flexDirection:"column"},title:{fontFamily:"DotGothic16, sans-serif",textAlign:"center",backdropFilter:"blur(10px)",userSelect:"none"},subtitle:{fontFamily:"DotGothic16, sans-serif",textAlign:"center",userSelect:"none"},controlText:{userSelect:"none",fontFamily:"DotGothic16, sans-serif"},controlsWrapper:{marginTop:e.spacing(2),textAlign:"center"},controls:{maxWidth:500,margin:"auto",textAlign:"left"},numberInputs:{margin:e.spacing(1),width:"10",borderRadius:"0px",textAlign:"center"},buttonGroup:{textAlign:"center"},submit:{fontFamily:"DotGothic16, sans-serif",textAlign:"right"}}})),A=r(5),y=function(e){var t=e.onSubmit,r=(e.visible,w()),a=Object(n.useState)(10),o=Object(c.a)(a,2),i=o[0],s=o[1],u=Object(n.useState)(10),h=Object(c.a)(u,2),d=h[0],f=h[1],p=Object(n.useState)(!0),b=Object(c.a)(p,2),y=b[0],O=b[1];return Object(A.jsx)(m.a,{in:y,onExited:function(e){t&&t(i,d)},children:Object(A.jsxs)(l.a,{className:r.wrapper,children:[Object(A.jsx)(g.a,{variant:"h1",component:"h1",className:r.title,children:"MAZE"}),Object(A.jsx)(g.a,{variant:"subtitle1",component:"h2",className:r.subtitle,children:"Shivan Modha (RU-CS428)"}),Object(A.jsx)(l.a,{maxWidth:"sm",className:r.controlsWrapper,children:Object(A.jsxs)("form",{onSubmit:function(e){e.preventDefault(),O(!1)},className:r.controls,children:[Object(A.jsxs)("div",{children:[Object(A.jsx)(v.a,{id:"input-wid",required:!0,color:"primary",size:"small",variant:"outlined",value:i,onChange:function(e){var t=e.target.value;t<1?t=1:t>50&&(t=50),s(t)},label:"width",type:"number",className:r.numberInputs}),Object(A.jsx)(v.a,{id:"input-hei",required:!0,color:"primary",size:"small",variant:"outlined",value:d,onChange:function(e){var t=e.target.value;t<1?t=1:t>50&&(t=50),f(t)},label:"height",type:"number",className:r.numberInputs})]}),Object(A.jsx)("div",{className:r.buttonGroup,children:Object(A.jsxs)(x.a,{children:[Object(A.jsx)(j.a,{color:"default",href:"https://shivan.modha.io",className:r.submit,children:"home"}),Object(A.jsx)(j.a,{type:"submit",color:"primary",className:r.submit,children:"start"})]})})]})})]})})},O=Object(p.a)((function(e){return{wrapper:{marginLeft:-e.spacing(3),backdropFilter:"blur(10px)"}}})),E=function(e,t,r){var n=e.createShader(t);return e.shaderSource(n,r),e.compileShader(n),e.getShaderParameter(n,e.COMPILE_STATUS)?n:(e.deleteShader(n),console.error("Failed to compile shaders"),null)},R={initialize:function(e,t,r){var n=e.getContext("webgl2");if(!n)return{success:!1,message:"Unable to initialize webgl. Your browser or machine may not support it."};var a=function(e,t,r){var n=E(e,e.VERTEX_SHADER,t),a=E(e,e.FRAGMENT_SHADER,r),o=e.createProgram();return e.attachShader(o,n),e.attachShader(o,a),e.linkProgram(o),e.getProgramParameter(o,e.LINK_STATUS)?o:(console.error("Failed to initialize shader program: "+e.getProgramInfoLog(o)),null)}(n,"\nattribute vec4 vertexPosition;\nattribute vec4 vertexColor;\n\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\n\nvarying lowp vec4 color;\n\nvoid main(void) {\n    gl_Position = projectionMatrix * modelViewMatrix * vertexPosition;\n    color = vertexColor;\n}\n","\nvarying lowp vec4 color;\n\nvoid main(void) {\n    gl_FragColor = color;\n}\n");if(!a)return{success:!1,message:"Unable to initialize shaders. Check the logs for more errors."};var o={program:a,attribLocations:{vertexPosition:n.getAttribLocation(a,"vertexPosition"),vertexColor:n.getAttribLocation(a,"vertexColor")},uniformLocations:{projectionMatrix:n.getUniformLocation(a,"projectionMatrix"),modelViewMatrix:n.getUniformLocation(a,"modelViewMatrix")}};if(t&&t(n),r){var i=0;requestAnimationFrame((function e(t){var a=.001*t-i;i=.001*t,r(n,o,a)&&requestAnimationFrame(e)}))}},createBuffers:function(e,t,r){for(var n=[],a=[],o=0;o<t.length;o++)n.push(t[o][0],t[o][1],t[o][2]),a.push(t[o][3],t[o][4],t[o][5],t[o][6]);var i=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,i),e.bufferData(e.ARRAY_BUFFER,new Float32Array(n),e.STATIC_DRAW);var c=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,c),e.bufferData(e.ARRAY_BUFFER,new Float32Array(a),e.STATIC_DRAW);var s=e.createBuffer();return e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,s),e.bufferData(e.ELEMENT_ARRAY_BUFFER,new Uint16Array(r),e.STATIC_DRAW),{position:i,color:c,indices:{buffer:s,length:r.length}}},renderBuffers:function(e,t,r,n,a){e.bindBuffer(e.ARRAY_BUFFER,r.position),e.vertexAttribPointer(t.attribLocations.vertexPosition,3,e.FLOAT,!1,0,0),e.enableVertexAttribArray(t.attribLocations.vertexPosition),e.bindBuffer(e.ARRAY_BUFFER,r.color),e.vertexAttribPointer(t.attribLocations.vertexColor,4,e.FLOAT,!1,0,0),e.enableVertexAttribArray(t.attribLocations.vertexColor),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,r.indices.buffer),e.useProgram(t.program),e.uniformMatrix4fv(t.uniformLocations.projectionMatrix,!1,n),e.uniformMatrix4fv(t.uniformLocations.modelViewMatrix,!1,a),e.drawElements(e.TRIANGLES,r.indices.length,e.UNSIGNED_SHORT,0)}},F=r(13),k=[0,0,0],S=[0,0,.5],M=[.75,.01,.98,1],T=[.375,.005,.49,1],L=[.5,.01/1.5,.98/1.5,1],B=[.1,.1,.1,.001],N={},D={},_={},P=[],U=!0,C=0,I={down:!1,up:!1,left:!1,right:!1},W=function(e){var t=e.board,r=e.onFinish,a=O(),o=Object(n.useState)([window.innerWidth,window.innerHeight]),i=Object(c.a)(o,2),s=i[0],l=i[1];P=[],S=[t.start[0]+.5,t.start[1]+.5,0],k=[-S[0],-S[1],-10],Object(n.useEffect)((function(){var e,t=function(){clearTimeout(e),e=setTimeout((function(){l([window.innerWidth,window.innerHeight])}),500)};window.addEventListener("resize",t);var r=function(e){k[2]+=.005*e.wheelDelta};window.addEventListener("wheel",r);var n=function(e){"ArrowUp"===e.key&&(I.up=!0),"ArrowDown"===e.key&&(I.down=!0),"ArrowLeft"===e.key&&(I.left=!0),"ArrowRight"===e.key&&(I.right=!0)};window.addEventListener("keydown",n);var a=function(e){"ArrowUp"===e.key&&(I.up=!1),"ArrowDown"===e.key&&(I.down=!1),"ArrowLeft"===e.key&&(I.left=!1),"ArrowRight"===e.key&&(I.right=!1)};return window.addEventListener("keyup",a),function(){window.removeEventListener("resize",t,!1),window.removeEventListener("wheel",r,!1),window.removeEventListener("keydown",n,!1),window.removeEventListener("keyup",a,!1),window.removeEventListener("resize",t,!0),window.removeEventListener("wheel",r,!0),window.removeEventListener("keydown",n,!0),window.removeEventListener("keyup",a,!0)}}));return Object(n.useEffect)((function(){U=!0;var e=document.getElementById("webgl-context");R.initialize(e,(function(e){for(var r=[],n=[],a=0,o=0;o<t.array.length;o++)for(var i=0;i<t.array[o].length;i++){for(var c=t.array[o][i].toString(2);c.length<4;)c="0".concat(c);var s=[.99,.72,.01,.5],l=[.33,.24,.01/3,1],u=[.01,.02,.21,.5];t.start[0]===o&&t.start[1]===i?u=[1,0,0,.005]:t.end[0]===o&&t.end[1]===i&&(u=[0,1,0,.005]),r.push([o+0,i+0,0].concat(u),[o+1,i+0,0].concat(u),[o+1,i+1,0].concat(u),[o+0,i+1,0].concat(u),[o+0,i+0,1].concat(s),[o+1,i+0,1].concat(s),[o+1,i+1,1].concat(s),[o+0,i+1,1].concat(s),[o+0,i+0,0].concat(l),[o+1,i+0,0].concat(l),[o+1,i+1,0].concat(l),[o+0,i+1,0].concat(l)),n.push(a+0,a+1,a+2,a+0,a+2,a+3),"1"===c.charAt(0)&&n.push(a+8,a+9,a+4,a+9,a+4,a+5),"1"===c.charAt(1)&&n.push(a+9,a+10,a+5,a+10,a+5,a+6),"1"===c.charAt(2)&&n.push(a+10,a+11,a+6,a+11,a+6,a+7),"1"===c.charAt(3)&&n.push(a+11,a+8,a+7,a+8,a+7,a+4),a+=12}N=R.createBuffers(e,r,n);var h=[[-.12,-.12,.01].concat(M),[.12,-.12,.01].concat(M),[.12,.12,.01].concat(M),[-.12,.12,.01].concat(M),[-.1,-.1,.1].concat(T),[.1,-.1,.1].concat(T),[.1,.1,.1].concat(T),[-.1,.1,.1].concat(T),[-.12,-.12,.01].concat(M),[.12,-.12,.01].concat(M),[-.1,-.1,.1].concat(M),[.1,-.1,.1].concat(M),[.12,-.12,.01].concat(L),[.12,.12,.01].concat(L),[.1,-.1,.1].concat(L),[.1,.1,.1].concat(L),[-.12,-.12,.01].concat(L),[-.12,.12,.01].concat(L),[-.1,-.1,.1].concat(L),[-.1,.1,.1].concat(L)];D=R.createBuffers(e,h,[0,1,2,0,2,3,4,5,6,4,6,7,8,9,10,9,10,11,12,13,14,13,14,15,16,17,18,17,18,19]);var d=[[-.07,-.07,.01].concat(B),[.07,-.07,.01].concat(B),[.07,.07,.01].concat(B),[-.07,.07,.01].concat(B)];_=R.createBuffers(e,d,[0,1,2,0,2,3])}),(function(e,r,n){e.clearColor(0,0,0,0),e.clearDepth(1),e.enable(e.DEPTH_TEST),e.depthFunc(e.LEQUAL),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT);var a=45*Math.PI/180,o=e.canvas.clientWidth/e.canvas.clientHeight,i=F.a.create();F.a.perspective(i,a,o,.1,1e3);for(var c=t.array[Math.floor(S[0])][Math.floor(S[1])].toString(2);c.length<4;)c="0".concat(c);Math.floor(S[0])===t.end[0]&&Math.floor(S[1])===t.end[1]&&(U=!1,setTimeout((function(){l([window.innerWidth,window.innerHeight])}),500));var s=3*C;I.up&&("1"===c.charAt(2)?S[1]+.17<Math.floor(S[1])+1&&(S[1]+=s):S[1]+.17<t.array[0].length&&(S[1]+=s)),I.down&&("1"===c.charAt(0)?S[1]-.17>Math.floor(S[1])&&(S[1]-=s):S[1]-.17>0&&(S[1]-=s)),I.right&&("1"===c.charAt(1)?S[0]+.17<Math.floor(S[0])+1&&(S[0]+=s):S[0]+.17<t.array.length&&(S[0]+=s)),I.left&&("1"===c.charAt(3)?S[0]-.17>Math.floor(S[0])&&(S[0]-=s):S[0]-.17>0&&(S[0]-=s)),P.unshift([S[0],S[1],S[2]]),P.length>500&&P.pop(),k[0]=-S[0],k[1]=-S[1];var u=[k[0],k[1],k[2]],h=Math.min(.28*t.array.length,6),d=Math.min(.28*t.array[0].length,6);u[0]>-h&&(u[0]=-h),u[0]<-(t.array.length-h)&&(u[0]=-(t.array.length-h)),u[1]>-d&&(u[1]=-d),u[1]<-(t.array[0].length-d)&&(u[1]=-(t.array[0].length-d)),u[1]+=t.array[0].length/10;var f=F.a.create();F.a.translate(f,f,u),F.a.rotate(f,f,-.5,[1,0,0]),R.renderBuffers(e,r,N,i,f);var p=F.a.create();F.a.translate(p,p,u),F.a.rotate(p,p,-.5,[1,0,0]),F.a.translate(p,p,S),R.renderBuffers(e,r,D,i,p);for(var b=0;b<Math.min(100,P.length/5);b+=5){var m=F.a.create();F.a.translate(m,m,u),F.a.rotate(m,m,-.5,[1,0,0]),F.a.translate(m,m,P[b]),R.renderBuffers(e,r,_,i,m)}return C=n,U}))}),[t]),Object(A.jsx)(m.a,{in:U,onExited:function(){U=!0,r()},children:Object(A.jsx)("div",{className:a.wrapper,children:Object(A.jsx)("canvas",{id:"webgl-context",width:s[0],height:s[1],background:"red"})})})},G={bottom:{binary:"1000",decimal:4},right:{binary:"0100",decimal:3},top:{binary:"0010",decimal:2},left:{binary:"0001",decimal:1}},z={bottom:{oppositeType:"top",direction:[0,-1]},top:{oppositeType:"bottom",direction:[0,1]},left:{oppositeType:"right",direction:[-1,0]},right:{oppositeType:"left",direction:[1,0]}},Y=function(e,t){for(var r=e.toString(2);r.length<4;)r="0".concat(r);return r=r.substring(0,t)+"0"+r.substring(t+1),parseInt(r,2)},H=function(e,t,r,n){if(0===t&&"left"===n||0===r&&"bottom"===n||t===e.length&&"right"===n||r===e[0].length&&"top"===n)return e;e[t][r]=Y(e[t][r],4-G[n].decimal);var a=t+z[n].direction[0],o=r+z[n].direction[1];return e[a][o]=Y(e[a][o],4-G[z[n].oppositeType].decimal),e},V=function(e,t,r){for(var n=e[t][r].toString(2);n.length<4;)n="0".concat(n);var a=[],o=[];return"1"===n.charAt(0)?r-1>=0&&o.push([t,r-1,"bottom"]):a.push([t,r-1,"bottom"]),"1"===n.charAt(1)?t+1<e.length&&o.push([t+1,r,"right"]):a.push([t+1,r,"right"]),"1"===n.charAt(2)?r+1<e[0].length&&o.push([t,r+1,"top"]):a.push([t,r-1,"top"]),"1"===n.charAt(3)?t-1>=0&&o.push([t-1,r,"left"]):a.push([t-1,r,"left"]),{potentialEdges:o,edges:a}},q={createNewBoard:function(e,t){for(var r=[],n=0;n<e;n++){for(var a=[],o=0;o<t;o++)a.push(15);r.push(a)}return r},EdgeTypes:G,createEdge:H,getEdges:V,randomWalk:function(e,t){var r={},n={};r[t]=!0;for(var a=V(e,t[0],t[1]).potentialEdges,o=0;o<a.length;o++)n[[a[o][0],a[o][1]]]=[a[o][2]];for(;Object.keys(r).length<e.length*e[0].length;){var i=Object.keys(n)[Math.floor(Math.random()*Object.keys(n).length)];if(!i)break;var c=n[i][Math.floor(Math.random()*n[i].length)];i=i.split(",").map((function(e){return parseInt(e)})),e=H(e,i[0],i[1],z[c].oppositeType),r[i]=!0,delete n[i];for(var s=V(e,i[0],i[1]).potentialEdges,l=0;l<s.length;l++)r[[s[l][0],s[l][1]]]||(n[[s[l][0],s[l][1]]]?n[[s[l][0],s[l][1]]].push(s[l][2]):n[[s[l][0],s[l][1]]]=[s[l][2]])}return e}},J=Object(p.a)((function(e){return{root:{background:"url(background.jpg)",backgroundRepeat:"no-repeat",backgroundPosition:"center",height:"100vh",display:"flex"},wrapper:{padding:e.spacing(10),justifyContent:"center",backdropFilter:"blur(10px)",display:"flex",flexDirection:"column"},title:{fontFamily:"DotGothic16, sans-serif",textAlign:"center",backdropFilter:"blur(10px)",userSelect:"none"},subtitle:{fontFamily:"DotGothic16, sans-serif",textAlign:"center",userSelect:"none"},controlText:{userSelect:"none",fontFamily:"DotGothic16, sans-serif"},controlsWrapper:{marginTop:e.spacing(2),textAlign:"center"},controls:{maxWidth:500,margin:"auto",textAlign:"left"},numberInputs:{margin:e.spacing(1),width:"10",borderRadius:"0px",textAlign:"center"},buttonGroup:{textAlign:"center"},submit:{fontFamily:"DotGothic16, sans-serif",textAlign:"right"}}})),K=function(e){var t=e.onReturn,r=J(),a=Object(n.useState)(!0),o=Object(c.a)(a,2),i=o[0],s=o[1];return Object(A.jsx)(m.a,{in:i,onExited:function(e){t&&t()},children:Object(A.jsxs)(l.a,{className:r.wrapper,children:[Object(A.jsx)(g.a,{variant:"h1",component:"h1",className:r.title,children:"You Won!"}),Object(A.jsx)(g.a,{variant:"subtitle1",component:"h2",className:r.subtitle,children:"Thank you for playing!"}),Object(A.jsx)(l.a,{maxWidth:"sm",className:r.controlsWrapper,children:Object(A.jsx)("form",{onSubmit:function(e){e.preventDefault(),s(!1)},className:r.controls,children:Object(A.jsx)("div",{className:r.buttonGroup,children:Object(A.jsx)(x.a,{children:Object(A.jsx)(j.a,{type:"submit",color:"primary",className:r.submit,children:"return"})})})})})]})})},Q=function(){var e=b(),t=Object(n.useState)(null),r=Object(c.a)(t,2),a=r[0],o=r[1],i=Object(n.useState)("menu"),h=Object(c.a)(i,2),d=h[0],p=h[1];return Object(A.jsxs)(u.a,{theme:f,children:[Object(A.jsx)(s.a,{}),Object(A.jsxs)(l.a,{fluid:!0,maxWidth:!1,className:e.root,children:["menu"===d&&Object(A.jsx)(y,{onSubmit:function(e,t){var r=q.createNewBoard(e,t),n=[0,Math.floor(Math.random()*t)];r=q.randomWalk(r,n);var a=[e-1,Math.floor(Math.random()*t)];o({array:r,start:n,end:a}),p("game")}}),"game"===d&&Object(A.jsx)(W,{board:a,onFinish:function(){p("gameover"),o(null)}}),"gameover"===d&&Object(A.jsx)(K,{onReturn:function(){p("menu")}})]})]})};i.a.render(Object(A.jsx)(a.a.StrictMode,{children:Object(A.jsx)(Q,{})}),document.getElementById("root"))}},[[67,1,2]]]);
//# sourceMappingURL=main.df4788aa.chunk.js.map
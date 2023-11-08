const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

if (!gl) {
  alert("WebGL is NOT available.");
}

const vertexData = [0,1,0,
                    1,-1,0,
                    -1,-1,0];

const colorData = [1, 0, 0,
                   0, 1, 0,
                   0, 0, 1];

const indices = [0,1,2];

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);

var indexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

const vertexShader = gl.createShader(gl.VERTEX_SHADER);

gl.shaderSource(vertexShader, `
    attribute vec3 position;
    attribute vec3 color;
    uniform mat4 Pmatrix;
    uniform mat4 Vmatrix;
    uniform mat4 Mmatrix;
    varying vec3 vColor;
    void main()
    {
        vColor = color;
        gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1);
    }
`);

gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

gl.shaderSource(fragmentShader, `
    precision mediump float;
    varying vec3 vColor;
    void main()
    {
        gl_FragColor = vec4(vColor, 1);        
    }
`);

gl.compileShader(fragmentShader);

const program = gl.createProgram();

gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

var Pmatrix = gl.getUniformLocation(program, "Pmatrix");
var Vmatrix = gl.getUniformLocation(program, "Vmatrix");
var Mmatrix = gl.getUniformLocation(program, "Mmatrix");

const positionLocation = gl.getAttribLocation(program, `position`);
gl.enableVertexAttribArray(positionLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

const colorLocation = gl.getAttribLocation(program, `color`);
gl.enableVertexAttribArray(colorLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

gl.useProgram(program);

function get_projection(angle, a, zMin, zMax) {
    var ang = Math.tan((angle*.5)*Math.PI/180);
    return [
       0.5/ang, 0 , 0, 0,
       0, 0.5*a/ang, 0, 0,
       0, 0, -(zMax+zMin)/(zMax-zMin), -1,
       0, 0, (-2*zMax*zMin)/(zMax-zMin), 0
    ];
}

var proj_matrix = get_projection(40, canvas.width/canvas.height, 1, 100);
var mov_matrix = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
var view_matrix = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];

view_matrix[14] = view_matrix[14]-3;

function rotateZ(m, angle) {
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    var mv0 = m[0], mv4 = m[4], mv8 = m[8]; 

    m[0] = c*m[0]-s*m[1];
    m[4] = c*m[4]-s*m[5];
    m[8] = c*m[8]-s*m[9];
    m[1] = c*m[1]+s*mv0;
    m[5] = c*m[5]+s*mv4;
    m[9] = c*m[9]+s*mv8;
}

var time_old = 0;

var animate = function(time) {
    var dt = time-time_old;
    rotateZ(mov_matrix, dt*0.002);
    time_old = time;

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clearColor(0, 0, 0, 1);
    gl.clearDepth(1.0);
    gl.viewport(0.0, 0.0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.uniformMatrix4fv(Pmatrix, false, proj_matrix);
    gl.uniformMatrix4fv(Vmatrix, false, view_matrix);
    gl.uniformMatrix4fv(Mmatrix, false, mov_matrix);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    window.requestAnimationFrame(animate);
}
animate(0);
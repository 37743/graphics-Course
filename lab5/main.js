const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

if(!gl)
{
    alert("WebGl is NOT available.")
}

// const vertexData = [
//                     -.5,.5,0,
//                     -.5,-.5,0,
//                     0,-.5,0,
//                     0,.5,0,
//                     0,-.5,0,
//                     0,.5,0,
//                     .5,.5,0,
//                     .5,-.5,0];

// const vertexData = [ 
//                     -.5,.5,0,
//                     -.5,-.5,0,
//                     .5,-.5,0,
//                     -.5,.5,0,
//                     .5,-.5,0,
//                     .5,.5,0];

const vertexData = [-.5,.5,0,
                    -.5,-.5,0,
                    .5,-.5,0,
                    .5,.5,0];

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

const vertexShader = gl.createShader(gl.VERTEX_SHADER);

gl.shaderSource(vertexShader,`
    attribute vec3 position;
    void main()
    {
        gl_Position = vec4(position,1);
    }
`);

gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

gl.shaderSource(fragmentShader,`
    void main()
    {
        gl_FragColor = vec4(1,0,0,1);
    }
`);
gl.compileShader(fragmentShader);

const program = gl.createProgram();

gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program)

const positionLocation = gl.getAttribLocation(program, `position`);
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation,3,gl.FLOAT,false,0,0);
gl.clearColor(0, 0, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT);

gl.useProgram(program);
gl.drawArrays(gl.TRIANGLE_FAN, 0, 8)

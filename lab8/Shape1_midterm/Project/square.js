
var gl;
var points;
window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    var A=vec2(-.4,-.3)
    var B=vec2(-.4,.3)
    var C=vec2(-.2,.3)
    var D=vec2(-.2,.1)
    var E=vec2(.1,.1)
    var F=vec2(.1,.3)
    var G=vec2(.4,.3)
    var H=vec2(.4,0)
    var I=vec2(.2,0)
    var J=vec2(.2,-.3)



    var vertices = [A,B,C,A,C,D,A,D,E,A,E,I,A,I,J,E,F,G,E,I,G,I,G,H];

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0, 0, 0, 1 );
    
    //  Load shaders and initialize attribute buffers
    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Load the data into the GPU
    
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, 24 );
    
}
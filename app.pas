program App;

{$macro on}
{$define nl:=+ LineEnding +}

uses
  OpenGLES;

var
  VertShaderSource: PChar =
'attribute vec3 vertex;'nl
'void main(void) {'nl
'  gl_Position = vec4(vertex, 1.0);'nl
'}';

  FragShaderSource: PChar =
'void main(void) {'nl
'  gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);'nl
'}';

  VertexBuffer, IndexBuffer: GLuint;
  Vertices: array[0..8] of Single = (
     0.0,  0.5, 0.0,
    -0.5, -0.5, 0.0,
     0.5, -0.5, 0.0
  );
  Indices: array[0..2] of Word = (
    0, 1, 2
  );

  VertShader,
  FragShader,
  Prog: GLuint;
  VertexLoc: GLint;
  Len: GLuint;

begin
  // Prepare
  glCreateBuffers(1, @VertexBuffer);
  glBindBuffer(GL_ARRAY_BUFFER, VertexBuffer);
  glBufferData(GL_ARRAY_BUFFER, SizeOf(Vertices), @Vertices[0], GL_STATIC_DRAW);
  glBindBuffer(GL_ARRAY_BUFFER, 0);

  glCreateBuffers(1, @IndexBuffer);
  glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, IndexBuffer);
  glBufferData(GL_ELEMENT_ARRAY_BUFFER, SizeOf(Indices), @Indices[0], GL_STATIC_DRAW);
  glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, 0);

  VertShader := glCreateShader(GL_VERTEX_SHADER);
  Len := Length(VertShaderSource);
  glShaderSource(VertShader, 1, @VertShaderSource, @Len);
  glCompileShader(VertShader);

  FragShader := glCreateShader(GL_FRAGMENT_SHADER);
  Len := Length(FragShaderSource);
  glShaderSource(FragShader, 1, @FragShaderSource, @Len);
  glCompileShader(FragShader);

  Prog := glCreateProgram;
  glAttachShader(Prog, VertShader);
  glAttachShader(Prog, FragShader);
  glLinkProgram(Prog);

  // Render
  glClearColor(0, 0, 0, 1);
  glViewport(0, 0, 640, 480);
  glClear(GL_COLOR_BUFFER_BIT or GL_DEPTH_BUFFER_BIT);

  glUseProgram(Prog);
  glBindBuffer(GL_ARRAY_BUFFER, VertexBuffer);
  glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, IndexBuffer);

  VertexLoc := glGetAttribLocation(Prog, 'vertex');
  glVertexAttribPointer(VertexLoc, 3, GL_FLOAT, GL_FALSE, 0, nil);
  glEnableVertexAttribArray(VertexLoc);
  glDrawElements(GL_TRIANGLES, Length(Indices), GL_UNSIGNED_SHORT, nil);
end.

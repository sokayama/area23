attribute vec3 position;
attribute vec2 textureCoord;
uniform vec3 at;

uniform vec4 texture_scale;
uniform vec4 scale;
uniform vec4 translate;

varying vec2 vtx_uv;
varying vec4 vtx_col;
varying vec3 vtx_eye;
varying vec3 vtx_pos;
varying vec3 vtx_dir;

void main(){
    vtx_uv = textureCoord;// uvをfragに渡す

    vec4 pos = vec4(position,1.0);

    pos *= (scale * texture_scale);
    pos += translate;

	gl_Position = pos;
}
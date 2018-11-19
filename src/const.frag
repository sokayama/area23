precision mediump float;

uniform sampler2D color_tex; 
uniform vec4 config;

uniform sampler2D texture;

varying vec2 vtx_uv;

void main(void){
	vec4 smpColor = texture2D(texture,vtx_uv.st);
	// gl_FragColor = smpColor + vec4(vec3(0.2),1.0);
	gl_FragColor = smpColor;
    // if(gl_FragColor.a < 0.01){
    //     discard;
    // }
}

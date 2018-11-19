class WebGLUtil {
	constructor(canvas_id){

		this.c = null;
		this.gl = null;

		this.lookAtParam = {
			eye : [0.0,0.0,5.0],
			at : [0.0,0.0,0.0],
			up : [0.0,1.0,0.0]
		}

		this.texture = [];
	}
	
	init(canvas_id){
		// - canvas と WebGL コンテキストの初期化 -------------------------------------
		// canvasエレメントを取得
		this.c = document.getElementById(canvas_id);

		this.c.width = 800;
		this.c.height = 800;

		// webglコンテキストを取得
		this.gl = this.c.getContext('webgl') || this.c.getContext('experimental-webgl');

	}

	/**
	 * @method setLookAtParam カメラパラメータ
	 * @param {array} eye カメラ本体の座標
	 * @param {array} at at座標
	 * @param {array} up 上向き座標
	 */
	setLookAtParam(eye,at,up){
		if(eye){
			this.lookAtParam.eye = eye;
		}
		if(at){
			this.lookAtParam.at = at;
		}
		if(up){
			this.lookAtParam.up = up;
		}
	}

	setCanvasSize(width,height){
		let DPR = window.devicePixelRatio;
		console.log({width,height,DPR})
		this.c.style.width = width;
		this.c.style.height = height;
		
		this.c.width = width * DPR;
		this.c.height = height * DPR;			
	}

	clickEvent(callback){
		this.c.addEventListener("click",callback,false);
	}

	preDraw(){
		// - レンダリングのための WebGL 初期化設定 ------------------------------------
		// ビューポートを設定する
		this.gl.viewport(0, 0, this.c.width, this.c.height);

		// canvasを初期化する色を設定する
		this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

		// canvasを初期化する際の深度を設定する
		this.gl.clearDepth(1.0);

		// canvasを初期化
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
	}

	flush(){
		// コンテキストの再描画
		this.gl.flush();
	}

	/**
	 * テクスチャを生成する関数
	 * @param {string} source テクスチャに適用する画像ファイルのパス
	 */
	create_texture(source,callback){
		let cbFunc = callback;
		// イメージオブジェクトの生成
		let img = new Image();
		// データのオンロードをトリガーにする
		img.addEventListener("load",()=>{
			let texture_size = {};
			texture_size.x = img.width;
			texture_size.y = img.height;

			// テクスチャオブジェクトの生成
			this.texture.push(this.gl.createTexture());
			
			// テクスチャをバインドする
			this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture[this.texture.length-1]);
			
			// テクスチャへイメージを適用
			this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, img);
			
			//テクスチャパラメータ
			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);

			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);

			// ミップマップを生成
			// this.gl.generateMipmap(this.gl.TEXTURE_2D);
			
			// テクスチャのバインドを無効化
			this.gl.bindTexture(this.gl.TEXTURE_2D, null);
			
			cbFunc(this.texture.length-1,texture_size);
		},false);

		// イメージオブジェクトのソースを指定
		img.src = source;
		// console.log("create_texture",img.src);
	}
}


class PrimitiveModel{
	constructor(glclass){
		this.glclass = glclass;
		this.prg = null;
		this.attLocation = {};
		this.attStride = {};
		this.vPosition  = {};
		this.textureCoord = {};
		this.index = {};
		this.attVBO = {};    
		this.ibo = null;
		
		this.textureObject = null;

		this.scale = [1.0,1.0,1.0];
		this.translate = [0.0,0.0,0.0];

		this.ready = false;
	}

	// いたポリ召喚の儀
	createPlate(vs,fs){
		// - シェーダとプログラムオブジェクトの初期化 ---------------------------------
		
		// 頂点シェーダとフラグメントシェーダの生成
		let vShader = this.create_shader(vs, this.glclass.gl.VERTEX_SHADER);
		let fShader = this.create_shader(fs, this.glclass.gl.FRAGMENT_SHADER);

		// プログラムオブジェクトの生成とリンク
		this.prg = this.create_program(vShader, fShader);

		// - 頂点属性に関する処理 -----------------------------------------------------
		// attributeLocationの取得
		this.attLocation = {};
		this.attLocation[0] = this.glclass.gl.getAttribLocation(this.prg, 'position');
		this.attLocation[1] = this.glclass.gl.getAttribLocation(this.prg, "textureCoord");

		// attributeの要素数
		this.attStride = {};
		this.attStride[0] = 3;
		this.attStride[1] = 2;

		// 板ポリモデル(頂点)データ
		this.vPosition = [
			1.0,   1.0,  0.0,
			1.0,  -1.0,  0.0,
			-1.0,  -1.0,  0.0,
			-1.0,	  1.0,  0.0
		];
		this.textureCoord = [
			1.0,0.0,
			1.0,1.0,
			0.0,1.0,
			0.0,0.0
		];

		// 頂点インデックス
		this.index = [
			0, 2, 1,
			0, 3, 2
		];


		// VBOの生成
		this.attVBO = {};
		this.attVBO[0] = this.create_vbo(this.vPosition);
		this.attVBO[1] = this.create_vbo(this.textureCoord);

		// VBOをバインド
		this.set_attribute(this.attVBO, this.attLocation, this.attStride);

		this.ibo = this.create_ibo(this.index);

		// IBOをバインド
		this.glclass.gl.bindBuffer(this.glclass.gl.ELEMENT_ARRAY_BUFFER, this.ibo);
		
		//uniform初期値
		let uniScale = this.glclass.gl.getUniformLocation(this.prg, "scale");
		this.glclass.gl.uniform4fv(uniScale,[1.0,1.0,1.0,1.0]);

		let uniTranslate = this.glclass.gl.getUniformLocation(this.prg, "translate");
		this.glclass.gl.uniform4fv(uniTranslate,[0.0,0.0,0.0,0.0]);

		this.ready = true;
	}

	setUniform4(uniform,param){
		if(uniform === "scale"){
			this.scale = param;
		}else if(uniform === "translate"){
			this.translate = param;
		}

		if(this.prg){
			this.glclass.gl.useProgram(this.prg)
			let uni = this.glclass.gl.getUniformLocation(this.prg, uniform);

			this.glclass.gl.uniform4fv(uni,param);
		}else{
		}
	}

	setScale(param){
		this.scale = param;

		if(this.prg){
			this.glclass.gl.useProgram(this.prg)
			let uni = this.glclass.gl.getUniformLocation(this.prg, "scale");

			this.glclass.gl.uniform4fv(uni,param);
		}else{
		}
	}

	setTranslate(param){
		this.translate = param;
		if(this.prg){
			this.glclass.gl.useProgram(this.prg)
			let uni = this.glclass.gl.getUniformLocation(this.prg, "translate");

			this.glclass.gl.uniform4fv(uni,param);
		}else{
		}
	}

	/**
	 * シェーダを生成する関数
	 * @param {string} source シェーダのソースとなるテキスト
	 * @param {number} type シェーダのタイプを表す定数 this.gl.VERTEX_SHADER or this.gl.FRAGMENT_SHADER
	 * @return {object} 生成に成功した場合はシェーダオブジェクト、失敗した場合は null
	 */
	create_shader(source, type){
		// シェーダを格納する変数
		let shader;
		
		// シェーダの生成
		shader = this.glclass.gl.createShader(type);
		
		// 生成されたシェーダにソースを割り当てる
		this.glclass.gl.shaderSource(shader, source);
		
		// シェーダをコンパイルする
		this.glclass.gl.compileShader(shader);
		
		// シェーダが正しくコンパイルされたかチェック
		if(this.glclass.gl.getShaderParameter(shader, this.glclass.gl.COMPILE_STATUS)){
			
			// 成功していたらシェーダを返して終了
			return shader;
		}else{
			
			// 失敗していたらエラーログをアラートする
			alert(this.glclass.gl.getShaderInfoLog(shader));
			
			// null を返して終了
			return null;
		}
	}

	/**
	 * プログラムオブジェクトを生成しシェーダをリンクする関数
	 * @param {object} vs 頂点シェーダとして生成したシェーダオブジェクト
	 * @param {object} fs フラグメントシェーダとして生成したシェーダオブジェクト
	 * @return {object} 生成に成功した場合はプログラムオブジェクト、失敗した場合は null
	 */
	create_program(vs, fs){
		// プログラムオブジェクトの生成
		let program = this.glclass.gl.createProgram();
		
		// プログラムオブジェクトにシェーダを割り当てる
		this.glclass.gl.attachShader(program, vs);
		this.glclass.gl.attachShader(program, fs);
		
		// シェーダをリンク
		this.glclass.gl.linkProgram(program);
		
		// シェーダのリンクが正しく行なわれたかチェック
		if(this.glclass.gl.getProgramParameter(program, this.glclass.gl.LINK_STATUS)){
		
			// 成功していたらプログラムオブジェクトを有効にする
			this.glclass.gl.useProgram(program);
			
			// プログラムオブジェクトを返して終了
			return program;
		}else{
			
			// 失敗していたらエラーログをアラートする
			alert(this.glclass.gl.getProgramInfoLog(program));
			
			// null を返して終了
			return null;
		}
	}

	/**
	 * VBOを生成する関数
	 * @param {Array.<number>} data 頂点属性を格納した一次元配列
	 * @return {object} 頂点バッファオブジェクト
	 */
	create_vbo(data){
		// バッファオブジェクトの生成
		let vbo = this.glclass.gl.createBuffer();
		
		// バッファをバインドする
		this.glclass.gl.bindBuffer(this.glclass.gl.ARRAY_BUFFER, vbo);
		
		// バッファにデータをセット
		this.glclass.gl.bufferData(this.glclass.gl.ARRAY_BUFFER, new Float32Array(data), this.glclass.gl.STATIC_DRAW);
		
		// バッファのバインドを無効化
		this.glclass.gl.bindBuffer(this.glclass.gl.ARRAY_BUFFER, null);
		
		// 生成した VBO を返して終了
		return vbo;
	}

	/**
	 * IBOを生成する関数
	 * @param {Array.<number>} data 頂点インデックスを格納した一次元配列
	 * @return {object} インデックスバッファオブジェクト
	 */
	create_ibo(data){
		// バッファオブジェクトの生成
		let ibo = this.glclass.gl.createBuffer();
		
		// バッファをバインドする
		this.glclass.gl.bindBuffer(this.glclass.gl.ELEMENT_ARRAY_BUFFER, ibo);
		
		// バッファにデータをセット
		this.glclass.gl.bufferData(this.glclass.gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), this.glclass.gl.STATIC_DRAW);
		
		// バッファのバインドを無効化
		this.glclass.gl.bindBuffer(this.glclass.gl.ELEMENT_ARRAY_BUFFER, null);
		
		// 生成したIBOを返して終了
		return ibo;
	}

	/**
	 * VBOをバインドし登録する関数
	 * @param {object} vbo 頂点バッファオブジェクト
	 * @param {Array.<number>} attribute location を格納した配列
	 * @param {Array.<number>} アトリビュートのストライドを格納した配列
	 */
	set_attribute(vbo, attL, attS){
		// 引数として受け取った配列を処理する
		// console.log("attL",attL, attS);
		for(let i in vbo){
			// バッファをバインドする
			this.glclass.gl.bindBuffer(this.glclass.gl.ARRAY_BUFFER, vbo[i]);
			
			// attributeLocationを有効にする
			this.glclass.gl.enableVertexAttribArray(attL[i]);
			
			// attributeLocationを通知し登録する
			this.glclass.gl.vertexAttribPointer(attL[i], attS[i], this.glclass.gl.FLOAT, false, 0, 0);
		}
	}
}

class OrthoModel extends PrimitiveModel {
	constructor(glclass){
		super(glclass);
		this.texture_scale = [];
		this.enable = true;
	}

	draw(){
		if(this.enable){
			if(this.ready){
				if(this.prg){
					this.glclass.gl.blendFunc(this.glclass.gl.SRC_ALPHA, this.glclass.gl.ONE_MINUS_SRC_ALPHA);
					this.glclass.gl.enable(this.glclass.gl.BLEND);
					if(this.textureObject){
						this.glclass.gl.useProgram(this.prg);
						this.glclass.gl.activeTexture(this.glclass.gl.TEXTURE0);
						this.glclass.gl.bindTexture(this.glclass.gl.TEXTURE_2D, this.textureObject.texture);
						this.glclass.gl.uniform1i(this.textureObject.uniformLocation,0);
					}
					this.glclass.gl.drawElements(this.glclass.gl.TRIANGLES, this.index.length, this.glclass.gl.UNSIGNED_SHORT, 0);

					this.glclass.gl.bindTexture(this.glclass.gl.TEXTURE_2D, null);
				}
			}
		}
	}

	setPixelScale(width,height){
		this.glclass.gl.useProgram(this.prg)
		let uniScale = this.glclass.gl.getUniformLocation(this.prg, "texture_scale");
		this.texture_scale[0] = (width / this.glclass.c.width);
		this.texture_scale[1] = (height / this.glclass.c.height);
		this.glclass.gl.uniform4fv(uniScale,[this.texture_scale[0],this.texture_scale[1],1.0,1.0]);
	}

	setFillHeightTextureScale(width,height){
		this.glclass.gl.useProgram(this.prg)
		let uniScale = this.glclass.gl.getUniformLocation(this.prg, "texture_scale");
		this.texture_scale[0] = (width / this.glclass.c.width)/(width / this.glclass.c.width);
		this.texture_scale[1] = (height / this.glclass.c.height)/(height / this.glclass.c.height);
		this.glclass.gl.uniform4fv(uniScale,[this.texture_scale[0],this.texture_scale[1],1.0,1.0]);
	}

	setTexture(image,callback){
		this.glclass.create_texture(image,(texNumber,size)=>{
			let textureObject = {};
			textureObject.texture = this.glclass.texture[texNumber];
			textureObject.size = size;
			textureObject.uniformLocation = this.glclass.gl.getUniformLocation(this.prg, "texture");

			this.textureObject = textureObject;
			this.setPixelScale(size.x,size.y);
			callback(size);
		});
	}

	getTouchCollision(mouse,callback){
		if(this.enable){
			let screen_size = {
				x : parseInt(this.glclass.c.style.width),
				y : parseInt(this.glclass.c.style.height)
			}
			let plate = {
				left:-1,
				top:1,
				right:1,
				bottom:-1
			};
			// console.log(mouse)
			plate.left *= this.scale[0] * this.texture_scale[0];
			plate.top *= this.scale[1] * this.texture_scale[1];
			plate.right *= this.scale[0] * this.texture_scale[0];
			plate.bottom *= this.scale[1] * this.texture_scale[1];

			plate.left += this.translate[0];
			plate.top += this.translate[1];
			plate.right += this.translate[0];
			plate.bottom += this.translate[1];


			let normalize_x = (mouse.x - screen_size.x / 2.0) / (screen_size.x / 2.0);
			let normalize_y = (mouse.y - screen_size.y / 2.0) / (screen_size.y / 2.0)* -1;

			// console.log(normalize_x,normalize_y)
			// console.log(plate.left,plate.right,plate.top,plate.bottom)

			/* collision with plate and mouse */
			if( plate.top < normalize_y || plate.bottom > normalize_y || plate.left > normalize_x || plate.right < normalize_x){
			}else{
				callback();
			}
		}
	}
}

class PerspectiveModel extends PrimitiveModel {
	constructor(glclass){
		super(glclass);
		this.mvpMatrix = null;
	}

	draw(){
		if(this.ready){
			if(this.prg){

				let matIV = require("./minMatrixb.js")
				let m = new matIV();
	
				let mMatrix = m.identity(m.create());
				m.scale(mMatrix,this.scale,mMatrix);
				m.translate(mMatrix,this.translate,mMatrix)
				let vMatrix = m.identity(m.create());
				let pMatrix = m.identity(m.create());
				this.mvpMatrix = m.identity(m.create());
				m.lookAt(this.glclass.lookAtParam.eye, this.glclass.lookAtParam.at, this.glclass.lookAtParam.up, vMatrix);
				
				m.perspective(90, this.glclass.c.width / this.glclass.c.height, 0.01, 100, pMatrix);
	
				m.multiply(pMatrix, vMatrix, this.mvpMatrix); // p に v を掛ける
				m.multiply(this.mvpMatrix, mMatrix, this.mvpMatrix);
		
				// uniformLocationの取得
				let uniLocation = this.glclass.gl.getUniformLocation(this.prg, 'mvpMatrix');
				
				this.glclass.gl.useProgram(this.prg);

				// uniformLocationへ座標変換行列を登録
				this.glclass.gl.uniformMatrix4fv(uniLocation, false, this.mvpMatrix);

				if(this.textureObject){
					this.glclass.gl.activeTexture(this.glclass.gl.TEXTURE0);
					this.glclass.gl.bindTexture(this.glclass.gl.TEXTURE_2D, this.textureObject.texture);
					this.glclass.gl.uniform1i(this.textureObject.uniformLocation,0);
				}
				this.glclass.gl.drawElements(this.glclass.gl.TRIANGLES, this.index.length, this.glclass.gl.UNSIGNED_SHORT, 0);

				this.glclass.gl.bindTexture(this.glclass.gl.TEXTURE_2D, null);
			}
		}
	}

	setTexture(image,callback){
		this.glclass.create_texture(image,(texNumber,size)=>{
			let textureObject = {};
			textureObject.texture = this.glclass.texture[texNumber];
			textureObject.size = size;
			textureObject.uniformLocation = this.glclass.gl.getUniformLocation(this.prg, "texture");

			this.textureObject = textureObject;
			callback(size);
		});
	}

	getTouchCollision(mouse,callback){
		// let screen_size = {
		// 	x : this.glclass.c.width,
		// 	y : this.glclass.c.height
		// }

		// let normalize_mouse_x = (mouse.x - screen_size.x / 2.0) / (screen_size.x / 2.0)
		// let normalize_mouse_y = (mouse.y - screen_size.y / 2.0) / (screen_size.y / 2.0)* -1

		// let ray = {
		// 	origin : [normalize_mouse_x,normalize_mouse_y,0.0],
		// 	dir : [0.0,0.0,1.0]
		// }

		// console.log(ray.origin);

		// // http://marupeke296.com/cgi-bin/cbbs/cbbs.cgi?mode=al2&namber=3093&rev=&no=0&P=R&KLOG=3
		// // rayのdirにmvpの逆行列を掛けていくことにする
		// let m = new window.minMatrix.matIV();

		// let mMatrix = m.identity(m.create());
		// let vMatrix = m.identity(m.create());
		// let pMatrix = m.identity(m.create());
		// let invMVP = m.identity(m.create());

		// m.translate(mMatrix, ray.origin, mMatrix);
		// m.lookAt(this.glclass.lookAtParam.eye, this.glclass.lookAtParam.at, this.glclass.lookAtParam.up, vMatrix);
		// m.perspective(90, this.glclass.c.width / this.glclass.c.height, 0.1, 100, pMatrix);

		// m.multiply(m.inverse(mMatrix, m.identity(m.create())), m.inverse(vMatrix, m.identity(m.create())), invMVP);
		// m.multiply(invMVP, m.inverse(pMatrix, m.identity(m.create())), invMVP);

		// console.log("mat",invMVP);//ローカル座標に戻った？
		
		callback();
	}
}

let util = {}
util.WebGLUtil = WebGLUtil;
util.OrthoModel = OrthoModel;
util.PerspectiveModel = PerspectiveModel;

module.exports = util;
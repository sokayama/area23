class HammerSetting {
	constructor(element){
		this.hammer = new Hammer(element);
		
		this.event = null;

		this.isDrag = false;
		this.isPinch = false;

		this.volume = {
			pan : {
				diff : {
					x : 0,
					y : 0
				},
				prev : {
					x : 0,
					y : 0
				}
			},
			pinch : {
				diff : {
					scale : 1
				},
				prev : {
					scale : 1
				}
			}
		}
		
		this.basisPosition = {
			x : 0,
			y : 0
		}
		this.MOVE_PIXCEL = 120; //どれだけ動かしたらコマンドが発行されるか
		this.timerSlowmove = 0;
		this.MOVE_TIMER = 100; //何フレーム経ったら移動積算をリセットするか
	}

	freeMove(unitName,callback){
		let unit = unitName;
		this.hammer.off('swipeleft');
		this.hammer.off('swiperight');
		this.hammer.off('swipeup');
		this.hammer.off('swipedown');
		this.hammer.off('pinch');
		this.hammer.off('pinchend');
		this.hammer.off('pan');
		this.hammer.off('tap');
		this.hammer.on("tap",(e)=>{
			callback(unit,"TAP",e);
		});
		this.hammer.get('pan').set(
			{ threshold: 2.0, pointers: 0}
		);
		this.hammer.get('pinch').set(
			{ enable: true }
		);
		//--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--
		//pan
		this.hammer.on('panstart', (e)=>{
			console.log("panstart",e);
			if(e.maxPointers === 1){
				this.isDrag = true;
			}else{
				// pinchの残り香
			}
		});
		this.hammer.on('pan', (e)=>{
			this.event = e;
			// console.log("pan",e);
			if(this.isDrag) {
				this.volume.pan.diff.x = e.deltaX - this.volume.pan.prev.x;
				this.volume.pan.prev.x = e.deltaX;
				this.volume.pan.diff.y = e.deltaY - this.volume.pan.prev.y;
				this.volume.pan.prev.y = e.deltaY;
			}
			callback(unitName,"PAN",e,this.volume);
		});

		this.hammer.on('panend', (e)=>{
			console.log("panend");
			this.isDrag = false;
			this.isPinch = false;

			this.volume = {
				pan : {
					diff : {
						x : 0,
						y : 0
					},
					prev : {
						x : 0,
						y : 0
					}
				},
				pinch : {
					diff : {
						scale : 1
					},
					prev : {
						scale : 1
					}
				}
			}		
		});
		//pan
		//--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--

		this.hammer.on('pinchstart', (e)=>{
			console.log("pinchstart");
			this.isPinch = true;
		});
		this.hammer.on('pinch', (e)=>{
			this.event = e;
			if(this.isPinch) {
				//console.log("pinch",e);
				this.volume.pinch.diff.scale = e.scale - this.volume.pinch.prev.scale;
				this.volume.pinch.prev.scale = e.scale;
				// console.log(e)
			}
			
			callback(unitName,"PINCH",e,this.volume);
		});
		this.hammer.on('pinchend', (e)=>{
			console.log("pinchend");
			this.isPinch = false;
			this.volume = {
				pan : {
					diff : {
						x : 0,
						y : 0
					},
					prev : {
						x : 0,
						y : 0
					}
				},
				pinch : {
					diff : {
						scale : 1
					},
					prev : {
						scale : 1
					}
				}
			}		
		});
	
	}

	touchpadHammer(unitName,callback){
		this.hammer.off('swipeleft');
		this.hammer.off('swiperight');
		this.hammer.off('swipeup');
		this.hammer.off('swipedown');
		this.hammer.off('pinch');
		this.hammer.off('pinchend');
		this.hammer.off('pan');
		this.hammer.off('tap');
		this.hammer.get('pan').set(
			{ threshold: 2.0, pointers: 0}
		);
		this.hammer.get('pinch').set(
			{ enable: true }
		);
		//--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--
		//pan 一定以上移動時にコマンドを返す
		this.hammer.on('panstart', (e)=>{
			console.log("panstart");
			if(e.maxPointers === 1){
			this.isDrag = true;
			}else{}
		});
		this.hammer.on('pan', (e)=>{
			this.event = e;
			//console.log("pan",e);
			if(this.isDrag) {
				this.volume.pan.diff.x = e.deltaX - this.volume.pan.prev.x;
				this.volume.pan.prev.x = e.deltaX;
				this.volume.pan.diff.y = e.deltaY - this.volume.pan.prev.y;
				this.volume.pan.prev.y = e.deltaY;

				this.basisPosition.x += this.volume.pan.diff.x;
				this.basisPosition.y += this.volume.pan.diff.y;
				if(this.basisPosition.x > this.MOVE_PIXCEL){
						callback(unitName,"RIGHT");
						this.basisPosition.x = 0;
				}
				if(this.basisPosition.x < -this.MOVE_PIXCEL){
						callback(unitName,"LEFT");						
						this.basisPosition.x = 0;
					}
				if(this.basisPosition.y > this.MOVE_PIXCEL){
						callback(unitName,"DOWN");						
						this.basisPosition.y = 0;									
					}
				if(this.basisPosition.y < -this.MOVE_PIXCEL){
						callback(unitName,"UP");						
						this.basisPosition.y = 0;									
					}

			}
			callback(unitName,"PAN",this.volume);
		});

		this.hammer.on('panend', (e)=>{
			console.log("panend");
			this.isDrag = false;
			this.isPinch = false;

			this.volume = {
				pan : {
					diff : {
						x : 0,
						y : 0
					},
					prev : {
						x : 0,
						y : 0
					}
				},
				pinch : {
					diff : {
						scale : 1
					},
					prev : {
						scale : 1
					}
				}
			}		
		});
		//pan
		//--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--

		this.hammer.on('pinchstart', (e)=>{
			console.log("pinchstart");
			this.isPinch = true;
		});
		this.hammer.on('pinch', (e)=>{
			this.event = e;
			if(this.isPinch) {
				//console.log("pinch",e);
				this.volume.pinch.diff.scale = e.scale - this.volume.pinch.prev.scale;
				this.volume.pinch.prev.scale = e.scale;
				// console.log(e)
			}
			
			callback(unitName,"PINCH",this.volume);
		});
		this.hammer.on('pinchend', (e)=>{
			console.log("pinchend");
			this.isPinch = false;
			this.volume = {
				pan : {
					diff : {
						x : 0,
						y : 0
					},
					prev : {
						x : 0,
						y : 0
					}
				},
				pinch : {
					diff : {
						scale : 1
					},
					prev : {
						scale : 1
					}
				}
			}		
		});


		this.hammer.on('tap', (e)=>{
			this.event = e;
			//console.log("tap",e);
			callback(unitName,"TAP");
		});
	}

	timerFunc(){
		if(this.basisPosition.x !== 0 || this.basisPosition.y !== 0){
			this.timerSlowmove++;
		}else{
			this.timerSlowmove = 0;
		}

		if(this.timerSlowmove > this.MOVE_TIMER){
			// this.timerSlowmove = 0;
			// this.basisPosition.x = 0;
			// this.basisPosition.y = 0;
			// console.log("[hammerSetting]Slow Reset");
		}
		
		if(this.basisPosition.x > this.MOVE_PIXCEL
			|| this.basisPosition.x < -this.MOVE_PIXCEL
			|| this.basisPosition.y > this.MOVE_PIXCEL
			|| this.basisPosition.y < -this.MOVE_PIXCEL){
			this.timerSlowmove = 0;
			console.log("[hammerSetting]Move Reset");
		}
		if(!this.isDrag){
			this.basisPosition.x = 0;
			this.basisPosition.y = 0;
		}
	}

}
module.exports = HammerSetting;
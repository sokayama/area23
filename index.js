(()=>{
    "use strict";
    const EXPRESS_PORT = process.env.PORT || 8080;;
    let path = require("path");


    console.log("init");
	let express = require("express");

    let app = express();
	app.use("/",express.static("./public"));
	app.use("/web_image",express.static("./Assets/web_image"));
	app.listen(EXPRESS_PORT,()=>{
		console.log("Express listening on " + EXPRESS_PORT);
	});

    console.log("",path.join(__dirname, "server/area23server"))

    let Area23 = require(path.join(__dirname, "server/area23server"));
    let area23 = new Area23();

})();

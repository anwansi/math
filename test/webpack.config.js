const path = require("path");

module.exports = {
    mode : "development",
    // context : path.resolve(__dirname),
    resolve : {
	//        extensions : [".js"],
        alias : {
            "@" : path.resolve(__dirname, '..')
	}
    },
    //    target : "node",
    //    externals : []
}
const fs = require("fs");
// const tar = require("tar");

async function run() {
  fs.readdir("./encoded", function (err, files) {
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }
    files.forEach(async function (file) {
      const fileData = fs.readFileSync("./encoded/" + file, "utf8");
      fs.writeFile(
        "./decoded/" + file,
        fileData,
        { encoding: "base64" },
        function (err) {
          console.log(`Decoded ${file} successfully`);
        }
      );
      // TODO add compression
      // console.log(file)
      // const res = await tar.x({ file: "./decoded/" + file });
      // console.log(res);
    });
  });
}

run();

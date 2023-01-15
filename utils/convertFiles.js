const fs = require("fs");

fs.readdir("./encoded", function (err, files) {
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }
  files.forEach(function (file) {
    const fileData = fs.readFileSync("./encoded/" + file, "utf8");
    fs.writeFile(
      "./decoded/" + file,
      fileData,
      { encoding: "base64" },
      function (err) {
        console.log(`Decoded ${file} successfully`);
      }
    );
  });
});

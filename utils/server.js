const dgram = require("dgram");
const server = dgram.createSocket("udp4");
const dnsPacket = require("dns-packet");
const fs = require("fs");
const UDP_IP = "0.0.0.0";
const UDP_PORT = 53;

const FilenameRegex = /(\S+)\.fsub\.secureforest\.com/; // Filename
const DataRegex = /(\S+)\.dsub\.secureforest\.com/; // Data Payload

let fileName = "./encoded/untagged.txt";

server.bind(UDP_PORT, UDP_IP);
console.log('Server listening on UDP port ' + UDP_PORT)

function createReplyBuffer(id, name, reply) {
  try {
    return dnsPacket.encode({
      type: "response",
      id,
      answers: [
        {
          type: "A",
          class: "IN",
          name,
          ttl: 300,
          data: reply,
        },
      ],
    });
  } catch (e) {
    console.log(e);
  }
}

function decodeBase64(data) {
  try {
    let buff = new Buffer.from(data, "base64");
    let text = buff.toString("ascii");
    return text;
  } catch (e) {
    console.log(e);
  }
}

server.on("message", (msg, rinfo) => {
  try {
    // console.log(rinfo)
    const dnsData = dnsPacket.decode(msg); // console.log(dnsData)
    const dnsName = dnsData.questions[0].name;
    const matchData = DataRegex.exec(dnsName);
    const matchFilename = FilenameRegex.exec(dnsName);
    if (matchFilename) {
      const decoded = decodeBase64(`${matchFilename[1]}=`);
      fileName = decoded.replace(/\n/g, "");
      console.log(`Receiving new file: ${fileName}`);
      fs.writeFileSync(`./encoded/${fileName}`, "");
      const buf = createReplyBuffer(dnsData.id, dnsName, "8.8.8.8");
      server.send(buf, rinfo.port, rinfo.address);
    }
    if (matchData) {
      fs.appendFileSync(`./encoded/${fileName}`, matchData[1]); //
      const buf = createReplyBuffer(dnsData.id, dnsName, "8.8.8.8");
      server.send(buf, rinfo.port, rinfo.address);
    }
  } catch (e) {
    console.log(e);
    const buf = createReplyBuffer("8.8.4.4");
    server.send(buf, rinfo.port, rinfo.address);
  }
});

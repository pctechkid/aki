module.exports.config = {
    name: "anibanner",
    version: "1.0.2",
    hasPermission: 0,
    credits: "Aki Hayakawa",
    usePrefix: true,
    description: "Create a cool anime banner",
    commandCategory: "Image Generation",
    usages: "Character ID | Name | Signature | Facebook",
    cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
    const text1 = args.join(" ").trim().replace(/\s+/g, " ").replace(/(\s+\|)/g, "|").replace(/\|\s+/g, "|").split("|")[0] || "21";
    const text2 = args.join(" ").trim().replace(/\s+/g, " ").replace(/(\s+\|)/g, "|").replace(/\|\s+/g, "|").split("|")[1] || "";
    const text3 = args.join(" ").trim().replace(/\s+/g, " ").replace(/(\s+\|)/g, "|").replace(/\|\s+/g, "|").split("|")[2] || "";
    const text4 = args.join(" ").trim().replace(/\s+/g, " ").replace(/(\s+\|)/g, "|").replace(/\|\s+/g, "|").split("|")[3] || "";
    const { loadImage, createCanvas } = require("canvas");
    const fs = require('fs');
    const request = require('request');
    const path = require('path');
    const axios = require('axios');
    const lengthchar = (await axios.get('https://run.mocky.io/v3/fc1cc59c-2603-4d27-ae05-0d29d372d53a')).data;
    const Canvas = require('canvas');

    let pathImg = __dirname + `/tad/avatar_1.png`;
    let pathAva = __dirname + `/tad/avatar_2.png`;

    let avtAnime = (
        await axios.get(encodeURI(`${lengthchar[text1 - 1].imgAnime}`), { responseType: "arraybuffer" })
    ).data;

    fs.writeFileSync(pathAva, Buffer.from(avtAnime, "utf-8"));

    let background = (
        await axios.get(encodeURI(`https://imgur.com/Ch778s2.png`), { responseType: "arraybuffer" })
    ).data;

    fs.writeFileSync(pathImg, Buffer.from(background, "utf-8"));

    if (!fs.existsSync(__dirname + `/tad/PastiOblique-7B0wK.otf`)) {
        let getFont2 = (
            await axios.get(`https://github.com/kenyrm2250/font/raw/main/PastiOblique-7B0wK.otf`, { responseType: "arraybuffer" })
        ).data;
        fs.writeFileSync(__dirname + `/tad/PastiOblique-7B0wK.otf`, Buffer.from(getFont2, "utf-8"));
    };

    if (!fs.existsSync(__dirname + `/tad/gantellinesignature-bw11b.ttf`)) {
        let getFont3 = (
            await axios.get(`https://github.com/kenyrm2250/font/raw/main/gantellinesignature-bw11b.ttf`, { responseType: "arraybuffer" })
        ).data;
        fs.writeFileSync(__dirname + `/tad/gantellinesignature-bw11b.ttf`, Buffer.from(getFont3, "utf-8"));
    };

    let a = await loadImage(pathImg);
    let ab = await loadImage(pathAva);
    let canvas = createCanvas(a.width, a.height);
    let ctx = canvas.getContext("2d");

    ctx.fillStyle = "#e6b030";
    ctx.drawImage(a, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(ab, 1500, -400, 1980, 1980);
    ctx.textAlign = "start";

    Canvas.registerFont(__dirname + `/tad/PastiOblique-7B0wK.otf`, {
        family: "PastiOblique-7B0wK"
    });

    ctx.fillStyle = "#33f5f2";
    ctx.font = "340px PastiOblique-7B0wK";
    ctx.fillText(text2, 500, 750);
    ctx.textAlign = "start";

    Canvas.registerFont(__dirname + `/tad/gantellinesignature-bw11b.ttf`, {
        family: "gantellinesignature-bw11b"
    });

    ctx.fillStyle = "#fff";
    ctx.font = "185px gantellinesignature-bw11b";
    ctx.fillText(text3, 500, 680);
    ctx.save();
    ctx.textAlign = "end";
    ctx.fillStyle = "#f56236";
    ctx.font = "50px PastiOblique-7B0wK";
    ctx.fillText(text4, 2000, 850);
    ctx.textAlign = "start";

    ctx.beginPath();
    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);

    return api.sendMessage({
        body: `Anime banner created successfully!\nCharacter ID: ${text1}\nMain Name: ${text2}\nSignature: ${text3}\nFacebook: ${text4}`,
        attachment: fs.createReadStream(pathImg)
    },
        event.threadID,
        () => {
            fs.unlinkSync(pathImg);
            fs.unlinkSync(pathAva);
        },
        event.messageID
    );
}

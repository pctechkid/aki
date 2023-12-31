module.exports.config = {
    name: "autoreact",
    version: "1.1.1",
    hasPermission: 0,
    credits: "Aki Hayakawa",
    description: "Bot Auto React",
    usePrefix: false,
    commandCategory: "system",
    cooldowns: 0,
};
module.exports.handleEvent = function({
    api,
    event,
    client,
    __GLOBAL
}) {
    if (!event.body) {
        return; // Return early if event body is undefined or empty
    }
    let react = event.body.toLowerCase();
    let reactHaha = ["😄", "😆", "😂", "🤣", "😸", "😹"]
    let reactSad = ["🥲", "😭", "😢", "😿"]
    let reactHeart = ["❤️", "🧡", "💛", "💚", "💙", "💜", "💗", "😍", "💝", "💖"]
    if (react.startsWith(`${global.config.PREFIX}`)) {
        return api.setMessageReaction(`👍`, event.messageID); // React a 👍 for commands
    }
    if (react.includes("aki")) return api.setMessageReaction(`😍`, event.messageID, (err) => {}, true);
    if (react.includes("ah") || react.includes("ha") || react.includes("hs") || react.includes("sh") || react.includes("wah") || react.includes("bobo") || react.includes("bubu") || react.includes("vovo") || react.includes("vuvu") || react.includes("wala") || react.includes("wla") || react.includes("zero") || react.includes("kalbo") || react.includes("gago") || react.includes("gagu") || react.includes("gagi") || react.includes("ogag") || react.includes("gaga") || react.includes("tanga") || react.includes("mama mo") || react.includes("lol") || react.includes("xd") || react.includes("lmao") || react.includes("happy") || react.includes("tawa") || react.includes("takte") || react.includes("umay") || react.includes("umai") || react.includes("hays") || react.includes("😄") || react.includes("😁") || react.includes("😆") || react.includes("😅") || react.includes("😂") || react.includes("🤣") || react.includes("😸") || react.includes("😹") || react.includes("yawa") || react.includes("pota") || react.includes("puta") || react.includes("tang") || react.includes("ampt") || react.includes("amp") || react.includes("joke") || react.includes("biro") || react.includes("kidding") || react.includes("funny") || react.includes("saya") || react.includes("awit") || react.includes("baog") || react.includes("oten") || react.includes("titi") || react.includes("tt") || react.includes("tete") || react.includes("bastos") || react.includes("manyak") || react.includes("fbi") || react.includes("bobu") || react.includes("bubo")) return api.setMessageReaction(reactHaha[Math.floor(Math.random() * reactHaha.length)], event.messageID, (err) => {}, true);
    if (react.includes("sad") || react.includes("aguy") || react.includes("agoi") || react.includes("poghati") || react.includes("pain") || react.includes("sakit") || react.includes("iyak") || react.includes("broken") || react.includes("patay") || react.includes("dead") || react.includes("hu") || react.includes("cry") || react.includes("🥲") || react.includes("😭") || react.includes("😢") || react.includes("😿") || react.includes("condolences") || react.includes("break") || react.includes("aray") || react.includes("aw") || react.includes("ouch") || react.includes("hurt") || react.includes("luha") || react.includes("rip") || react.includes("agay") || react.includes("agoy") || react.includes("hiwalay")) return api.setMessageReaction(reactSad[Math.floor(Math.random() * reactSad.length)], event.messageID, (err) => {}, true);
    if (react.includes("bruh") || react.includes("rip") || react.includes("huh") || react.includes("💀")) return api.setMessageReaction(`💀`, event.messageID, (err) => {}, true);
    if (react.includes("love") || react.includes("luv") || react.includes("sweet") || react.includes("babe") || react.includes("baby") || react.includes("bebe") || react.includes("bibi") || react.includes("mwa") || react.includes("kiss") || react.includes("😘") || react.includes("🥰") || react.includes("😍") || react.includes("❤️") || react.includes("🧡") || react.includes("💛") || react.includes("💚") || react.includes("💙") || react.includes("💜") || react.includes("🤎") || react.includes("🖤") || react.includes("🤍") || react.includes("♥️") || react.includes("💘") || react.includes("💝") || react.includes("💖") || react.includes("💗") || react.includes("💓") || react.includes("💞") || react.includes("💕") || react.includes("💌") || react.includes("💟") || react.includes("❣️") || react.includes("💋") || react.includes("miss") || react.includes("thank") || react.includes("welcome") || react.includes("salamat") || react.includes("arigato") || react.includes("ganda") || react.includes("beautiful") || react.includes("beauty")) return api.setMessageReaction(reactHeart[Math.floor(Math.random() * reactHeart.length)], event.messageID, (err) => {}, true);
    if (react.includes("sana all") || react.includes("sana lahat") || react.includes("sanaol") || react.includes("sanaul") || react.includes("naul") || react.includes("chinall") || react.includes("china all") || react.includes("chinaall") || react.includes("china oil") || react.includes("chinaoil") || react.includes("naol") || react.includes("sana tanan") || react.includes("tani tanan") || react.includes("( 2 )") || react.includes("sàna all") || react.includes("nàol")) return api.setMessageReaction("2️⃣", event.messageID, (err) => {}, true);
    if (react.includes("woman") || react.includes("babae") || react.includes("girl") || react.includes("gurl") || react.includes("women") || react.includes("eabab") || react.includes("☕")) return api.setMessageReaction("☕", event.messageID, (err) => {}, true);
    if (react.includes("woah") || react.includes("wow") || react.includes("nice") || react.includes("noice") || react.includes("amazing")) return api.setMessageReaction("🎆", event.messageID, (err) => {}, true);
    if (react.includes("fire") || react.includes("🔥") || react.includes("hot")) return api.setMessageReaction("🔥", event.messageID, (err) => {}, true);
    if (react.includes("damn") || react.includes("sigma") || react.includes("shes") || react.includes("🗿") || react.includes("respect")) return api.setMessageReaction("🗿", event.messageID, (err) => {}, true);
    if (react.includes("cold") || react.includes("🥶") || react.includes("lamig")) return api.setMessageReaction("🥶", event.messageID, (err) => {}, true);
    if (react.includes("bye") || react.includes("see you") || react.includes("night") || react.includes("dream")) return api.setMessageReaction("👋", event.messageID, (err) => {}, true);
    if (react.includes("bot") || react.includes("ai") || react.includes("creator") || react.includes("🤖") || react.includes("developer")) return api.setMessageReaction("🤖", event.messageID, (err) => {}, true);
    if (react.includes("ih") || react.includes("eh") || react.includes("cute") || react.includes("kawaii") || react.includes("sexy") || react.includes("owo") || react.includes("uwu") || react.includes("owu") || react.includes("uwo") || react.includes(":3") || react.includes(":>") || react.includes("please") || react.includes("🥹")) return api.setMessageReaction("🥺", event.messageID, (err) => {}, true);
    if (react.includes("pervert") || react.includes("hentai") || react.includes("perv") || react.includes("ero") || react.includes("ew") || react.includes("yuck") || react.includes("yack") || react.includes("iw") || react.includes("😼")) return api.setMessageReaction("😼", event.messageID, (err) => {}, true);
};
module.exports.run = function({
    api,
    event,
    client,
    __GLOBAL
}) {}
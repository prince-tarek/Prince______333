const axios = require('axios');
const baseApiUrl = async () => {
 return "https://www.noobs-api.rf.gd/dipto";
};

module.exports.config = {
 name: "bby",
 aliases: ["baby", "bbe", "bot", "fahad", "babe"],
 version: "6.9.0",
 author: "Chitron Bhattacharjee",
 countDown: 0,
 role: 0,
 description: "better then all sim simi",
 category: "𝗔𝗜 & 𝗚𝗣𝗧",
 guide: {
 en: "{pn} [anyMessage] OR\nteach [YourMessage] - [Reply1], [Reply2], [Reply3]... OR\nteach [react] [YourMessage] - [react1], [react2], [react3]... OR\nremove [YourMessage] OR\nrm [YourMessage] - [indexNumber] OR\nmsg [YourMessage] OR\nlist OR \nall OR\nedit [YourMessage] - [NeeMessage]"
 }
};

module.exports.onStart = async ({
 api,
 event,
 args,
 usersData
}) => {
 const link = `${await baseApiUrl()}/baby`;
 const dipto = args.join(" ").toLowerCase();
 const uid = event.senderID;
 let command, comd, final;

 try {
 if (!args[0]) {
 const ran = ["Bolo baby", "hum", "type help baby", "type +baby hi"];
 return api.sendMessage(ran[Math.floor(Math.random() * ran.length)], event.threadID, event.messageID);
 }

 if (args[0] === 'remove') {
 const fina = dipto.replace("remove ", "");
 const dat = (await axios.get(`${link}?remove=${fina}&senderID=${uid}`)).data.message;
 return api.sendMessage(dat, event.threadID, event.messageID);
 }

 if (args[0] === 'rm' && dipto.includes('-')) {
 const [fi, f] = dipto.replace("rm ", "").split(' - ');
 const da = (await axios.get(`${link}?remove=${fi}&index=${f}`)).data.message;
 return api.sendMessage(da, event.threadID, event.messageID);
 }

 if (args[0] === 'list') {
 if (args[1] === 'all') {
 const data = (await axios.get(`${link}?list=all`)).data;
 const teachers = await Promise.all(data.teacher.teacherList.map(async (item) => {
 const number = Object.keys(item)[0];
 const value = item[number];
 const name = (await usersData.get(number)).name;
 return {
 name,
 value
 };
 }));
 teachers.sort((a, b) => b.value - a.value);
 const output = teachers.map((t, i) => `${i + 1}/ ${t.name}: ${t.value}`).join('\n');
 return api.sendMessage(`Total Teach = ${data.length}\n👑 | List of Teachers of baby\n${output}`, event.threadID, event.messageID);
 } else {
 const d = (await axios.get(`${link}?list=all`)).data.length;
 return api.sendMessage(`Total Teach = ${d}`, event.threadID, event.messageID);
 }
 }

 if (args[0] === 'msg') {
 const fuk = dipto.replace("msg ", "");
 const d = (await axios.get(`${link}?list=${fuk}`)).data.data;
 return api.sendMessage(`Message ${fuk} = ${d}`, event.threadID, event.messageID);
 }

 if (args[0] === 'edit') {
 const command = dipto.split(' - ')[1];
 if (command.length < 2) return api.sendMessage('❌ | Invalid format! Use edit [YourMessage] - [NewReply]', event.threadID, event.messageID);
 const dA = (await axios.get(`${link}?edit=${args[1]}&replace=${command}&senderID=${uid}`)).data.message;
 return api.sendMessage(`changed ${dA}`, event.threadID, event.messageID);
 }

 if (args[0] === 'teach' && args[1] !== 'amar' && args[1] !== 'react') {
 [comd, command] = dipto.split(' - ');
 final = comd.replace("teach ", "");
 if (command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
 const re = await axios.get(`${link}?teach=${final}&reply=${command}&senderID=${uid}`);
 const tex = re.data.message;
 const teacher = (await usersData.get(re.data.teacher)).name;
 return api.sendMessage(`✅ Replies added ${tex}\nTeacher: ${teacher}\nTeachs: ${re.data.teachs}`, event.threadID, event.messageID);
 }

 if (args[0] === 'teach' && args[1] === 'amar') {
 [comd, command] = dipto.split(' - ');
 final = comd.replace("teach ", "");
 if (command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
 const tex = (await axios.get(`${link}?teach=${final}&senderID=${uid}&reply=${command}&key=intro`)).data.message;
 return api.sendMessage(`✅ Replies added ${tex}`, event.threadID, event.messageID);
 }

 if (args[0] === 'teach' && args[1] === 'react') {
 [comd, command] = dipto.split(' - ');
 final = comd.replace("teach react ", "");
 if (command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
 const tex = (await axios.get(`${link}?teach=${final}&react=${command}`)).data.message;
 return api.sendMessage(`✅ Replies added ${tex}`, event.threadID, event.messageID);
 }

 if (dipto.includes('amar name ki') || dipto.includes('amr nam ki') || dipto.includes('amar nam ki') || dipto.includes('amr name ki') || dipto.includes('whats my name')) {
 const data = (await axios.get(`${link}?text=amar name ki&senderID=${uid}&key=intro`)).data.reply;
 return api.sendMessage(data, event.threadID, event.messageID);
 }

 const d = (await axios.get(`${link}?text=${dipto}&senderID=${uid}&font=1`)).data.reply;
 api.sendMessage(d, event.threadID, (error, info) => {
 global.GoatBot.onReply.set(info.messageID, {
 commandName: this.config.name,
 type: "reply",
 messageID: info.messageID,
 author: event.senderID,
 d,
 apiUrl: link
 });
 }, event.messageID);

 } catch (e) {
 console.log(e);
 api.sendMessage("Check console for error", event.threadID, event.messageID);
 }
};

module.exports.onReply = async ({
 api,
 event,
 Reply
}) => {
 try {
 if (event.type == "message_reply") {
 const a = (await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(event.body?.toLowerCase())}&senderID=${event.senderID}&font=1`)).data.reply;
 await api.sendMessage(a, event.threadID, (error, info) => {
 global.GoatBot.onReply.set(info.messageID, {
 commandName: this.config.name,
 type: "reply",
 messageID: info.messageID,
 author: event.senderID,
 a
 });
 }, event.messageID);
 }
 } catch (err) {
 return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
 }
};

module.exports.onChat = async ({
 api,
 event,
 message
}) => {
 try {
 const body = event.body ? event.body?.toLowerCase() : ""
 if (body.startsWith("baby") || body.startsWith("bby") || body.startsWith("বেবি") || body.startsWith("bot") || body.startsWith("fahad") || body.startsWith("babu") || body.startsWith("বট")) {
 const arr = body.replace(/^\S+\s*/, "")
 const randomReplies = [
"I love you " , "এ বেডা তোগো GC এর C E O জয় কই" , "তোর বাড়ি কি উগান্ডা এখানে হুম" , "Bot না জানু,বল " , "বলো জানু " , "তোর কি চোখে পড়ে না আমি ইমরান বস এর সাথে ব্যাস্ত আসি" , "amr Jan lagbe,Tumi ki single aso?" , " BF" ,"babu khuda lagse" , "Hop beda,Boss বল boss" , "আমাকে ডাকলে ,আমি কিন্তূ কিস করে দেবো" , "bye" , "naw message daw  https://www.facebook.com/sparsahina.anubhuti.37757" , "mb ney bye" , "meww" , "বলো কি বলবা, সবার সামনে বলবা নাকি?" , "গোসল করে আসো যাও" , "আসসালামুওয়ালাইকুম" , "কেমন আসো" , "বলেন sir" , "বলেন ম্যাডাম" , "আমি অন্যের জিনিসের সাথে কথা বলি নাওকে" , "এটায় দেখার বাকি সিলো_" , " না জানু, বল " , "বেশি Bot Bot করলে leave নিবো কিন্তু " , "বেশি বেবি বললে কামুর দিমু " , "bolo baby" , "তোর কথা তোর বাড়ি কেউ শুনে না ,তো আমি কোনো শুনবো ?" , "আমি তো অন্ধ কিছু দেখি না " , "আম গাছে আম নাই ঢিল কেন মারো, তোমার সাথে প্রেম নাই বেবি কেন ডাকো " , " ঘুমানোর আগে.! তোমার মনটা কথায় রেখে ঘুমাও.!_নাহ মানে চুরি করতাম " , " না বলে  বলো " , "দূরে যা, তোর কোনো কাজ নাই, শুধু   করিস  " , "এই এই তোর পরীক্ষা কবে? শুধু   করিস " , "তোরা যে হারে  ডাকছিস আমি তো সত্যি বাচ্চা হয়ে যাবো_☹" , "আজব তো__" , "আমাকে ডেকো না,আমি ব্যাস্ত আসি‍♀️" , " বললে চাকরি থাকবে না" , "  না করে আমার বস ইমরান এর লগে প্রেম করতে পারো?" , "আমার সোনার বাংলা, তারপরে লাইন কি? " , " এই নাও জুস খাও..! বলতে বলতে হাপায় গেছো না " , "হটাৎ আমাকে মনে পড়লো " , " বলে অসম্মান করচ্ছিছ," , "আমি তোমার সিনিয়র ভাইয়া ওকে সম্মান দেও"
, "খাওয়া দাওয়া করসো " , "এত কাছেও এসো না,প্রেম এ পরে যাবো তো " , "আরে আমি মজা করার mood এ নাই" , "  বলো " , "আরে Bolo আমার জান, কেমন আসো? " , "একটা BF খুঁজে দাও " , "ফ্রেন্ড রিকোয়েস্ট দিলে ৫ টাকা দিবো " , "oi mama ar dakis na pilis " ,  "__ভালো হয়ে  যাও " , "এমবি কিনে দাও না_" , "ওই মামা_আর ডাকিস না প্লিজ" , "৩২ তারিখ আমার বিয়ে " , "হা বলো,কি করতে পারি?" , "বলো ফুলটুশি_" , "amr JaNu lagbe,Tumi ki single aso?" , "আমাকে না দেকে একটু পড়তেও বসতে তো পারো " ,  "তোর বিয়ে হয় নি  বেবি ,হইলো কিভাবে,," ,"আজ একটা ফোন নাই বলে রিপ্লাই দিতে পারলাম না_" , "চৌধুরী সাহেব আমি গরিব হতে পারি -কিন্তু বড়লোক না " , "আমি অন্যের জিনিসের সাথে কথা বলি না__ওকে",
"বলো কি বলবা, সবার সামনে বলবা নাকি?" , "ভুলে জাও আমাকে " , "দেখা হলে কাঠগোলাপ দিও.." , "শুনবো না তুমি আমাকে প্রেম করাই দাও নি পচা তুমি" , "আগে একটা গান বলো, ☹ নাহলে কথা বলবো না " , "বলো কি করতে পারি তোমার জন্য " , "কথা দেও আমাকে পটাবা...!! " , "বার বার Disturb করেছিস কোনো , আমার জানু এর সাথে ব্যাস্ত আসি " , "আমাকে না দেকে একটু পড়তে বসতেও তো পারো " , "বার বার ডাকলে মাথা গরম হয় কিন্তু ",
"ওই তুমি single না? " , "বলো জানু " , "Meow" ,  "আর কত বার ডাকবা ,শুনছি তো ‍♀️",
"কি হলো, মিস টিস করচ্ছো নাকি " ,  "Bolo Babu, তুমি কি আমাকে ভালোবাসো? " ,  "আজকে আমার মন ভালো নেই " , " আমরা দারুণ রকমের দুঃখ সাজাই প্রবল ভালোবেসে..!" , "- আমি যখন একটু খুশি হওয়ার চেষ্টা করি, তখন দুঃখ এসে আবার আমাকে আঁকড়ে ধরে " , " °°অনুভূতি প্রকাশ করতে নেই মানুষ নাটক মনে করে মজা নেয়°..! " ,  " কিছু মানুষ স্বল্প সময়ের জন্য আমাদের জীবনে আসে।কিন্তু দীর্ঘ সময় স্মৃতি রেখে যায়..!" , "য়ামরা কি ভন্দু হতে পারিহ?? নাহ্লে তার থেকে বেসি কিচু??" , "তোর সাথে কথা নাই কারণ তুই অনেক লুচ্চা" , " এইখানে লুচ্চামি করলে লাথি দিবো কিন্তু" , "আমাকে চুমু দিবি " , "হেহে বাবু আমার কাছে আসো " , "আমি তোমাকে অনেক ভালোবাসি বাবু" , " বট এর help list dekhte type koron %2help" , "কিরে বলদ তুই এইখানে " , " আমাকেD চিনো না জানু? মনু" , "hey bbe I'm your personal Based chatbot you ask me anything" , "AR asbo na tor kache" , "আমাকে ডাকলে ,আমি কিন্তু  করে দিবো " , "Hop beda dakos kn" , "-তাবিজ কইরা হইলেও ফ্রেম এক্কান করমুই তাতে যা হই হোক-" , " ওই মামী আর ডাকিস না প্লিজ" , " হ্যা বলো, শুনছি আমি" , "বলো কি করতে পারি তোমার জন্য " , " না জানু,বলো কারন আমি সিংগেল  " , " I love you tuna" , "Tuma dew xanu " , " এত কাছেও এসো না,প্রেম এ পরে যাবো তো ",
" দেখা হলে কাঠগোলাপ দিও.." , " 	__ " , "•-কিরে তরা নাকি  prem করস..•আমারে একটা করাই দিলে কি হয়- " , "Bolo Babu, তুমি কি আমাকে ভালোবাসো?  " , "Single taka ki oporad " , " Premer mora jole duve na",
"Ufff matha gorom kore disos " , "Boss ayan er chipay " , "bashi dakle boss  joy ke bole dimu " , "Xhipay atke gaci jan " , "Washroom a " , "bado maser kawwa police amar sawwa " , "I am single plz distrab me " , " এই নাও জুস খাও..! বলতে বলতে হাপায় গেছো না  " , " আমাকে ডাকলে ,আমি কিন্তু  করে দিবো " , "Tapraiya dat falai demu " , "Hebolo amar jan kmn aso " , "Hmmm jan ummmmmmah " , "Chup kor ato bot bot koros kn " , "Yes sir/mem " , "Assalamualikum☺️ ",
"Walaikumsalam " , "Chaiya takos kn ki kobi kooo☹️ " , "Onek boro beyadop re tui ",
  "😏 Tui bollei mon gulo fuler moto fute uthe",
  "😉 Ei raat e tumi aar ami... kichu ekta spicy hobe naki?",
  "💋 Tor voice ta amar heart-er ringtone hote pare!",
  "😼 Dekhlei tor chokh e chemistry lage... physics nai?",
  "😇 Bujhlam, tui flirt kora sikhli amar theke!",
  "🥀 Tui jodi chash hoye jash, ami tor ghum bhenge debo...",
  "👀 Toke dekhe mon chay... daily dekhi!",
  "🥺amake na deke amr boss ar inbox a nok deo my boss inbox https://www.facebook.com/sparsahina.anubhuti.37757",
  "my owner inbox link https://www.facebook.com/sparsahina.anubhuti.37757","Bolo baby 💬", "হুম? বলো 🍓", "হ্যাঁ জানু 😚", "শুনছি বেবি 😘", "এতো ডেকো না,প্রেম এ পরে যাবো তো🙈", "Boss বল boss😼", "আমাকে ডাকলে ,আমি কিন্তু কিস করে দিবো😘", "দূরে যা, তোর কোনো কাজ নাই, শুধু bot bot করিস 😉😋🤣", "jang hanga korba😒😬", "আমাকে না ডেকে আমার বস জয় কে একটা জি এফ দাও-😽🫶🌺", "মাইয়া হলে চিপায় আসো 🙈😘", "-𝙂𝙖𝙮𝙚𝙨-🤗-যৌবনের কসম দিয়ে আমাকে 𝐁𝐥𝐚𝐜𝐤𝐦𝐚𝐢𝐥 করাছে-🥲🤦‍♂️🤧", "-আমার গল্পে তোমার নানি সেরা-🙊🙆‍♂️", "বট বট করিস না তো 😑,মেয়ে হলে আমার বসের ইনবক্স এ গিয়ে উম্মা দিয়ে আসো , এই নাও বসের ইনবক্স লিংক https://www.facebook.com/sparsahina.anubhuti.37757", "এত ডাকাডাকি না করে মুড়ির সাথে গাঞ্জা মিশাইয়া খাইয়া মরে যা", "—যে ছেড়ে গেছে-😔-তাকে ভুলে যাও-🙂-আমার বস জয় এর সাথে প্রেম করে তাকে দেখিয়ে দাও-🙈🐸", "সুন্দর মাইয়া মানেই-🥱আমার বস জয়' এর বউ-😽🫶আর বাকি গুলো আমার বেয়াইন-🙈🐸", "-𝗜 𝗟𝗢𝗩𝗢 𝗬𝗢𝗨-😽-আহারে ভাবছো তোমারে প্রোপজ করছি-🥴-থাপ্পর দিয়া কিডনী লক করে দিব-😒-ভুল পড়া বের করে দিবো-🤭🐸", "-হুদাই গ্রুপে আছি-🥺🐸-কেও ইনবক্সে নক দিয়ে বলে না জান তোমারে আমি অনেক ভালোবাসি-🥺🤧", "আজ থেকে আর কাউকে পাত্তা দিমু না -!😏-কারণ আমি ফর্সা হওয়ার ক্রিম কিনছি -!🙂🐸", "তোগো গ্রুপের এডমিন রাতে বিছানায় মুতে🤧🤓", "দূরে যা, তোর কোনো কোনো কাজ নাই, শুধু bot bot করিস 😾😒🤳🏻", "অনুমতি দিলে 𝚈𝚘𝚞𝚃𝚞𝚋𝚎-এ কল দিতাম..!😒", "ওই কিরে গ্রুপে দেখি সব বুইড়া বুইড়া বেডি 🤦🏼🍼", "বন্ধুর সাথে ছেকা খাওয়া গান শুনতে শুনতে-🤧 -এখন আমিও বন্ধুর 𝙴𝚇 কে অনেক 𝙼𝙸𝚂𝚂 করি-🤕", " পুরুষকে সবচেয়ে বেশি কষ্ট দেয় তার শখের নারী...!🥺💔", "তোমার লগে দেখা হবে আবার - 😌 -কোনো এক অচেনা গলির চিপায়..!😛🥴", "•-কিরে🫵 তরা নাকি prem করস..😐🐸•আমারে একটা করাই দিলে কি হয়-🥺", "-প্রিয়-🥺 -তোমাকে না পেলে আমি সত্যি-😪 -আরেকজন কে-😼 -পটাতে বাধ্য হবো-😑🤧", "তোর কি চোখে পড়ে না আমি বস জয় এর সাথে ব্যাস্ত আসি😒", "মাইয়া হলে আমার বস জয় কে Ummmmha দে 😒, এই নে বসের আইডি https://www.facebook.com/sparsahina.anubhuti.37757", "- শখের নারী বিছানায় মু'তে..!🙃🥴", "বার বার Disturb করেছিস কোনো😾,আমার বস জয় এর এর সাথে ব্যাস্ত আসি😒🤳🏻", "আমি গরীব এর সাথে কথা বলি না😼", "কিরে বলদ এত ডাকাডাকি করিস কেনো 🐸, তোরে কি শয়তানে লারে ??","😏 Tui bollei mon gulo fuler moto fute uthe",
  "😉 Ei raat e tumi aar ami... kichu ekta spicy hobe naki?",
  "💋 Tor voice ta amar heart-er ringtone hote pare!",
  "😼 Dekhlei tor chokh e chemistry lage... physics nai?",
  "😇 Bujhlam, tui flirt kora sikhli amar theke!",
  "🥀 Tui jodi chash hoye jash, ami tor ghum bhenge debo...",
  "👀 Toke dekhe mon chay... daily dekhi!",
  "🥺amake na deke amr boss ar inbox a nok deo my boss inbox https://www.facebook.com/sparsahina.anubhuti.37757",
  "my owner inbox link https://www.facebook.com/sparsahina.anubhuti.37757",
];
 if (!arr) {

 await api.sendMessage(randomReplies[Math.floor(Math.random() * randomReplies.length)], event.threadID, (error, info) => {
 if (!info) message.reply("info obj not found")
 global.GoatBot.onReply.set(info.messageID, {
 commandName: this.config.name,
 type: "reply",
 messageID: info.messageID,
 author: event.senderID
 });
 }, event.messageID)
 }
 const a = (await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(arr)}&senderID=${event.senderID}&font=1`)).data.reply;
 await api.sendMessage(a, event.threadID, (error, info) => {
 global.GoatBot.onReply.set(info.messageID, {
 commandName: this.config.name,
 type: "reply",
 messageID: info.messageID,
 author: event.senderID,
 a
 });
 }, event.messageID)
 }
 } catch (err) {
 return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
 }
};

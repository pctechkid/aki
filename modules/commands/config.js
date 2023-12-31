module.exports.config = {
  name: "config",
  version: "1.0.0",
  hasPermssion: 2,
  usePrefix: true,
  credits: "Aki Hayakawa",
  description: "Configure bot",
  commandCategory: "system",
  cooldowns: 5
};

module.exports.handleReply = async function ({ api, event, handleReply }) {
  const botID = api.getCurrentUserID();
  const axios = require("axios");

  const { type, author } = handleReply;
  const { threadID, messageID, senderID } = event;
  let body = event.body || "";
  if (author != senderID) return;

  const args = body.split(" ");

  const reply = function (msg, callback) {
    if (callback) api.sendMessage(msg, threadID, callback, messageID);
    else api.sendMessage(msg, threadID, messageID);
  };

  if (type == 'menu') {
    if (["01", "1"].includes(args[0])) {
      reply(`Please reply to this message with bio you want to change to bot or 'delete' if you want to delete current bio`, (err, info) => {
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: senderID,
          type: "changeBio"
        });
      });
    }
    else if (["02", "2"].includes(args[0])) {
      const messagePending = await api.getThreadList(500, null, ["PENDING"]);
      const msg = messagePending.reduce((a, b) => a += `${b.name} | ${b.threadID} | Message: ${b.snippet}\n`, "");
      return reply(`Bot message waiting list:\n\n${msg}`);
    }
    else if (["03", "3"].includes(args[0])) {
      const messagePending = await api.getThreadList(500, null, ["unread"]);
      const msg = messagePending.reduce((a, b) => a += `${b.name} | ${b.threadID} | Message: ${b.snippet}\n`, "") || "There are no messages yet";
      return reply(`Bot unread message list:\n\n${msg}`);
    }
    else if (["04", "4"].includes(args[0])) {
      const messagePending = await api.getThreadList(500, null, ["OTHER"]);
      const msg = messagePending.reduce((a, b) => a += `${b.name} | ${b.threadID} | Message: ${b.snippet}\n`, "") || "There are no messages yet";
      return reply(`Bot spam message list:\n\n${msg}`);
    }
    else if (["05", "5"].includes(args[0])) {
      reply(`Reply to this message with a photo or a link of the image you want to change to the bot avatar`, (err, info) => {
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: senderID,
          type: "changeAvatar"
        });
      });
    }
    else if (["06", "6"].includes(args[0])) {
      if (!args[1] || !["on", "off"].includes(args[1])) return reply('Please select on or off');
      const form = {
        av: botID,
        variables: JSON.stringify({
          "0": {
            is_shielded: args[1] == 'on' ? true : false,
            actor_id: botID,
            client_mutation_id: Math.round(Math.random() * 19)
          }
        }),
        doc_id: "1477043292367183"
      };
      api.httpPost("https://www.facebook.com/api/graphql/", form, (err, data) => {
        if (err || JSON.parse(data).errors) reply("An error occurred, please try again later");
        else reply(`Avatar shield successfully ${args[1] == 'on' ? 'turned on' : 'turned off'}`);
      });
    }
    else if (["07", "7"].includes(args[0])) {
      return reply(`Reply to this message with the id of the person you want to block, you can enter multiple ids separated by a space or a newline`, (e, info) => {
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: senderID,
          type: "blockUser"
        });
      });
    }
    else if (["08", "8"].includes(args[0])) {
      return reply(`Reply to this message with the id of the person you want to unblock, can enter multiple ids separated by space or newline`, (e, info) => {
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: senderID,
          type: "unBlockUser"
        });
      });
    }

    else if (["09", "9"].includes(args[0])) {
      return reply(`Reply to this message with the content you want to create a post`, (e, info) => {
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: senderID,
          type: "createPost"
        });
      });
    }
    else if (["10", "11"].includes(args[0])) {
      return reply(`Reply to this message with the postID you want to comment on (post ${args[0] == "10" ? "by user" : "on group"}), can enter multiple ids separated by space or newline`, (e, info) => {
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: senderID,
          type: "choiceIdCommentPost",
          isGroup: args[0] == "10" ? false : true
        });
      });
    }
    else if (["12", "13", "14", "15", "16", "17"].includes(args[0])) {
      reply(`Reply to this message with the desired post id ${args[0] == "12" ? "release emotions" : args[0] == "13" ? "send friend invitations" : args[0] == "14" ? "accept friend request" : args[0] == "15" ? "decline friend request" : args[0] == "16" ? "delete friends" : "send Message"}, can enter multiple ids separated by space or newline`, (e, info) => {
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: senderID,
          type: args[0] == "12" ? "choiceIdReactionPost" : args[0] == "13" ? "addFiends" : args[0] == "14" ? "acceptFriendRequest" : args[0] == "15" ? "deleteFriendRequest" : args[0] == "16" ? "unFriends" : "choiceIdSendMessage"
        });
      });
    }
    else if (["18"].includes(args[0])) {
      reply('Reply to this message with the code you want to create a note', (e, info) => {
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: senderID,
          type: "noteCode",
          isGroup: args[0] == "10" ? false : true
        });
      });
    }
    else if (["19"].includes(args[0])) {
      api.logout((e) => {
        if (e) return reply('An error occurred, please try again later');
        else console.log('Logged out successfully');
      });
    }
  }


  else if (type == 'changeBio') {
    const bio = body.toLowerCase() == 'delete' ? '' : body;
    api.changeBio(bio, false, (err) => {
      if (err) return reply("An error occurred, please try again later");
      else return reply(`Is already ${!bio ? "delete bot's profile successfully" : `change bot profile to: ${bio}`}`);
    });
  }

  else if (type == 'changeAvatar') {
    let imgUrl;
    if (body && body.match(/^((http(s?)?):\/\/)?([wW]{3}\.)?[a-zA-Z0-9\-.]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/g)) imgUrl = body;
    else if (event.attachments[0] && event.attachments[0].type == "photo") imgUrl = event.attachments[0].url;
    else return reply(`Please enter a valid image link or reply to the message with an image you want to set as an avatar for the bot`, (err, info) => {
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: senderID,
        type: "changeAvatar"
      });
    });
    try {
      const imgBuffer = (await axios.get(imgUrl, {
        responseType: "stream"
      })).data;
      const form0 = {
        file: imgBuffer
      };
      let uploadImageToFb = await api.httpPostFormData(`https://www.facebook.com/profile/picture/upload/?profile_id=${botID}&photo_source=57&av=${botID}`, form0);
      uploadImageToFb = JSON.parse(uploadImageToFb.split("for (;;);")[1]);
      if (uploadImageToFb.error) return reply("Error! An error occurred. Please try again later: " + uploadImageToFb.error.errorDescription);
      const idPhoto = uploadImageToFb.payload.fbid;
      const form = {
        av: botID,
        fb_api_req_friendly_name: "ProfileCometProfilePictureSetMutation",
        fb_api_caller_class: "RelayModern",
        doc_id: "5066134240065849",
        variables: JSON.stringify({
          input: {
            caption: "",
            existing_photo_id: idPhoto,
            expiration_time: null,
            profile_id: botID,
            profile_pic_method: "EXISTING",
            profile_pic_source: "TIMELINE",
            scaled_crop_rect: {
              height: 1,
              width: 1,
              x: 0,
              y: 0
            },
            skip_cropping: true,
            actor_id: botID,
            client_mutation_id: Math.round(Math.random() * 19).toString()
          },
          isPage: false,
          isProfile: true,
          scale: 3
        })
      };
      api.httpPost("https://www.facebook.com/api/graphql/", form, (e, i) => {
        if (e) reply(`An error occurred, please try again later`);
        else if (JSON.parse(i.slice(0, i.indexOf('\n') + 1)).errors) reply(`Error! An error occurred. Please try again later: ${JSON.parse(i).errors[0].description}`);
        else reply(`Changed avatar for bot successfully`);
      });
    }
    catch (err) {
      reply(`An error occurred, please try again later`);
    }
  }


  else if (type == 'blockUser') {
    if (!body) return reply("Please enter the uid of the people you want to block on messenger, you can enter multiple ids separated by space or newline", (e, info) => {
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: senderID,
        type: 'blockUser'
      });
    });
    const uids = body.replace(/\s+/g, " ").split(" ");
    const success = [];
    const failed = [];
    for (const uid of uids) {
      try {
        await api.changeBlockedStatus(uid, true);
        success.push(uid);
      }
      catch (err) {
        failed.push(uid);
      }
    }
    reply(`Successfully blocked ${success.length} users on messenger${failed.length > 0 ? `\nBlock failure ${failed.length} user, id: ${failed.join(" ")}` : ""}`);
  }


  else if (type == 'unBlockUser') {
    if (!body) return reply("Please enter uid of the people you want to unblock on messenger, you can enter multiple ids separated by space or newline", (e, info) => {
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: senderID,
        type: 'unBlockUser'
      });
    });
    const uids = body.replace(/\s+/g, " ").split(" ");
    const success = [];
    const failed = [];
    for (const uid of uids) {
      try {
        await api.changeBlockedStatus(uid, false);
        success.push(uid);
      }
      catch (err) {
        failed.push(uid);
      }
    }
    reply(`Unblocked successfully ${success.length} users on messenger${failed.length > 0 ? `\nUnblock failure ${failed.length} user, id: ${failed.join(" ")}` : ""}`);
  }


  else if (type == 'createPost') {
    if (!body) return reply("Please enter the content you want to create the article", (e, info) => {
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: senderID,
        type: 'createPost'
      });
    });

    const session_id = getGUID();
    const form = {
      av: botID,
      fb_api_req_friendly_name: "ComposerStoryCreateMutation",
      fb_api_caller_class: "RelayModern",
      doc_id: "4612917415497545",
      variables: JSON.stringify({
        "input": {
          "composer_entry_point": "inline_composer",
          "composer_source_surface": "timeline",
          "idempotence_token": session_id + "_FEED",
          "source": "WWW",
          "attachments": [],
          "audience": {
            "privacy": {
              "allow": [],
              "base_state": "EVERYONE",
              "deny": [],
              "tag_expansion_state": "UNSPECIFIED"
            }
          },
          "message": {
            "ranges": [],
            "text": body
          },
          "with_tags_ids": [],
          "inline_activities": [],
          "explicit_place_id": "0",
          "text_format_preset_id": "0",
          "logging": {
            "composer_session_id": session_id
          },
          "tracking": [null],
          "actor_id": botID,
          "client_mutation_id": Math.round(Math.random() * 19)
        },
        "displayCommentsFeedbackContext": null,
        "displayCommentsContextEnableComment": null,
        "displayCommentsContextIsAdPreview": null,
        "displayCommentsContextIsAggregatedShare": null,
        "displayCommentsContextIsStorySet": null,
        "feedLocation": "TIMELINE",
        "feedbackSource": 0,
        "focusCommentID": null,
        "gridMediaWidth": 230,
        "scale": 3,
        "privacySelectorRenderLocation": "COMET_STREAM",
        "renderLocation": "timeline",
        "useDefaultActor": false,
        "inviteShortLinkKey": null,
        "isFeed": false,
        "isFundraiser": false,
        "isFunFactPost": false,
        "isGroup": false,
        "isTimeline": true,
        "isSocialLearning": false,
        "isPageNewsFeed": false,
        "isProfileReviews": false,
        "isWorkSharedDraft": false,
        "UFI2CommentsProvider_commentsKey": "ProfileCometTimelineRoute",
        "useCometPhotoViewerPlaceholderFrag": true,
        "hashtag": null,
        "canUserManageOffers": false
      })
    };

    api.httpPost('https://www.facebook.com/api/graphql/', form, (e, i) => {
      if (e || JSON.parse(i).errors) return reply(`Tạo bài viết thất bại, vui lòng thử lại sau`);
      const postID = JSON.parse(i).data.story_create.story.legacy_story_hideable_id;
      const urlPost = JSON.parse(i).data.story_create.story.url;
      return reply(`Post created successfully\npostID: ${postID}\nurlPost: ${urlPost}`);
    });
  }


  else if (type == 'choiceIdCommentPost') {
    if (!body) return reply('Please enter the id of the post you want to comment on', (e, info) => {
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: senderID,
        type: "choiceIdCommentPost",
        isGroup: handleReply.isGroup
      });
    })
    reply("Reply to this message with the content you want to comment on the post", (e, info) => {
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: senderID,
        postIDs: body.replace(/\s+/g, " ").split(" "),
        type: "commentPost",
        isGroup: handleReply.isGroup
      });
    });
  }


  else if (type == 'commentPost') {
    const { postIDs, isGroup } = handleReply;

    if (!body) return reply('Please enter the content you want to comment on the post', (e, info) => {
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: senderID,
        type: "commentPost",
        postIDs: handleReply.postIDs,
        isGroup: handleReply.isGroup
      });
    });
    const success = [];
    const failed = [];

    for (let id of postIDs) {
      const postID = (new Buffer('feedback:' + id)).toString('base64');
      const { isGroup } = handleReply;
      const ss1 = getGUID();
      const ss2 = getGUID();

      const form = {
        av: botID,
        fb_api_req_friendly_name: "CometUFICreateCommentMutation",
        fb_api_caller_class: "RelayModern",
        doc_id: "4744517358977326",
        variables: JSON.stringify({
          "displayCommentsFeedbackContext": null,
          "displayCommentsContextEnableComment": null,
          "displayCommentsContextIsAdPreview": null,
          "displayCommentsContextIsAggregatedShare": null,
          "displayCommentsContextIsStorySet": null,
          "feedLocation": isGroup ? "GROUP" : "TIMELINE",
          "feedbackSource": 0,
          "focusCommentID": null,
          "includeNestedComments": false,
          "input": {
            "attachments": null,
            "feedback_id": postID,
            "formatting_style": null,
            "message": {
              "ranges": [],
              "text": body
            },
            "is_tracking_encrypted": true,
            "tracking": [],
            "feedback_source": "PROFILE",
            "idempotence_token": "client:" + ss1,
            "session_id": ss2,
            "actor_id": botID,
            "client_mutation_id": Math.round(Math.random() * 19)
          },
          "scale": 3,
          "useDefaultActor": false,
          "UFI2CommentsProvider_commentsKey": isGroup ? "CometGroupDiscussionRootSuccessQuery" : "ProfileCometTimelineRoute"
        })
      };

      try {
        const res = await api.httpPost('https://www.facebook.com/api/graphql/', form);
        if (JSON.parse(res).errors) failed.push(id);
        else success.push(id);
      }
      catch (err) {
        failed.push(id);
      }
    }
    reply(`Successfully commented ${success.length} posts${failed.length > 0 ? `\nComment failed ${failed.length} posts, postID: ${failed.join(" ")}` : ""}`);
  }

  else if (type == 'choiceIdReactionPost') {
    if (!body) return reply(`Please enter the post id you want to react to`, (e, info) => {
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: senderID,
        type: "choiceIdReactionPost"
      });
    });

    const listID = body.replace(/\s+/g, " ").split(" ");

    reply(`Enter the emotion you want to react to ${listID.length} posts (unlike/like/love/heart/haha/wow/sad/angry)`, (e, info) => {
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: senderID,
        listID,
        type: "reactionPost"
      });
    })
  }

  else if (type == 'reactionPost') {
    const success = [];
    const failed = [];
    const postIDs = handleReply.listID;
    const feeling = body.toLowerCase();
    if (!'unlike/like/love/heart/haha/wow/sad/angry'.split('/').includes(feeling)) return reply('Please choose one of the following emotions unlike/like/love/heart/haha/wow/sad/angry', (e, info) => {
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: senderID,
        listID,
        type: "reactionPost"
      })
    });
    for (const postID of postIDs) {
      try {
        await api.setPostReaction(Number(postID), feeling);
        success.push(postID);
      }
      catch (err) {
        failed.push(postID);
      }
    }
    reply(`Released emotions ${feeling} give ${success.length} successful post${failed.length > 0 ? `Reaction failed ${failed.length} posts, postID: ${failed.join(" ")}` : ''}`);
  }

  else if (type == 'addFiends') {
    const listID = body.replace(/\s+/g, " ").split(" ");
    const success = [];
    const failed = [];

    for (const uid of listID) {
      const form = {
        av: botID,
        fb_api_caller_class: "RelayModern",
        fb_api_req_friendly_name: "FriendingCometFriendRequestSendMutation",
        doc_id: "5090693304332268",
        variables: JSON.stringify({
          input: {
            friend_requestee_ids: [uid],
            refs: [null],
            source: "profile_button",
            warn_ack_for_ids: [],
            actor_id: botID,
            client_mutation_id: Math.round(Math.random() * 19).toString()
          },
          scale: 3
        })
      };
      try {
        const sendAdd = await api.httpPost('https://www.facebook.com/api/graphql/', form);
        if (JSON.parse(sendAdd).errors) failed.push(uid);
        else success.push(uid)
      }
      catch (e) {
        failed.push(uid);
      };
    }
    reply(`Friend request has been sent successfully to ${success.length} id${failed.length > 0 ? `\nSend a friend request to ${failed.length} id failure: ${failed.join(" ")}` : ""}`);
  }

  else if (type == 'choiceIdSendMessage') {
    const listID = body.replace(/\s+/g, " ").split(" ");
    reply(`Enter the text of the message you want to send ${listID.length} user`, (e, info) => {
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: senderID,
        listID,
        type: "sendMessage"
      });
    })
  }

  else if (type == 'unFriends') {
    const listID = body.replace(/\s+/g, " ").split(" ");
    const success = [];
    const failed = [];

    for (const idUnfriend of listID) {
      const form = {
        av: botID,
        fb_api_req_friendly_name: "FriendingCometUnfriendMutation",
        fb_api_caller_class: "RelayModern",
        doc_id: "4281078165250156",
        variables: JSON.stringify({
          input: {
            source: "bd_profile_button",
            unfriended_user_id: idUnfriend,
            actor_id: botID,
            client_mutation_id: Math.round(Math.random() * 19)
          },
          scale: 3
        })
      };
      try {
        const sendAdd = await api.httpPost('https://www.facebook.com/api/graphql/', form);
        if (JSON.parse(sendAdd).errors) failed.push(`${idUnfriend}: ${JSON.parse(sendAdd).errors[0].summary}`);
        else success.push(idUnfriend)
      }
      catch (e) {
        failed.push(idUnfriend);
      };
    }
    reply(`Deleted successfully ${success.length} friend${failed.length > 0 ? `\nDelete failed ${failed.length} friend:\n${failed.join("\n")}` : ""}`);
  }


  else if (type == 'sendMessage') {
    const listID = handleReply.listID;
    const success = [];
    const failed = [];
    for (const uid of listID) {
      try {
        const sendMsg = await api.sendMessage(body, uid);
        if (!sendMsg.messageID) failed.push(uid);
        else success.push(uid);
      }
      catch (e) {
        failed.push(uid);
      }
    }
    reply(`Message sent successfully to ${success.length} user${failed.length > 0 ? `\nSend a message to ${failed.length} user failed: ${failed.join(" ")}` : ""}`);
  }


  else if (type == 'acceptFriendRequest' || type == 'deleteFriendRequest') {
    const listID = body.replace(/\s+/g, " ").split(" ");

    const success = [];
    const failed = [];

    for (const uid of listID) {
      const form = {
        av: botID,
        fb_api_req_friendly_name: type == 'acceptFriendRequest' ? "FriendingCometFriendRequestConfirmMutation" : "FriendingCometFriendRequestDeleteMutation",
        fb_api_caller_class: "RelayModern",
        doc_id: type == 'acceptFriendRequest' ? "3147613905362928" : "4108254489275063",
        variables: JSON.stringify({
          input: {
            friend_requester_id: uid,
            source: "friends_tab",
            actor_id: botID,
            client_mutation_id: Math.round(Math.random() * 19).toString()
          },
          scale: 3,
          refresh_num: 0
        })
      };
      try {
        const friendRequest = await api.httpPost("https://www.facebook.com/api/graphql/", form);
        if (JSON.parse(friendRequest).errors) failed.push(uid);
        else success.push(uid);
      }
      catch (e) {
        failed.push(uid);
      }
    }
    reply(`Is already ${type == 'acceptFriendRequest' ? 'accept' : 'erase'} successful friend request of ${success.length} id${failed.length > 0 ? `\nFail with ${failed.length} id: ${failed.join(" ")}` : ""}`);
  }


  else if (type == 'noteCode') {
    axios({
      url: 'https://buildtool.dev/verification',
      method: 'post',
      data: `content=${encodeURIComponent(body)}&code_class=language${encodeURIComponent('-')}javascript`
    })
      .then(response => {
        const href = response.data.split('<a href="code-viewer.php?')[1].split('">Permanent link</a>')[0];
        reply(`Create a successful note, link: ${'https://buildtool.dev/code-viewer.php?' + href}`)
      })
      .catch(err => {
        reply('An error occurred, please try again later');
      })
  }
};


module.exports.run = async ({ event, api }) => {
  const { threadID, messageID, senderID } = event;
  if (!global.config.ADMINBOT.includes(senderID))
    return api.sendMessage("Sorry, only my creator can use that command.", threadID, messageID);

  api.sendMessage("BOT PROFILE COMMANDS\n"
    + "\n01. Edit bot bio"
    + "\n02. View pending messages"
    + "\n03. View unread messages"
    + "\n04. View spam messages"
    + "\n05. Change bot avatar"
    + "\n06. Turn on the bot avatar shield <on/off>"
    + "\n07. Block users (messenger)"
    + "\n08. Unblock users (messenger)"
    + "\n09. Create post"
    + "\n10. Delete post (user)"
    + "\n11. Comment the post (group)"
    + "\n12. Drop post feelings"
    + "\n13. Make friends by id"
    + "\n14. Accept friend request by id"
    + "\n15. Decline friend request by id"
    + "\n16. Delete friends by id"
    + "\n17. Send a message by id"
    + "\n18. Make notes on buildtool.dev"
    + "\n19. Log out of your account"
    + "\n"
    + `\nPlease reply to this message with the number you want to execute`
    + "", threadID, (err, info) => {
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: senderID,
        type: "menu"
      });
    }, messageID);
};


function getGUID() {
  const key = `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`;
  let timeNow = Date.now(),
    r = key.replace(/[xy]/g, function (info) {
      let a = Math.floor((timeNow + Math.random() * 16) % 16);
      timeNow = Math.floor(timeNow / 16);
      let b = (info == 'x' ? a : a & 7 | 8).toString(16);
      return b;
    });
  return r;
}
getGUID()
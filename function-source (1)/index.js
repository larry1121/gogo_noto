const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
let serAccount = require("./gogo-de7d0-firebase-adminsdk-c0x36-248faf59d1.json");
admin.initializeApp({
  credential: admin.credential.cert(serAccount),
});

const db = admin.firestore();

//함수시작

exports.receiveGoNotification = functions
  .region("asia-northeast3")
  .firestore.document("/Interaction/{interactionId}")
  .onCreate(async (snap, context) => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}

    const interactionId = context.params.interactionId;
    //   mPostkey=context.params.mPostkey;

    //   var isComplete=snap.data().comlete;

    var tokens = [];
    var senderName;
    mBody = snap.data().content;
    mreceiverUID = snap.data().receiver;
    msenderUID = snap.data().sender;

    // functions.firestore.document('/Interaction/${interactionId}/posts/${mPostkey}')
    await db
      .collection("User")
      .doc(mreceiverUID)
      .get()
      .then(async (doc) => {
        if (doc.exists) {
          // console.log(doc.id);
          tokens.push(doc.data().FCMtoken);

          console.log("receiver FCMtoken is", doc.data().FCMtoken);
          // console.log(doc.data().created);
        }
      });
    await db
      .collection("User")
      .doc(mreceiverUID)
      .collection("Friend")
      .doc(msenderUID)
      .get()
      .then(async (doc) => {
        if (doc.exists) {
          // console.log(doc.id);
          senderName = doc.data().name;

          console.log("senderName is", senderName);
          // console.log(doc.data().created);
        }
      });

    //console.log("postUID is",a);
    const payload = {
      notification: {
        title: "ㄱ?",
        body: `${senderName} 님이 메세지를 보냈습니다.`,
        sound: "gogo_notification.wav",
        android_channel_id: "gogo_notification_channel",
        //   body: `${senderName} 님이 보냈습니다. "${mBody}"`,
        // click_action: "FCM_MY_POST_ACTIVITY"
      },
      data: {
        //   "interactionId" : interactionId,
        //   "mPostkey" : mPostkey,
        //   "click_action" : "FCM_MY_POST_ACTIVITY",
        //   "mpostTitle" : mpostTitle[0],
        //   "mreplyBody" : mreplyBody
        click_action: "Receive",
        suid: msenderUID,
        ruid: mreceiverUID,
      },
    };

    console.log(tokens);

    if (tokens.length > 0) {
      admin
        .messaging()
        .sendToDevice(tokens, payload)
        .then(function (response) {
          // See the MessagingDevicesResponse reference documentation for
          // the contents of response.
          console.log("Successfully sent message:", response);
          console.log(response.results[0].error);
        })
        .catch(function (error) {
          console.log("Error sending message:", error);
        });
    }

    //   exports.sendGoNotification

    //   exports.sendGoReplyNotification

    //   exports.sendFriendRequestNotification

    //   exports.sendFriendRequestReplyNotification
  });

exports.receiveGoReplyNotification = functions
  .region("asia-northeast3")
  .firestore.document("/Interaction/{interactionId}")
  .onUpdate(async (change, context) => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}

    const interactionId = context.params.interactionId;
    //   mPostkey=context.params.mPostkey;

    //var isComplete=change.after.data().complete;

    //   if(isComplete){
    //     return;
    //   }

    var tokens = [];
    var receiverName;
    const mBody = change.after.data().reply;
    const mreceiverUID = change.after.data().receiver;
    const msenderUID = change.after.data().sender;

    if (Boolean(change.after.data().reply === change.before.data().reply)) {
      var senderName;

      // functions.firestore.document('/Interaction/${interactionId}/posts/${mPostkey}')
      await db
        .collection("User")
        .doc(mreceiverUID)
        .get()
        .then(async (doc) => {
          if (doc.exists) {
            // console.log(doc.id);
            tokens.push(doc.data().FCMtoken);

            console.log("receiver FCMtoken is", doc.data().FCMtoken);
            // console.log(doc.data().created);
          }
        });
      await db
        .collection("User")
        .doc(mreceiverUID)
        .collection("Friend")
        .doc(msenderUID)
        .get()
        .then(async (doc) => {
          if (doc.exists) {
            // console.log(doc.id);
            senderName = doc.data().name;

            console.log("senderName is", senderName);
            // console.log(doc.data().created);
          }
        });

      //console.log("postUID is",a);
      const payload = {
        notification: {
          title: "ㄱ?",
          body: `${senderName} 님이 메세지를 보냈습니다.`,
          sound: "gogo_notification.wav",
          android_channel_id: "gogo_notification_channel",
          //   body: `${senderName} 님이 보냈습니다. "${mBody}"`,
          // click_action: "FCM_MY_POST_ACTIVITY"
        },
        data: {
          //   "interactionId" : interactionId,
          //   "mPostkey" : mPostkey,
          //   "click_action" : "FCM_MY_POST_ACTIVITY",
          //   "mpostTitle" : mpostTitle[0],
          //   "mreplyBody" : mreplyBody
          click_action: "Receive",
          suid: msenderUID,
          ruid: mreceiverUID,
        },
      };

      console.log(tokens);

      if (tokens.length > 0) {
        admin
          .messaging()
          .sendToDevice(tokens, payload)
          .then(function (response) {
            // See the MessagingDevicesResponse reference documentation for
            // the contents of response.
            console.log("Successfully sent message:", response);
            console.log(response.results[0].error);
          })
          .catch(function (error) {
            console.log("Error sending message:", error);
          });
      }

      return;
    }
    // functions.firestore.document('/Interaction/${interactionId}/posts/${mPostkey}')
    await db
      .collection("User")
      .doc(msenderUID)
      .get()
      .then(async (doc) => {
        if (doc.exists) {
          // console.log(doc.id);
          tokens.push(doc.data().FCMtoken);

          console.log("sender FCMtoken is", doc.data().FCMtoken);
          // console.log(doc.data().created);
        }
      });
    await db
      .collection("User")
      .doc(msenderUID)
      .collection("Friend")
      .doc(mreceiverUID)
      .get()
      .then(async (doc) => {
        if (doc.exists) {
          // console.log(doc.id);
          receiverName = doc.data().name;

          console.log("receiverName is", receiverName);
          // console.log(doc.data().created);
        }
      });

    const payload = {
      notification: {
        title: "ㄱ?",
        body: `${receiverName} 님이 답장했습니다.`,
        sound: "gogo_notification.wav",
        android_channel_id: "gogo_notification_channel",
        // click_action: "FCM_MY_POST_ACTIVITY"
        //   body: `${receiverName} 님이 답장했습니다. "${mBody}"`,
      },
      data: {
        //   "interactionId" : interactionId,
        //   "mPostkey" : mPostkey,
        //   "click_action" : "FCM_MY_POST_ACTIVITY",
        //   "mpostTitle" : mpostTitle[0],
        //   "mreplyBody" : mreplyBody
        click_action: "Reply",
        suid: msenderUID,
        ruid: mreceiverUID,
      },
    };

    //   // FireStore 에서 데이터 읽어오기
    //   await db.collection('users').doc(mpostUID[0]).get().then((doc) => {
    //       if(doc.exists){

    //           if(doc.data().notificationSettings==false){
    //               return;
    //           }else{
    //               tokens.push(doc.data().FCMtoken);
    //           }

    //       }
    //       });

    console.log(tokens);

    if (tokens.length > 0) {
      admin
        .messaging()
        .sendToDevice(tokens, payload)
        .then(function (response) {
          // See the MessagingDevicesResponse reference documentation for
          // the contents of response.
          console.log("Successfully sent message:", response);
        })
        .catch(function (error) {
          console.log("Error sending message:", error);
        });
    }
  });

exports.receiveFriendRequestNotification = functions
  .region("asia-northeast3")
  .firestore.document("/User/{userUID}/Friend/{friendUID}")
  .onCreate(async (snap, context) => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}
    console.log("receiveFriendRequestNotification init");
    const userUID = context.params.userUID;
    const friendUID = context.params.friendUID;
    // mPostkey=context.params.mPostkey;

    console.log("userUID : " + userUID);
    console.log("friendUID : " + friendUID);

    //   if(approval){
    //     return;
    //   }

    var tokens = [];
    var senderName;

    if (Boolean(snap.data().request)) {
      return;
    }

    // functions.firestore.document('/Interaction/${interactionId}/posts/${mPostkey}')
    await db
      .collection("User")
      .doc(userUID)
      .get()
      .then(async (doc) => {
        if (doc.exists) {
          if (!Boolean(doc.data().request)) {
            tokens.push(doc.data().FCMtoken);

            console.log("receiver FCMtoken is", doc.data().FCMtoken);
            console.log("receiver FCMtoken is", doc.data().FCMtoken);
            // console.log(doc.data().created);

            await db
              .collection("User")
              .doc(friendUID)
              .get()
              .then(async (doc) => {
                if (doc.exists) {
                  // console.log(doc.id);

                  senderName = doc.data().name;

                  console.log("senderName is", senderName);
                  // console.log(doc.data().created);
                } else if (!doc.exists) {
                  console.log("sender user document is not exist");
                }
              });
          }
        } else if (!doc.exists) {
          console.log("receiver user document is not exist");
        }
      });

    //console.log("postUID is",a);
    const payload = {
      notification: {
        title: "ㄱ?",
        body: `${senderName} 님이 친구요청을 보냈습니다.`,
        // click_action: "FCM_MY_POST_ACTIVITY"
      },
      data: {
        //   "interactionId" : interactionId,
        //   "mPostkey" : mPostkey,
        click_action: "Notification",
        uid: userUID,
        //   "mpostTitle" : mpostTitle[0],
        //   "mreplyBody" : mreplyBody
      },
    };

    console.log(tokens);

    if (tokens.length > 0) {
      admin
        .messaging()
        .sendToDevice(tokens, payload)
        .then(function (response) {
          // See the MessagingDevicesResponse reference documentation for
          // the contents of response.
          console.log("Successfully sent message:", response);
        })
        .catch(function (error) {
          console.log("Error sending message:", error);
        });
    }
  });

exports.receiveFriendRequestReplyNotification = functions
  .region("asia-northeast3")
  .firestore.document("/User/{userUID}/Friend/{friendUID}")
  .onUpdate(async (change, context) => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}

    console.log("receiveFriendRequestReplyNotification init");
    console.log(
      "change.before request property : " + change.after.data().request
    );

    if (Boolean(!change.after.data().request)) {
      return;
    }

    console.log("change property : " + change);

    console.log(
      "change.before approval property : " + change.before.data().approval
    );
    console.log(
      "change.after approval property : " + change.after.data().approval
    );

    const isReal =
      !Boolean(change.before.data().approval) &&
      Boolean(change.after.data().approval);

    console.log("isReal : " + isReal);
    if (!isReal) {
      return;
    }

    //이거 undefined뜸

    const userUID = context.params.userUID;
    const friendUID = context.params.friendUID;
    //   mPostkey=context.params.mPostkey;
    console.log("userUID : " + userUID);
    console.log("friendUID : " + friendUID);

    // const approval=Boolean(change.after.data().receiver)
    // //change.after.data is not a functinss

    // if(!approval){
    //   return;
    // }

    var tokens = [];
    var senderName;

    // functions.firestore.document('/Interaction/${interactionId}/posts/${mPostkey}')
    await db
      .collection("User")
      .doc(userUID)
      .get()
      .then(async (doc) => {
        if (doc.exists) {
          // console.log(doc.id);

          // console.log(doc.id);
          tokens.push(doc.data().FCMtoken);

          console.log("receiver FCMtoken is", doc.data().FCMtoken);
          // console.log(doc.data().created);
        }
      });

    await db
      .collection("User")
      .doc(friendUID)
      .get()
      .then(async (doc) => {
        if (doc.exists) {
          // console.log(doc.id);
          senderName = doc.data().name;

          console.log("senderName is", senderName);
          // console.log(doc.data().created);
        }
      });

    //console.log("postUID is",a);
    const payload = {
      notification: {
        title: "ㄱ?",
        body: `${senderName} 님이 친구요청을 수락하였습니다.`,
        // click_action: "FCM_MY_POST_ACTIVITY"
      },
      data: {
        //   "interactionId" : interactionId,
        //   "mPostkey" : mPostkey,
        click_action: "Friend",
        uid: userUID,
        //   "mpostTitle" : mpostTitle[0],
        //   "mreplyBody" : mreplyBody
      },
    };

    console.log(tokens);

    if (tokens.length > 0) {
      admin
        .messaging()
        .sendToDevice(tokens, payload)
        .then(function (response) {
          // See the MessagingDevicesResponse reference documentation for
          // the contents of response.
          console.log("Successfully sent message:", response);
        })
        .catch(function (error) {
          console.log("Error sending message:", error);
        });
    }
  });

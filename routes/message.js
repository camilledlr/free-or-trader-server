var express = require("express");
var router = express.Router();
const userModel = require("../models/User");
const messageModel = require("../models/Message");

// router.get("/all/:my_id", (req, res, next) => {

//     messageModel.find({ $or : [{to : req.params.my_id}, {from : req.params.my_id}]}).populate('from').populate('to')
//       .then(messages => {
//         res.status(201).json(messages)
// }).catch(dbErr => console.log(dbErr))
//   });
router.get("/all/:my_id", (req, res, next) => {
    // function elementDoesntExist(el, msg){
    //     if (el.from._id == msg.from._id) {
    //         if(el.to._id !== msg.to._id) {
    //             console.log('vérifié', el,  msg)
    //             return true
    //         }else {return false}
    //     } else {
    //         if(el.from._id !== msg.to._id) {
    //             console.log('vérifié',el, msg)
    //             return true
    //         }else {return false}
    //     }
    // }
    messageModel.find(
      { $or : [{to : req.params.my_id}, {from : req.params.my_id}]}).populate('from').populate('to')
      .then(messages => {
        console.log(messages)
        let conversations = messages.reduce( function(acc, currentEl, currentIndex, arr) {
            let idToPush;
            String(currentEl.from._id) == req.params.my_id ? idToPush =  String(currentEl.to._id): idToPush = String(currentEl.from._id) ;
            if (acc[0].includes(idToPush)) {
              debugger
                // console.log('avant déjà',acc)
                return acc
                console.log('déjà',acc)
            } else {
              debugger
                // console.log('avant pas encore',acc)
                acc[0].push(idToPush);
                acc[1].push(currentEl);
                // console.log('pas encore',acc)
                return  acc
            }
        }, [[],[]])
        res.status(201).json(conversations[1])
}).catch(dbErr => console.log(dbErr))
  });

router.get("/:to_id", (req, res, next) => {
  messageModel.find({ $or : [{to : req.params.to_id, from : req.user._id},{to : req.user._id, from : req.params.to_id}]})
    .then(messages => res.status(201).json(messages)
    ).catch(dbErr => console.log(dbErr))
});

router.post("/:to_id", (req, res, next) => {
const newMessage = {
    from : req.user._id,
    to : req.params.to_id,
    text: req.body.text
}
  messageModel
    .create(newMessage)
    .then(createdMessage => res.status(201).json(createdMessage)
    ).catch(dbErr => console.log(dbErr))

});


module.exports = router;
// const idToPush ;
// userId==el.fromId ? idToPush = el.fromId : idToPush = el.toId;
// if (accumulateur[0].match(idToPush)) {
//     console.log('il y est déjà')
// } else {
//     accumulateur[0].push(idToPush)
//     accumulateur[1].push(el)
// }
// return accumulateur

// JSON(accumulateur[1])

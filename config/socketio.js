let IO;
let VideoCall = {};

module.exports = {
  scktioC: (io) => {
    io.on("connection", (socket) => {
      IO = io;

      console.log("a user connected");
    });
  },
  NewAssignmentAdded: (data) => {
    IO.emit("AssignmentAdded", { message: "helllo" });
  },
  StdSendMsg: (data, id) => {
    console.log(id, "Id");
    IO.emit("stdmsg", { data: data, Id: id });
  },
  AdmSendMsg: (data, id) => {
    IO.emit("admmsg", { data: data, Id: id });
  },
  sharevideoLink: (Link) => {
    VideoCall.status = true;
    VideoCall.Link = Link;
    IO.emit("VideoCall", Link);
  },
  getVideoLink: () => {
    return new Promise((resolve, reject) => {
      resolve(VideoCall);
    });
  },
  VideocallEnded: () => {
    if (VideoCall.status) {
      VideoCall = {};
      IO.emit("VideocallEnded");
    }
  },
};

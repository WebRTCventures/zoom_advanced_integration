import { ZoomMtg } from "@zoomus/websdk";

// Preload/prepare SDK resources once
ZoomMtg.setZoomJSLib("https://source.zoom.us/3.11.0/lib", "/av"); // match your SDK version
ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();

type JoinArgs = {
  sdkKey: string;
  signature: string;
  meetingNumber: string;
  userName: string;
  passWord?: string;
};

export async function joinMeeting(a: JoinArgs) {
  await new Promise<void>((resolve, reject) => {
    ZoomMtg.init({
      leaveUrl: window.location.origin,
      success: () => resolve(),
      error: reject,
    });
  });

  await new Promise<void>((resolve, reject) => {
    ZoomMtg.join({
      sdkKey: a.sdkKey,
      signature: a.signature,
      meetingNumber: a.meetingNumber,
      userName: a.userName,
      passWord: a.passWord || "",
      success: () => resolve(),
      error: reject,
    });
  });
}

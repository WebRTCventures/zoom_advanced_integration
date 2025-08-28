import { ZoomMtg } from "@zoom/meetingsdk";

ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();

export default function ZoomContainer({
  signature,
  meetingNumber,
  passWord,
  userName,
  userEmail,
  registrantToken,
  zakToken,
}: {
  signature: string;
  meetingNumber: string;
  passWord: string;
  userName: string;
  userEmail: string;
  registrantToken: string;
  zakToken: string;
}) {
  const leaveUrl = "http://localhost:5173";

  document.getElementById("zmmtg-root")!.style.display = "block";

  ZoomMtg.init({
    leaveUrl: leaveUrl,
    patchJsMedia: true,
    leaveOnPageUnload: true,
    success: (success: unknown) => {
      console.log(success);
      // can this be async?
      ZoomMtg.join({
        signature: signature,
        meetingNumber: meetingNumber,
        passWord: passWord,
        userName: userName,
        userEmail: userEmail,
        tk: registrantToken,
        zak: zakToken,
        success: (success: unknown) => {
          console.log(success);
        },
        error: (error: unknown) => {
          console.log(error);
        },
      });
    },
    error: (error: unknown) => {
      console.log(error);
    },
  });

  return <div></div>;
}

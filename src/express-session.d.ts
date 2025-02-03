import 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId?: string;
  }
}

//   interface Session {
//     save(callback: (err?: any) => void): void;
//   }
// }

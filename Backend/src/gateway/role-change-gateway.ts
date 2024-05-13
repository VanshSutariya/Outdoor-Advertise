import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway(4040, { cors: '*:*' })
export class RoleChangeGateway {
  @WebSocketServer()
  server;

  @SubscribeMessage('roleChange')
  sendRoleChangeUpdate(update: any) {
    this.server.emit('roleChange', update);
  }

  @SubscribeMessage('roleReq')
  userRoleReq(data: any) {
    this.server.emit('roleReq', data);
  }
}

// @WebSocketGateway(8001, { cors: "*:*"})
// export class ChatGateway {
//   @WebSocketServer()
//   server;

//   @SubscribeMessage('message')
//   handleMessage(@MessageBody() message: string): void {
//     this.server.emit('message', message);
//   }
// }

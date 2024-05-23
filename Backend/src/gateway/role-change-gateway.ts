import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

@WebSocketGateway(4040, { cors: '*:*' })
export class RoleChangeGateway {
  @WebSocketServer()
  server: any;

  @SubscribeMessage('roleChange')
  sendRoleChangeUpdate(update: any) {
    this.server.emit('roleChange', update);
  }

  @SubscribeMessage('roleReq')
  userRoleReq(data: any) {
    this.server.emit('roleReq', data);
  }

  @SubscribeMessage('posterReq')
  posterReq(data: any) {
    this.server.emit('posterReq', data);
  }

  @SubscribeMessage('posterRes')
  posterRes(data: any) {
    this.server.emit('posterRes', data);
  }
}

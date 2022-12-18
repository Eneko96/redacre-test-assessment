import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { NestGateway } from '@nestjs/websockets/interfaces/nest-gateway.interface';
import { RateService } from './crypto.service';

const options = {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
};

// Here we are using the @WebSocketGateway decorator to create a gateway
// that will handle all the socket.io connections.
// The @WebSocketGateway decorator accepts an options object that will be
// passed to the underlying socket.io server.
@WebSocketGateway(options)
export class CryptoGateway implements NestGateway {
  private logger: Logger = new Logger('CryptoGateway');
  constructor(private readonly rateService: RateService) {}

  async afterInit(_server: Server) {
    this.logger.log('Initialized!');
  }

  // Here we are using the handleConnection method to handle when the client connects
  // so we will initiate the hearCollection method from the rateService that hear the
  // collection change stream and emits the rates to the client.
  async handleConnection(client: Socket, ...args: any[]) {
    this.logger.log('Connected!');
    this.rateService.hearCollection(client);
  }

  handleDisconnect(client: Socket) {
    this.logger.log('Client Disconected!');
  }

  // Here we are using the @SubscribeMessage decorator to create a handler
  // for the 'rates' event. The @SubscribeMessage decorator accepts an event
  // name as an argument. The handler will be executed when the client emits
  // the 'rates' event.
  @SubscribeMessage('rates')
  async getRates(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    const rates = await this.rateService.getRatesFromDb();
    client.emit('rates', rates);
  }
}

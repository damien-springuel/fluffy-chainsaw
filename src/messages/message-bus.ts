export interface Message {}

export interface Consumer{
  consume(message: Message): void
}
export class MessageBus {

  private consumersByMessageType: Map<{new ():Message}, Consumer[]> = new Map<{new ():Message}, Consumer[]>(); 

  subscribeConsumer(m: {new (...args: any[]): Message}, consumer: Consumer): void {
    if(this.consumersByMessageType.has(m)) {
      const consumers: Consumer[] | undefined = this.consumersByMessageType.get(m);
      consumers?.push(consumer);
    } 
    else {
      this.consumersByMessageType.set(m, [consumer]);
    }
  }

  dispatch(message: Message): void {
    const consumers = this.consumersByMessageType.get(Object.getPrototypeOf(message).constructor);
    consumers?.forEach(c => c.consume(message));
  }
}
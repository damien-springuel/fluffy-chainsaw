import { expect, test } from "vitest";
import { type Message, MessageBus } from "./message-bus";

test(`Dispatch messages to all consumers that subscribes to particular messages`, () => {
  class M1 implements Message {
    constructor(readonly m1field: string){}
  }
  class M2 implements Message {
    constructor(){}
  }
  class M3 implements Message {
    constructor(readonly m3string: string, readonly m3number: number){}
  }
  
  const mb = new MessageBus();

  const consumer1: Message[] = [];
  mb.subscribeConsumer(M1, {consume: (m) => consumer1.push(m)});
  
  const consumer2: Message[] = [];
  mb.subscribeConsumer(M1, {consume: (m) => consumer2.push(m)});
  
  const consumer3: Message[] = [];
  mb.subscribeConsumer(M2, {consume: (m) => consumer3.push(m)});
  
  const consumer4: Message[] = [];
  mb.subscribeConsumer(M3, {consume: (m) => consumer4.push(m)});

  mb.dispatch(new M1("testM1#1"));
  mb.dispatch(new M2());
  mb.dispatch(new M1("testM1#2"));
  mb.dispatch(new M3("testM3#1", 1));
  mb.dispatch(new M3("testM3#2", 2));
  mb.dispatch(new M1("testM1#3"));
  mb.dispatch(new M2());

  expect(consumer1, "consumer 1 received messages").to.deep.equal([new M1("testM1#1"), new M1("testM1#2"), new M1("testM1#3")])
  expect(consumer2, "consumer 2 received messages").to.deep.equal([new M1("testM1#1"), new M1("testM1#2"), new M1("testM1#3")])
  expect(consumer3, "consumer 3 received messages").to.deep.equal([new M2(), new M2()])
  expect(consumer4, "consumer 4 received messages").to.deep.equal([new M3("testM3#1", 1), new M3("testM3#2", 2)])
});

test(`Dispatch to no subscribers if no one subscribed to that message`, () => {
  class M1 implements Message {
    constructor(readonly m1field: string){}
  }
  
  class NoSubscriberMessage implements Message {
    constructor(readonly field: string){}
  }
  
  const mb = new MessageBus();
  
  const consumer1: Message[] = [];
  mb.subscribeConsumer(M1, {consume: (m) => consumer1.push(m)});

  mb.dispatch(new NoSubscriberMessage("field"));

  expect(consumer1, "consumer 1 received messages").to.deep.equal([]);
});
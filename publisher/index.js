"use strict";

const amqp = require("amqplib");
const queue = process.env.QUEUE || "hello";

const messageAmount = 10;
const wait = 400;

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function sleepLoop(number, cb) {
  while (number--) {
    await sleep(wait);

    cb();
  }
}

async function exitAfterSend() {
  await sleep(messageAmount * wait * 1.2);

  process.exit(0);
}

async function publisher() {
  const connection = await amqp.connect("amqp://localhost:5672");
  const channel = await connection.createChannel();

  // si no existe la cola, la crea
  await channel.assertQueue(queue);

  sleepLoop(messageAmount, () => {
    const message = {
      id: Math.random().toString(32).slice(2, 6),
      text: "Hello World ---",
    };

    const sent = channel.sendToQueue(
      queue,
      Buffer.from(JSON.stringify(message)),
      {
        // persistent: true
      }
    );

    sent
      ? console.log(`Sent to "${queue}" `, message)
      : console.log(`Failed message to "${queue}"`);
  });
}

publisher()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

exitAfterSend();

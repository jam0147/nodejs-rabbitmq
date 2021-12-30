'use strict'

const amqp = require('amqplib');
const queue = process.env.QUEUE || 'hello'

function intensiveOperation() {
    let i = le9
    while (i--) {}
}

async function subscriber() {
    const connection = await amqp.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();
  
    // si no existe la cola, la crea
    await channel.assertQueue(queue);

    channel.consume(queue, message => {
        const content = JSON.parse(message.content.toString());

        console.log(`Received message from ${queue}`);
        console.log(content);
    }, {
        noAck: true
    })

  }

  subscriber()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
  
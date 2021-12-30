'use strict'

const amqp = require('amqplib');
const queue = process.env.QUEUE || 'hello'

function intensiveOperation() {
    let i = 1000000000
    while (i--) {}
}

async function subscriber() {
    const connection = await amqp.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();
  
    // si no existe la cola, la crea
    await channel.assertQueue(queue);

    channel.consume(queue, message => {
        const content = JSON.parse(message.content.toString());

        intensiveOperation();

        console.log(`Received message from ${queue}`);
        console.log(content);

        channel.ack(message); // confirmation for remove message from queue
    })

  }

  subscriber()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
  
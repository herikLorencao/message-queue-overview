import {Component} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {structureForm} from "./forms/structure.form";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  structure: FormGroup;
  producers: Function[] = [];
  consumers: Function[] = [];
  messages: string[] = [];
  logger: string[] = [];
  producersCount = 0;
  consumersCount = 0;
  consumerExecutionTimeSeconds = 1;
  concurrentExecutionEnable = false;

  constructor(private readonly formBuilder: FormBuilder) {
    this.structure = this.formBuilder.group(structureForm);
  }

  generateStructure() {
    if (!this.structure.valid) {
      alert("Informe valores válidos!");
      this.structure.reset();
      return;
    }

    this.producersCount = this.structure.get('producersCount')?.value ?? 0;
    this.consumersCount = this.structure.get('consumersCount')?.value ?? 0;
    this.consumerExecutionTimeSeconds = this.structure.get('consumerExecutionTimeSeconds')?.value ?? 0;

    for (let i = 0; i < this.producersCount; i++) {
      const producerMethod = (position: number, timeout: number) => {
        setTimeout((_: any) => {
          this.messages.push(`Producer: ${position + 1} | Corpo Mensagem: ${timeout}`)
          this.logger.push(`Producer[${position + 1}] enviou uma mensagem`);
        }, timeout);
      }
      this.producers.push(producerMethod);
    }

    for (let i = 0; i < this.consumersCount; i++) {
      const consumerMethod = (position: number) => {
        const timeout = this.consumerExecutionTimeSeconds * 1000;
        setTimeout((_: any) => {
          let message = this.messages.shift();
          if (message)
            this.logger.push(`Consumer[${position + 1}] consumiu a mensagem`);
        }, timeout)
      }
      this.consumers.push(consumerMethod);
    }
  }

  toggleConcurrentExecution() {
    if (!this.structure.valid) {
      alert("Informe valores válidos!");
      return;
    }

    this.concurrentExecutionEnable = !this.concurrentExecutionEnable;

    if (this.concurrentExecutionEnable)
      this.concurrentExecution();
  }

  concurrentExecution() {
    for (let i = 0; i < 5; i++) {
      this.sendAllMessages();
      this.consumeAllMessages();
    }
  }

  sendAllMessages() {
    for (let i = 0; i < this.producersCount; i++) {
      const randomTimeout = Math.floor(Math.random() * 10) + 1;
      this.producers[i](i, randomTimeout);
    }
  }

  consumeAllMessages() {
    for (let i = 0; i < this.consumersCount; i++) {
      this.consumers[i](i);
    }
  }

  produceMessage(indexPosition: number) {
    const randomTimeout = Math.floor(Math.random() * 10) + 1;
    this.producers[indexPosition](indexPosition, randomTimeout);
  }

  consumeMessage(indexPosition: number) {
    this.consumers[indexPosition](indexPosition);
  }

  clearMessages() {
    this.messages = [];
  }

  clearLog() {
    this.logger = [];
  }

}

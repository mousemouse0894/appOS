import { Component, OnInit } from "@angular/core";
import { PCB } from "../class/pcb";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage implements OnInit {
  public pcb = new PCB();
  public timeCPU: number = 0;
  public queue: Array<any> = [];
  public terminate: Array<any> = [];
  public detailQueue: boolean = false;
  private countPCB: number = 0;

  constructor() {}

  ngOnInit(): void {
    this.runCPU();
  }

  public setTerminate(data: any, index: number): void {
    this.terminate.push(data);
    this.pcb.setTerminate(index);
    this.priorityQueue();
  }

  public setProcess(): void {
    this.countPCB += 1;
    this.pcb.setPCB({
      id: this.countPCB,
      status: "New",
      arrivalT: Math.floor(Math.random() * 5) + 1, //this.timeCPU,
      execueT: 0,
      waittingT: 0,
      ioT: 0,
      ioWattingT: 0,
      priority: Math.floor(Math.random() * 5) + 1,
      countPriority: 0
    });

    this.priorityQueue();
  }

  public runCPU(): void {
    setInterval(() => {
      for (let i = 0; i < this.pcb.getPCB().length; i++) {
        this.pcb.getPCB()[i].countPriority += 1;
        if (this.pcb.getPCB()[i].status == "New") {
          this.pcb.getPCB()[i].status = "Ready";
        }
        if (this.pcb.getPCB()[i].status == "Ready") {
          this.pcb.getPCB()[i].waittingT += 1;
        }
        if (this.pcb.getPCB()[i].countPriority == 10) {
          this.pcb.getPCB()[i].countPriority = 0;
          if (this.pcb.getPCB()[i].priority > 1) {
            this.pcb.getPCB()[i].priority -= 1;
            this.priorityQueue();
          }
        }
      }

      this.timeCPU += 1;
    }, 1000);
  }

  private priorityQueue(): void {
    let start;
    let end;

    this.queue = [...this.pcb.getPCB()];

    this.queue = this.queueSort(this.queue, "priority", 0, this.queue.length);
    for (let i = 0; i < this.queue.length; i++) {
      if (
        i + 1 < this.queue.length &&
        this.queue[i]["priority"] == this.queue[i + 1]["priority"]
      ) {
        start = i;
        while (
          i + 1 < this.queue.length &&
          this.queue[i]["priority"] == this.queue[i + 1]["priority"]
        ) {
          i++;
          end = i;
        }
        this.queue = this.queueSort(this.queue, "arrivalT", start, end + 1);
      }
    }
    // console.log(this.queue);
  }

  private queueSort(arr, key2, start, end) {
    for (let i = start + 1; i < end; i++) {
      let key = arr[i];
      let j = i - 1;
      while (j >= start && arr[j][key2] > key[key2]) {
        arr[j + 1] = arr[j];
        j = j - 1;
      }
      arr[j + 1] = key;
    }

    return arr;
  }
}

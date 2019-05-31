import { Component, OnInit } from "@angular/core";
import { PCB, dataPCB } from "../class/pcb";
import { async } from "q";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage implements OnInit {
  public pcb = new PCB();
  public timeCPU: number = 0;
  public queue: Array<dataPCB> = [];
  public terminate: Array<any> = [];
  public detailQueue: boolean = false;
  public avgWatting: number = 0;
  public avgTernaround: number = 0;
  constructor() {}

  ngOnInit(): void {
    this.runCPU();
  }

  public setTerminate(data: any, index: number): void {
    this.avgWatting = 0;
    this.avgTernaround = 0;
    this.terminate.push(data);
    this.pcb.setTerminate(index);
    this.priorityQueue();

    for (let i = 0; i < this.terminate.length; i++) {
      this.avgWatting += this.terminate[i].waittingT;
      this.avgTernaround += this.terminate[i].ternaroundT;
    }

    this.avgWatting /= this.terminate.length;
    this.avgTernaround /= this.terminate.length;
  }

  public setProcess(): void {
    this.pcb.setPCB({
      id: this.pcb.getPCB().length,
      status: "New",
      arrivalT: this.timeCPU,
      execueT: 0,
      waittingT: 0,
      ioT: 0,
      ioWattingT: 0,
      priority: Math.floor(Math.random() * 10) + 1,
      countPriority: 0,
      ternaroundT: 0
    });

    this.priorityQueue();
  }

  public runCPU(): void {
    setInterval(() => {
      for (let i = 0; i < this.pcb.getPCB().length; i++) {
        if (this.pcb.getPCB()[i].status == "New") {
          this.pcb.getPCB()[i].status = "Ready";
        }

        if (this.pcb.getPCB()[i].status == "Ready") {
          this.pcb.getPCB()[i].waittingT += 1;
          this.pcb.getPCB()[i].countPriority += 1;
        }

        if (this.pcb.getPCB()[i].status == "Running") {
          this.pcb.getPCB()[i].execueT += 1;
        }

        if (this.pcb.getPCB()[i].countPriority == 20) {
          this.pcb.getPCB()[i].countPriority = 0;
          this.pcb.getPCB()[i].priority -= 1;
          this.priorityQueue();
        }
      }

      for (
        let i = 1;
        this.queue.length > 1 &&
        this.queue[0].status != "Running" &&
        i < this.queue.length;
        i++
      ) {
        if (this.queue[i].status == "Running") {
          this.queue[i].status = "Ready";
          this.pcb.setReady(i);
        }
      }

      if (this.queue.length > 0) {
        this.queue[0].status = "Running";
        this.pcb.getPCB()[this.queue[0].id].status = "Running";
      }

      this.timeCPU += 1;
    }, 1000);
  }

  private priorityQueue(): void {
    let start;
    let end;
    this.queue = this.getNotAllElement([...this.pcb.getPCB()], "Terminate");
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

  private getNotAllElement(arr, val) {
    var indexes = [],
      i;
    for (i = 0; i < arr.length; i++)
      if (arr[i].status !== val) indexes.push(arr[i]);
    return indexes;
  }
}

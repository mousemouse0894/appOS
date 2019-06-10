import { Component, OnInit } from "@angular/core";
import { PCB } from "../class/pcb";
import { dataPCB } from "../interfaces/dataPCB";
import { dataTerminate } from "../interfaces/dataTerminate";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage implements OnInit {
  public pcb = new PCB();
  public timeCPU: number = 0;
  public queue: Array<dataPCB> = [];
  public terminate: Array<dataTerminate> = [];
  public io: Array<dataPCB> = [];
  public detailQueue: boolean = false;
  public avgWatting: number = 0;
  public avgTernaround: number = 0;
  public memory: number = 0;
  constructor() {}

  ngOnInit(): void {
    this.runCPU();
  }

  public pushIO(data: dataPCB): void {
    this.io.push(data);
    this.pcb.setWaitting(data.id);
    this.priorityQueue();
  }

  public popIO(): void {
    this.pcb.setReady(this.io[0].id);
    this.io.splice(0, 1);
    this.priorityQueue();
  }

  public setTerminate(data: any, index: number): void {
    this.avgWatting = 0;
    this.avgTernaround = 0;
    this.memory -= this.pcb.getPCB()[index].size
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
      ternaroundT: 0,
      size:Math.floor(Math.random() * 400) + 100
    });
    this.memory += this.pcb.getPCB()[this.pcb.getPCB().length-1].size
    this.priorityQueue();
  }

  private runCPU(): void {
    setInterval(() => {
      if (this.pcb.getPCB().length > 0) {
        // Array PCB
        for (let i = 0; i < this.pcb.getPCB().length; i++) {
          if (this.pcb.getPCB()[i].status == "New") {
            this.pcb.setReady(i);
          } else if (this.pcb.getPCB()[i].status == "Ready") {
            this.pcb.getPCB()[i].waittingT += 1;
            this.pcb.getPCB()[i].countPriority += 1;
            if (this.pcb.getPCB()[i].countPriority == 20) {
              this.pcb.getPCB()[i].countPriority = 0;
              if(this.pcb.getPCB()[i].priority > 1){
              this.pcb.getPCB()[i].priority -= 1;
              }
              this.priorityQueue();
            }
          } else if (this.pcb.getPCB()[i].status == "Running") {
            this.pcb.getPCB()[i].execueT += 1;
          }
        }
      }

      if (this.queue.length > 0) {
        // Array Queue
        this.queue[0].status = "Running";
        this.pcb.getPCB()[this.queue[0].id].status = "Running";
        for (let i = 1; i < this.queue.length; i++) {
          if (this.queue[i].status == "Running") {
            this.queue[i].status = "Ready";
            this.pcb.setReady(i);
          }
        }
      }

      if (this.io.length > 0) {
        // Array I/O
        this.pcb.getPCB()[this.io[0].id].ioT += 1;
        for (let i = 0; i < this.io.length; i++) {
          this.pcb.setWaitting(this.io[i].id);
          if (i > 0) {
            this.pcb.getPCB()[this.io[i].id].ioWattingT += 1;
          }
        }
      }

      if (this.terminate.length > 0) {
        // Array Terminate
        for (let i = 0; i < this.terminate.length; i++) {
          this.pcb.setTerminate(this.terminate[i].id);
        }
      }

      

      this.timeCPU += 1;
    }, 1000);
  }

  private priorityQueue(): void {
    let start: number;
    let end: number;
    this.queue = [];
    this.queue = this.getNotAllElement(
      [...this.pcb.getPCB()],
      "Waitting",
      "Terminate"
    );
    // console.log(this.queue);
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

  private queueSort(arr, key2, start, end): Array<dataPCB> {
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

  private getNotAllElement(arr, status1, status2): Array<dataPCB> {
    let indexes = [];
    for (let i = 0; i < arr.length; i++)
      if (arr[i].status != status1 && arr[i].status != status2)
        indexes.push(arr[i]);
    return indexes;
  }
}

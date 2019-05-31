export interface dataPCB {
  id: number;
  status: "New" | "Ready" | "Running" | "Waitting" | "Terminate";
  arrivalT: number;
  execueT: number;
  waittingT: number;
  ioT: number;
  ioWattingT: number;
  priority: number;
  countPriority: number;
}

export class PCB {
  private pcb: Array<dataPCB> = [];

  public getPCB(): Array<dataPCB> {
    return this.pcb;
  }

  public setPCB(data: dataPCB): void {
    this.pcb.push(data);
  }

  public setReady(index: number): void {
    this.pcb[index].status = "Ready";
  }

  public setTerminate(index: number): void {
    this.pcb[index].status = "Terminate";
    this.pcb.splice(index, 1);
  }
}

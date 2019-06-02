import { dataPCB } from '../interfaces/dataPCB';

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

  public setRunning(index: number): void {
    this.pcb[index].status = "Running";
  }

  public setWaitting(index: number): void {
    this.pcb[index].status = "Waitting";
  }

  public setTerminate(index: number): void {
    this.pcb[index].status = "Terminate";
    // this.pcb.splice(index, 1);
  }
}

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
  ternaroundT: number;
  size:number;
}

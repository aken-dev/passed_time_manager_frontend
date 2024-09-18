import { IsNotEmpty, IsNumber } from 'class-validator';

// Schedule Type
export enum ScheduleStatus {
  Active,
  Finished,
}

export class Schedule {
  @IsNotEmpty()
  public id: string
  @IsNotEmpty()
  public title: string
  public howmany: string
  @IsNotEmpty()
  @IsNumber()
  public days: number

  constructor(
    id: string,
    title: string,
    public description: string,
    howmany: string,
    days: number,
    public times: number,
    public doneDateTime: Date | null,
    public status: ScheduleStatus,
    public exid?: string
  ) {
    this.id=id;
    this.title = title;
    this.howmany=howmany;
    this.days=days;
  }
}

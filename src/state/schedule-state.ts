import { autobind } from '../decorators/autobind';
import { Schedule, ScheduleStatus } from '../models/schedule';
import { validate } from 'class-validator';
import axios from 'axios';
axios.defaults.baseURL = 'https://takeru.click:4000';

// Schedule State Management
type Listener<T> = (items: T[]) => void;

class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

export class ScheduleState extends State<Schedule> {
  private schedules: Schedule[] = [];
  private static instance: ScheduleState;

  private constructor() {
    super();
    this.getAllAxios();
    setInterval(this.updateListeners, 1000);
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ScheduleState();
    return this.instance;
  }

  getAllAxios(){
    axios.get("/api/v1/schedules").then((gotParams) => {
      const { data: GotSchedules } = gotParams;
      if(GotSchedules.length < 1) {
        console.log('やる事が一つもありません');
        return
      }
      GotSchedules.map((schedule: any) => {
        this.addSchedule(schedule._id, schedule.title, schedule.description, schedule.howmany, schedule.days, schedule.times, 
          schedule.status as ScheduleStatus, (schedule.doneDateTime ? new Date(schedule.doneDateTime) : undefined), schedule.exid)
        this.updateListeners();
      });
    });
  }
  deleteAxios(targetId: String){
    axios.delete(`/api/v1/schedules/${targetId}`).then((gotParams) => {
      const { data: GotSchedules } = gotParams;
      console.log(gotParams);
      if(GotSchedules.length < 1) {
        console.log('削除失敗');
        return false;
      }else{
        console.log('削除成功');
        return true
      }
    }
  )}
  updateAxios(sendingSchedule: Schedule){
    const body = {
      title: sendingSchedule.title,
      description: sendingSchedule.description,
      howmany: sendingSchedule.howmany,
      days: sendingSchedule.days,
      times: sendingSchedule.times,
      status: sendingSchedule.status as Number,
      doneDateTime: sendingSchedule.doneDateTime,
      exid: sendingSchedule.exid
    };
    console.log(['UpdateJSON', body])
    axios.patch(`/api/v1/schedules/${sendingSchedule.id}`, body).then((gotParams) => {
      const { data: GotSchedules } = gotParams;
      console.log(gotParams);
      if(GotSchedules.length < 1) {
        console.log('更新失敗');
        return false;
      }else{
        console.log('更新成功');
        return true
      }
    }
  )}
  addSchedule(id: string, title: string, description: string, howmany: string, days: number, times: number, 
    status: ScheduleStatus = ScheduleStatus.Active, doneDateTime?: Object, exid?: string) {
    const newSchedule = new Schedule(
      id,
      title,
      description,
      howmany,
      days,
      times,
      doneDateTime as Date,
      status,
      exid
    );
    if(newSchedule.id === 'unregistered'){
      validate(newSchedule).then(errors => {
        if(errors.length > 0){
          alert('入力値が正しくありません');
          console.log(['バリデーションエラー',errors]);
          return;
        }
        const body = {
          title: newSchedule.title, 
          description: newSchedule.description, 
          howmany: newSchedule.howmany, 
          days: newSchedule.days, 
          times: newSchedule.times, 
          status: newSchedule.status as Number, 
          doneDateTime: newSchedule.doneDateTime, 
          exid: newSchedule.exid
        };
        console.log(['CreateJSON', body]);
        axios.post("/api/v1/schedules", body).then((gotParams) => {
          const { data: PostResult } = gotParams;
          if(!PostResult || !PostResult._id) {
            console.log('送信できませんでした。');
            return
          }
          console.log(['追加した内容',PostResult]);
          newSchedule.id = PostResult._id;
        });
      });
    }
    this.schedules.push(newSchedule);
    this.updateListeners();
  };

  removeSchedule(scheduleId: string) {
    const schedule = this.schedules.find(prj => prj.id === scheduleId);
    if(schedule){
      const newSchedules: Schedule[] = this.schedules.filter(prj => prj.id !== scheduleId);
      this.schedules = newSchedules.slice();
      this.deleteAxios(scheduleId);
    }
  }

  moveSchedule(scheduleId: string, newStatus: ScheduleStatus) {
    const schedule = this.schedules.find(prj => prj.id === scheduleId);
    if (schedule && schedule.status !== newStatus) {
      if(newStatus === ScheduleStatus.Active){
        const targetSchedule = this.schedules.find(prj => prj.id === schedule.exid);
        if (targetSchedule && targetSchedule.doneDateTime && schedule.doneDateTime
           && targetSchedule.status === newStatus
            && targetSchedule.doneDateTime.getTime() - schedule.doneDateTime.getTime() === 0){
          targetSchedule.doneDateTime = null;
          this.updateAxios(targetSchedule);
        }
        this.removeSchedule(scheduleId);
      }else{
        schedule.doneDateTime = new Date();
        this.updateAxios(schedule);
        this.addSchedule('unregistered', schedule.title, schedule.description, schedule.howmany, schedule.days, schedule.times,
           ScheduleStatus.Finished, schedule.doneDateTime, schedule.id)
      }
      this.updateListeners();
    }
  }
  @autobind
  private updateListeners() {
    // this.schedules.sort((a, b) => {
    //   if(a.doneDateTime && b.doneDateTime){
    //     return b.doneDateTime.getTime() - a.doneDateTime.getTime();
    //   }else if(a.doneDateTime == null){
    //     return 1;
    //   }else if(b.doneDateTime == null){
    //     return -1;
    //   }
    //   return 0;
    // });
    for (const listenerFn of this.listeners) {
      listenerFn(this.schedules.slice());
    }
  }
}

export const scheduleState = ScheduleState.getInstance();

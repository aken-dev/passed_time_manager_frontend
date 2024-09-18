import { Draggable } from '../models/drag-drop';
import { Schedule, ScheduleStatus } from '../models/schedule';
import Component from './base-component';
import { autobind } from '../decorators/autobind';
import { scheduleState } from '../state/schedule-state';
import { DateCalc } from './date';

// ScheduleItem Class
export class ScheduleItem extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable {
  private schedule: Schedule;

  constructor(hostId: string, schedule: Schedule) {
    super('single-schedule', hostId, false, schedule.id);
    this.schedule = schedule;
    this.configure();
    this.renderContent();
  }

  @autobind
  clickHandler(_: MouseEvent) {
    console.log('MouseEvent');
  }

  @autobind
  dragStartHandler(event: DragEvent) {
    event.dataTransfer!.setData('text/plain', this.schedule.id);
    event.dataTransfer!.effectAllowed = 'move';
  }

  dragEndHandler(_: DragEvent) {
    console.log('Drag終了');
  }

  configure() {
    this.element.addEventListener('dragstart', this.dragStartHandler);
    this.element.addEventListener('dragend', this.dragEndHandler);
  }
  renderContent() {
    this.element.querySelector('h1')!.textContent = this.schedule.title;
    this.element.querySelector('h3')!.textContent = `${this.schedule.howmany}`;

    this.element.querySelector('p')!.textContent = this.schedule.description;
    import ('./date').then(date =>{
    if(this.schedule.status == ScheduleStatus.Finished){
        if(this.schedule.times && this.schedule.times != 0){
          this.element.querySelector('h4')!.textContent = `${this.schedule.days}日に${this.schedule.times}回`;
        }else{
          this.element.querySelector('h4')!.textContent = '随時';
        }
        if(this.schedule.doneDateTime){
          const time = `${date.DateCalc.getTime(this.schedule.doneDateTime)}`
          this.element.querySelector('h2')!.textContent = `${time} `;
        }
        this.element.querySelector('#status_change')!.textContent = 'やっぱりやってないよ';
        this.element.querySelector('#status_change')!.addEventListener('click', (() => {
          var result = window.confirm('この実施記録を取り消します');
          if(result){
            scheduleState.moveSchedule(this.schedule.id, ScheduleStatus.Active);
          }
        }), false);  
    }else{
      if(this.schedule.times && this.schedule.times != 0){
        this.element.querySelector('h4')!.textContent = 
        `${this.schedule.days}日に${this.schedule.times}回（
        ${
          DateCalc.getDiffTime(
            new Date(
              new Date().getTime()
              + ((24 * this.schedule.days) / this.schedule.times * 1000 * 60 * 60)
            ),
            new Date()
          )
        }ごと ）`;
        Math.floor((24 * this.schedule.days) / this.schedule.times)
      }else{
        this.element.querySelector('h4')!.textContent = '随時';
      }  
      if(this.schedule.doneDateTime){
         this.element.querySelector('h2')!.textContent = `前回から 
         ${date.DateCalc.getDiffTime(new Date(), this.schedule.doneDateTime as Date)} 経過`;
          let time_interval = ((24 * this.schedule.days) / this.schedule.times * 1000 * 60 * 60);
          let passed_time = new Date().getTime() - this.schedule.doneDateTime.getTime();
          let passed_rate = passed_time / time_interval;
         if(1.1 <= passed_rate){
          this.element.querySelector('h2')!.className = 'time_alert';
         }else if(0.8 <= passed_rate){
          this.element.querySelector('h2')!.className = 'time_active';
         }else if(0.5 > passed_rate){
          this.element.querySelector('h2')!.className = 'time_negative';
         }else{
          this.element.querySelector('h2')!.className = 'time_normal';
         }
      }
      const remove_btn = document.createElement('button');
      remove_btn.innerHTML = '✖︎';
      remove_btn.addEventListener('click', (() => {
        var result = window.confirm('この項目をリストから削除します。');
        if(result) scheduleState.removeSchedule(this.schedule.id);
      }), false);
      this.element.querySelector('#remove_button_target')!.appendChild(remove_btn);
      this.element.querySelector('#status_change')!.textContent = 'やったよ！';
      this.element.querySelector('#status_change')!.addEventListener('click', (() => {
        scheduleState.moveSchedule(this.schedule.id, ScheduleStatus.Finished);
      }), false);
    }
  })

  }
}

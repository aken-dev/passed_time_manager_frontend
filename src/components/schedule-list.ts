import { DragTarget } from '../models/drag-drop';
import { Schedule, ScheduleStatus } from '../models/schedule';
import Component from './base-component';
import { autobind } from '../decorators/autobind';
import { scheduleState } from '../state/schedule-state';
import { ScheduleItem } from './schedule-item';

// ScheduleList Class
export class ScheduleList extends Component<HTMLDivElement, HTMLElement>
  implements DragTarget {
  assignedSchedules: Schedule[];

  constructor(private type: 'todo-schedule' | 'todo-history') {
    super('schedule-list', 'app', false, `${type}-schedules`);
    this.assignedSchedules = [];

    this.configure();
    this.renderContent();
  }

  @autobind
  dragOverHandler(event: DragEvent) {
    if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
      event.preventDefault();
      const listEl = this.element.querySelector('ul')!;
      listEl.classList.add('droppable');
    }
  }

  @autobind
  dropHandler(event: DragEvent) {
    const prjId = event.dataTransfer!.getData('text/plain');
    scheduleState.moveSchedule(
      prjId,
      this.type === 'todo-schedule' ? ScheduleStatus.Active : ScheduleStatus.Finished,
    );
  }

  @autobind
  dragLeaveHandler(_: DragEvent) {
    const listEl = this.element.querySelector('ul')!;
    listEl.classList.remove('droppable');
  }

  configure() {
    this.element.addEventListener('dragover', this.dragOverHandler);
    this.element.addEventListener('drop', this.dropHandler);
    this.element.addEventListener('dragleave', this.dragLeaveHandler);

    scheduleState.addListener((schedules: Schedule[]) => {
      const relevantSchedules = schedules.filter(prj => {
        if (this.type === 'todo-schedule') {
          return prj.status === ScheduleStatus.Active;
        }
        return prj.status === ScheduleStatus.Finished;
      });
      this.assignedSchedules = relevantSchedules;
      this.renderSchedules();
    });
  }

  renderContent() {
    const listId = `${this.type}-schedules-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent =
      this.type === 'todo-schedule' ? 'やる事リスト' : '履歴';
  }

  private renderSchedules() {
    const listEl = document.getElementById(
      `${this.type}-schedules-list`,
    )! as HTMLUListElement;
    listEl.innerHTML = '';
    for (const prjItem of this.assignedSchedules) {
      new ScheduleItem(listEl.id, prjItem);
    }
  }
}

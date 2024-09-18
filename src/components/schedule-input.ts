import Cmp from './base-component';
import { autobind as Autobind } from '../decorators/autobind';
import { scheduleState } from '../state/schedule-state';

// ScheduleInput Class
export class ScheduleInput extends Cmp<HTMLDivElement, HTMLFormElement> {
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  howmanyInputElement: HTMLInputElement;
  timesInputElement: HTMLInputElement;
  daysInputElement: HTMLInputElement;

  constructor() {
    super('schedule-input', 'app', false, 'user-input');

    this.titleInputElement = this.element.querySelector(
      '#title',
    ) as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      '#description',
    ) as HTMLInputElement;
    this.howmanyInputElement = this.element.querySelector(
      '#howmany',
    ) as HTMLInputElement;
    this.daysInputElement = this.element.querySelector(
      '#days',
    ) as HTMLInputElement;
    this.timesInputElement = this.element.querySelector(
      '#times',
    ) as HTMLInputElement;

    this.configure();
  }

  configure() {
    this.element.addEventListener('submit', this.submitHandler);
  }

  renderContent() {}

  private gatherUserInput(): [string, string, string, number, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredHowmany = this.howmanyInputElement.value;
    const enteredDays = this.daysInputElement.value;
    const enteredTimes = this.timesInputElement.value;
    return [enteredTitle, enteredDescription, enteredHowmany, +enteredDays, +enteredTimes];
  
  }

  private clearInputs() {
    this.titleInputElement.value = '';
    this.descriptionInputElement.value = '';
    this.howmanyInputElement.value = '';
    this.daysInputElement.value = '';
    this.timesInputElement.value = '';
  }

  @Autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {
      const [title, desc, howmany, days, times] = userInput;
      scheduleState.addSchedule('unregistered', title, desc, howmany, days, times);
      this.clearInputs();
    }
  }
}

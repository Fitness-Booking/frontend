import { TimeSpan } from '../../tools/timeSpan';
export class SectionSchedule {
  constructor(
    id: number,
    sectionId: number,
    startHour: number,
    endHour: number
  ) {
    this.id = id;
    this.sectionId = sectionId;
    this.startHour = new TimeSpan(startHour);
    this.endHour = new TimeSpan(endHour);
  }

  id: number;
  sectionId: number;
  startHour: TimeSpan;
  endHour: TimeSpan;
}

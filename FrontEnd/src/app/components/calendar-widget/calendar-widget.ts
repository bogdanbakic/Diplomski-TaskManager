import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  fullDate: Date;
}

@Component({
  selector: 'app-calendar-widget',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar-widget.html',
  styleUrl: './calendar-widget.scss',
})
export class CalendarWidget implements OnInit, OnDestroy {
  now = signal(new Date());
  viewDate = signal(new Date());
  isExpanded = signal(false);
  private intervalId: any;

  weekDays = ['Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub', 'Ned'];

  monthYearLabel = computed(() => {
    return this.viewDate().toLocaleDateString('sr-Latn', { month: 'long', year: 'numeric' });
  });

  compactLabel = computed(() => {
    return this.now().toLocaleDateString('sr-Latn', { weekday: 'short', day: '2-digit', month: 'short' });
  });

  days = computed<CalendarDay[]>(() => {
    const view = this.viewDate();
    const year = view.getFullYear();
    const month = view.getMonth();
    const today = new Date();

    const firstOfMonth = new Date(year, month, 1);
    const firstWeekday = (firstOfMonth.getDay() + 6) % 7;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const result: CalendarDay[] = [];

    for (let i = firstWeekday - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      result.push({ date: dayNum, isCurrentMonth: false, isToday: false, fullDate: new Date(year, month - 1, dayNum) });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const fullDate = new Date(year, month, d);
      result.push({ date: d, isCurrentMonth: true, isToday: fullDate.toDateString() === today.toDateString(), fullDate });
    }

    while (result.length < 42) {
      const nextDay = result.length - (firstWeekday + daysInMonth) + 1;
      result.push({ date: nextDay, isCurrentMonth: false, isToday: false, fullDate: new Date(year, month + 1, nextDay) });
    }

    return result;
  });

  ngOnInit() {
    this.intervalId = setInterval(() => this.now.set(new Date()), 1000);
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  onMouseEnter() {
    this.isExpanded.set(true);
  }

  onMouseLeave() {
    this.isExpanded.set(false);
  }

  previousMonth() {
    const d = this.viewDate();
    this.viewDate.set(new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }

  nextMonth() {
    const d = this.viewDate();
    this.viewDate.set(new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  goToToday() {
    this.viewDate.set(new Date());
  }
}
import { Component, OnInit } from '@angular/core';
import { PollService } from '../poll.service';
import { Poll } from '../poll.models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-poll',
  imports: [CommonModule, FormsModule, DragDropModule, MatIconModule],
  templateUrl: './poll.component.html',
  styleUrl: './poll.component.css'
})
export class PollComponent implements OnInit {
  polls: Poll[] = [];
  newPoll: Poll = {
    question: '',
    options: [
       { voteOption: '', voteCount: 0 },
       { voteOption: '', voteCount: 0 }
    ]
  }

  ngOnInit() {
    this.loadPolls();
  }

  constructor(private pollService: PollService) { }

  loadPolls() {
    this.pollService.getPolls().subscribe({
      next: (polls) => {
        this.polls = polls;
        console.log('Fetched polls:', this.polls);
      },
      error: (error) => {
        console.error('Error fetching polls:', error);
      },
      complete: () => {
        console.log('Poll fetching completed');
      }
    });
  }

  createPolls() {
    console.log(this.newPoll.question)
    this.pollService.createPoll(this.newPoll).subscribe({
      next: (poll) => {
        console.log('Poll created:', poll);
      },
      error: (error) => {
        console.error('Error creating poll:', error);
      },
      complete: () => {
        console.log('Poll creation completed');
        this.resetPolls();
      }
    })
  }

  resetPolls() {
    this.polls = [];
    this.newPoll = {
      id: 0,
      question: '',
      options: [
        { voteOption: '', voteCount: 0 },
        { voteOption: '', voteCount: 0 },
      ]
    };
    this.loadPolls();
  }

  vote(pollId: number, optionIndex: number) {
    console.log('Vote for poll:', pollId, 'option:', optionIndex);
    this.pollService.vote(pollId, optionIndex).subscribe({
      next: () => {
        console.log('Vote recorded');
      },
      error: (error) => {
        console.error('Error recording vote:', error);
      },
      complete: () => {
        console.log('Vote recording completed');
        this.loadPolls();

      }
    })
  }

  addOption() {
    this.newPoll.options.push({ voteOption: '', voteCount: 0 });
  }

  removeOption(index: number) {
    if (this.newPoll.options.length > 2) {
      this.newPoll.options.splice(index, 1);
    } else {
      alert('At least two options are required.');
    }
  }

  onDragDrop(event: CdkDragDrop<any[]>) {
    const previousIndex = this.newPoll.options.findIndex((option) => option === event.item.data);
    moveItemInArray(this.newPoll.options, previousIndex, event.currentIndex);
    // moveItemInArray(this.newPoll.options, event.previousIndex, event.currentIndex);
  }

  trackByIndex(index: number): number {
    return index;
  }
}

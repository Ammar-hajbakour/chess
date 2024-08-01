import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MoveList } from '../../chess-logic/types';
import { NgClass } from '@angular/common';

@Component({
  selector: 'move-list',
  standalone: true,
  imports: [NgClass],
  templateUrl: './move-list.component.html',
  styleUrl: './move-list.component.scss'
})
export class MoveListComponent {
  @Input() moveList: MoveList = [];
  @Input() gameHistoryPointer: number = 0;
  @Input() gameHistoryLength: number = 1;
  @Output() showPreviousMove = new EventEmitter<number>();
  @ViewChild('mList') mList!: ElementRef<HTMLDivElement>;

  showPreviousMoveHandler(moveNumber: number) {
    this.showPreviousMove.emit(moveNumber);
  }

}

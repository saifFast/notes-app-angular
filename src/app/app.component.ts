import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'notes-app-saif';
  newNote: string = '';
  notes: Note[] = [];

  colors: string[] = [
    '#fff9c4', // Light Yellow
    '#c8e6c9', // Light Green
    '#ffe0b2', // Light Orange
    '#bbdefb', // Light Blue
    '#f8bbd0', // Light Pink
    '#d1c4e9', // Light Purple
    '#b2ebf2', // Light Cyan
  ];

  
  addNote(): void {
    if (this.newNote.trim()) {
      const noteColor = this.colors[Math.floor(Math.random() * this.colors.length)];
      this.notes.unshift({ text: this.newNote.trim(),  color: noteColor });
      this.newNote = '';
    }
  }
  deleteNote(index: number): void {
    this.notes.splice(index, 1);
  }

  editNote(index: number): void {
    this.notes[index].isEditing = true;
  }
  
  saveNote(index: number): void {
    this.notes[index].isEditing = false;
  }
}

interface Note {
  text: string;
  color: string;
  isEditing?: boolean;
}
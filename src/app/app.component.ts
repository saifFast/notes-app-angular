import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface Note {
  id: number;
  text: string;
  color: string;
  isEditing?: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'notes-app-saif';
  newNote = '';
  notes: Note[] = [];

  private storageKey = 'notes';

  colors: string[] = [
    '#fff9c4', // Light Yellow
    '#c8e6c9', // Light Green
    '#ffe0b2', // Light Orange
    '#bbdefb', // Light Blue
    '#f8bbd0', // Light Pink
    '#d1c4e9', // Light Purple
    '#b2ebf2', // Light Cyan
  ];

  ngOnInit(): void {
    this.loadFromStorage();
  }

  addNote(): void {
    const text = this.newNote.trim();
    if (!text) return;

    const noteColor = this.colors[Math.floor(Math.random() * this.colors.length)];
    const newNote: Note = { id: Date.now() + Math.floor(Math.random() * 1000), text, color: noteColor };

    this.notes = [newNote, ...this.notes];
    this.newNote = '';
    this.saveToStorage();
  }

  deleteNote(index: number): void {
    if (index < 0 || index >= this.notes.length) return;
    const idToRemove = this.notes[index].id;
    this.notes = this.notes.filter(n => n.id !== idToRemove);
    this.saveToStorage();
  }

  editNote(index: number): void {
    if (!this.notes[index]) return;
    this.notes[index] = { ...this.notes[index], isEditing: true };
    this.saveToStorage();
  }

  saveNote(index: number): void {
    if (!this.notes[index]) return;
    this.notes[index] = { ...this.notes[index], isEditing: false };
    this.saveToStorage();
  }

  trackById(_: number, note: Note): number {
    return note.id;
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.notes));
    } catch (e) {
      // ignore storage errors
    }
  }

  private loadFromStorage(): void {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Note[];
      this.notes = Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      this.notes = [];
    }
  }
}
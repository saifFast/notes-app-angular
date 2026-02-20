import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface Note {
  id: string;
  text: string;
  color: string;
  createdAt: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  readonly title = 'notes-app-saif';
  readonly colors = [
    '#fff9c4', // Light Yellow
    '#c8e6c9', // Light Green
    '#ffe0b2', // Light Orange
    '#bbdefb', // Light Blue
    '#f8bbd0', // Light Pink
    '#d1c4e9', // Light Purple
    '#b2ebf2', // Light Cyan
  ];

  newNote = '';
  editingNoteId: string | null = null;
  editingNoteText = '';
  notes: Note[] = [];

  private readonly storageKey = 'notes';
  private nextId = 0;

  ngOnInit(): void {
    this.loadFromStorage();
  }

  addNote(): void {
    const text = this.newNote.trim();
    if (!text) return;

    const newNote: Note = {
      id: this.generateId(),
      text,
      color: this.getRandomColor(),
      createdAt: Date.now()
    };

    this.notes = [newNote, ...this.notes];
    this.newNote = '';
    this.saveToStorage();
  }

  editNote(index: number): void {
    if (!this.isValidIndex(index)) return;
    
    const note = this.notes[index];
    this.editingNoteId = note.id;
    this.editingNoteText = note.text;
  }

  saveNote(): void {
    if (!this.editingNoteId) return;

    const text = this.editingNoteText.trim();
    if (!text) {
      this.cancelEdit();
      return;
    }

    const index = this.notes.findIndex(n => n.id === this.editingNoteId);
    if (index !== -1) {
      this.notes[index] = { ...this.notes[index], text };
      this.saveToStorage();
    }

    this.cancelEdit();
  }

  cancelEdit(): void {
    this.editingNoteId = null;
    this.editingNoteText = '';
  }

  deleteNote(id: string): void {
    this.notes = this.notes.filter(note => note.id !== id);
    this.saveToStorage();
  }

  isEditing(noteId: string): boolean {
    return this.editingNoteId === noteId;
  }

  trackById(_: number, note: Note): string {
    return note.id;
  }

  private getRandomColor(): string {
    return this.colors[Math.floor(Math.random() * this.colors.length)];
  }

  private generateId(): string {
    return `note-${++this.nextId}-${Date.now()}`;
  }

  private isValidIndex(index: number): boolean {
    return index >= 0 && index < this.notes.length;
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.notes));
    } catch (error) {
      console.error('Failed to save notes to storage:', error);
    }
  }

  private loadFromStorage(): void {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) {
        this.notes = [];
        return;
      }

      const parsed = JSON.parse(raw) as Note[];
      this.notes = Array.isArray(parsed) ? parsed : [];
      
      // Update nextId based on existing notes
      this.updateNextId();
    } catch (error) {
      console.error('Failed to load notes from storage:', error);
      this.notes = [];
    }
  }

  private updateNextId(): void {
    const ids = this.notes
      .map(note => {
        const match = note.id.match(/^note-(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
      });
    
    this.nextId = ids.length > 0 ? Math.max(...ids) : 0;
  }
}
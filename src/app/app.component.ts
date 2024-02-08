import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,ReactiveFormsModule,CommonModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {
  title = 'GestionScolarite';
  studentForm!: FormGroup;

  students: any[] = [];


  idControl: FormControl = new FormControl();
  mentionControl: FormControl = new FormControl();
  niveauControl: FormControl = new FormControl();

  constructor(private fb: FormBuilder) {
    this.studentForm = this.fb.group({
      id: this.idControl,
      nom: '',
      prenom: '',
      mention: this.mentionControl,
      niveau: this.niveauControl,
    });
  }



  ngOnInit() {
    if (typeof localStorage !== 'undefined') {
      const storedStudentsString = localStorage.getItem('students');
      this.students = storedStudentsString ? JSON.parse(storedStudentsString) : [];
    }
  }

  /* Ajout ou modification */
  addOrEditStudent() {
    const formData = this.studentForm.getRawValue();
    let id = formData.id;

    const storedStudentsString = localStorage.getItem('students');
    const storedStudents = storedStudentsString ? JSON.parse(storedStudentsString) : [];

    if (!id) {
      id = storedStudents.length + 1;
      formData.id = id;
      storedStudents.push(formData);
      /* mise a jour de la liste */

    } else {
      console.log('Il y a un ID');
      const existingStudentIndex = storedStudents.findIndex((student: { id: number }) => student.id === id);
      storedStudents[existingStudentIndex] = formData;
    }

    this.loadData(storedStudents)
    this.resetForm();
  }

  loadData(storedStudents : any){
    this.students = storedStudents;
    localStorage.setItem('students', JSON.stringify(storedStudents));
  }

  /* reset le formulaire */
  resetForm() {
    this.studentForm.reset();
    this.selectedMention = null;
    setTimeout(() => {
      this.updateStyles();
    }, 0);
  }

  /* show to modif */
  importToForm(student: any) {
    this.studentForm.patchValue({
      id: student.id,
      nom: student.nom,
      prenom: student.prenom,
      mention: student.mention,
      niveau: student.niveau
    });
    
  }



/* delete  */
deleteStudent(studentId: number) {
  this.students = this.students.filter(student => student.id !== studentId);
  this.students = this.students.map((student, index) => {
    return {
      ...student,
      id: index + 1
    };
  });

  localStorage.setItem('students', JSON.stringify(this.students));
}



  /* operation sur DOM */
  selectedMention: string | null = null;
  selectedNiveau: string | null = null;

  updateMention(mention: string) {
    this.selectedMention = mention;
    this.mentionControl.setValue(mention);
    this.updateStyles();
  }

  updateStyles() {
    if (this.mentionControl.value === '') {
      this.selectedMention = null; 
    }
  }


  updateNiveau(niveau: string){
    this.selectedNiveau = niveau;
    this.niveauControl.setValue(niveau);
  }

}

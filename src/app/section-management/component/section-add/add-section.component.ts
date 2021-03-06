import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CollegeModel} from '../../../shared/model/college-management/college-model';
import {DepartmentModel} from '../../../shared/model/department-management/department-model';
import {AcademicYear} from '../../../shared/model/academicYear-Management/academic-year';
import {AcademicTermModel} from '../../../shared/model/academicTerm-management/academic-term-model';
import {MajorModel} from '../../../shared/model/major-management/major-model';
import {StudyTypeModel} from '../../../shared/model/studyType-model';
import {CourseModel} from '../../../shared/model/course-management/course-model';
import {MatSelect} from '@angular/material/select';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {CollegeManagementService} from '../../../college-management/service/college-management.service';
import {DepartmentService} from '../../../department-management/service/department.service';
import {AcademicYearService} from '../../../academic-year-management/service/academic-year.service';
import {AcademicTermService} from '../../../academic-term-management/service/academic-term.service';
import {CourseManagementService} from '../../../course-management/service/course-management.service';
import {SectionModel} from '../../../shared/model/section-management/section-model';
import {SectionManagementService} from '../../service/sectionManagement.service';
import {Constants} from '../../../shared/constants';
import {
   StudentEnrollmentManagementService
} from '../../../studentEnrollment-management/service/studentEnrollment-management.service';
import {MatDialog} from '@angular/material/dialog';
import {BsModalService} from 'ngx-bootstrap/modal';

@Component({
   selector: 'app-section-add',
   templateUrl: './add-section.component.html',
   styleUrls: ['./add-section.component.css']
})
export class AddSectionComponent implements OnInit {

   private httpClient: HttpClient;
   section = new SectionModel();
   colleges: CollegeModel[];
   departments: DepartmentModel[];
   academicYears: AcademicYear[];
   academicTerms: AcademicTermModel[];
   courses: CourseModel[];
   majors: MajorModel[];
   studyTypes: StudyTypeModel[];
   errorMessage: string;
   form: FormGroup;
   isDisabled = true;

   @ViewChild('collegeSelect', {static: true}) collegeSelect: MatSelect;
   @ViewChild('departmentSelect', {static: true}) departmentSelect: MatSelect;
   @ViewChild('academicYearSelect', {static: true}) academicYearSelect: MatSelect;
   @ViewChild('academicTermSelect', {static: true}) academicTermSelect: MatSelect;
   @ViewChild('majorSelect', {static: true}) majorSelect: MatSelect;
   @ViewChild('studyTypeSelect', {static: true}) studyTypeSelect: MatSelect;
   @ViewChild('courseSelect', {static: true}) courseSelect: MatSelect;

   constructor(private sectionManagementService: SectionManagementService,
               private dialog: MatDialog,
               private snackBar: MatSnackBar,
               private modalService: BsModalService,
               private route: Router,
               private collegeManagementService: CollegeManagementService,
               private departmentService: DepartmentService,
               private academicYearService: AcademicYearService,
               private academicTermService: AcademicTermService,
               private majorService: StudentEnrollmentManagementService,
               private studyTypeService: StudentEnrollmentManagementService,
               private courseService: CourseManagementService,
               http: HttpClient) {
      this.httpClient = http;
   }

   ngOnInit(): void {
      this.academicYears = AcademicYearService.yearsList;
      this.academicTerms = AcademicTermService.academicTermsList;
      this.academicYearSelect.value = AcademicTermService.currentTerm.academicYearDTO;
      this.academicTermSelect.value = AcademicTermService.currentTerm;
      this.form = new FormGroup({
            academicYearMenu: new FormControl(AcademicTermService.currentTerm.academicYearDTO.id, Validators.required),
            academicTermMenu: new FormControl(AcademicTermService.currentTerm.id, Validators.required),
            collegeMenu: new FormControl(undefined, Validators.required),
            departmentMenu: new FormControl(undefined, Validators.required),
            majorMenu: new FormControl(undefined),
            studyTypeMenu: new FormControl(undefined, Validators.required),
            courseMenu: new FormControl(undefined, Validators.required),
            sectionNumber: new FormControl(undefined, Validators.compose([Validators.required,
               Validators.pattern(Constants.ENGLISH_CHARACTERS_AND_DIGITS_AND_DASH)])),
            theoreticalLectures: new FormControl(undefined, Validators.pattern(Constants.DIGITS_ONLY)),
            practicalLectures: new FormControl(undefined, Validators.pattern(Constants.DIGITS_ONLY)),
            exercisesLectures: new FormControl(undefined, Validators.pattern(Constants.DIGITS_ONLY)),
            capacity: new FormControl(undefined, Validators.compose([Validators.required,
               Validators.pattern(Constants.DIGITS_ONLY)]))
         }
      );

      this.collegeManagementService.getAllColleges().subscribe(Response => {
         this.colleges = Response;
      });

      this.studyTypeService.getAllStudyTypes().subscribe(Response => {
         this.studyTypes = Response;
      });

   }

   ngAfterViewInit(): void {
      this.academicYearSelect.valueChange.subscribe(value => {
         this.academicTerms = this.academicTermService.getAcademicTermsByAcademicYears(this.academicYearSelect.value);
      });

      this.collegeSelect.valueChange.subscribe(value => {
         if (this.collegeSelect.value !== undefined) {
            this.departmentSelect.setDisabledState(!this.isDisabled);
            this.departments = this.departmentService.getDepartmentsByCollege(this.collegeSelect.value.id);
         } else {
            this.departmentSelect.setDisabledState(this.isDisabled);
         }
      });

      this.departmentSelect.valueChange.subscribe(value => {
         if (this.departmentSelect.value !== undefined) {
            this.courseSelect.setDisabledState(!this.isDisabled);
            this.majorSelect.setDisabledState(!this.isDisabled);
            this.courseService.getCoursesByDepartment(this.departmentSelect.value.id).subscribe(value1 => {
               this.courses = value1;
            });
            this.majorService.getMajorsByDepartment(this.departmentSelect.value.id).subscribe(value1 => {
               this.majors = value1;
            });
         } else {
            this.courseSelect.setDisabledState(this.isDisabled);
            this.majorSelect.setDisabledState(this.isDisabled);
         }
      });

   }

   add(): void {
      if (this.form.valid) {
         this.section.academicYearDTO = new AcademicYear();
         this.section.academicYearDTO.id = this.form.get('academicYearMenu')?.value;
         this.section.academicTermDTO = new AcademicTermModel();
         this.section.academicTermDTO.id = this.form.get('academicTermMenu')?.value;
         this.section.collegeDTO = this.form.get('collegeMenu')?.value;
         this.section.departmentDTO = this.form.get('departmentMenu')?.value;
         this.section.majorDTO = this.form.get('majorMenu')?.value;
         this.section.studyTypeDTO = this.form.get('studyTypeMenu')?.value;
         this.section.courseDTO = this.form.get('courseMenu')?.value;
         this.section.sectionNumber = this.form.get('sectionNumber')?.value;
         this.section.theoreticalLectures = this.form.get('theoreticalLectures')?.value;
         this.section.practicalLectures = this.form.get('practicalLectures')?.value;
         this.section.exercisesLectures = this.form.get('exercisesLectures')?.value;
         this.section.capacity = this.form.get('capacity')?.value;
      }

      this.sectionManagementService.save(this.section).subscribe((Response) => {
            this.snackBar.open('Section Added Successfully', undefined, {
               duration: 2000,
               panelClass: 'successSnackBar'
            });
            sessionStorage.setItem('sectionData', JSON.stringify(Response));
            this.route.navigate(['/sections-management', 'section-edit']);
         }, error => {
            console.log(this.section);
            const formControl = this.form.get(error.error.field);
            this.errorMessage = error.error.message;
            if (formControl) {
               formControl.setErrors({
                  serverError: true
               });
            }
            this.snackBar.open('Failed To Add Section', undefined, {duration: 2000});
         }
      );

   }

   cancel(): void {
      this.route.navigate(['/sections-management', 'section-list']);
   }
}

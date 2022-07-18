import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {StudentEnrollmentModel} from '../../../shared/model/studentEnrollment-management/student-enrollment-model';
import {CollegeModel} from '../../../shared/model/college-management/college-model';
import {DepartmentModel} from '../../../shared/model/department-management/department-model';
import {AcademicYear} from '../../../shared/model/academicYear-Management/academic-year';
import {AcademicTermModel} from '../../../shared/model/academicTerm-management/academic-term-model';
import {MajorModel} from '../../../shared/model/major-model';
import {StudyTypeModel} from '../../../shared/model/studyType-model';
import {CourseModel} from '../../../shared/model/course-management/course-model';
import {SectionModel} from '../../../shared/model/section-management/section-model';
import {MatSelect} from '@angular/material/select';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {StudentEnrollmentManagementService} from '../../service/studentEnrollment-management.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {CollegeManagementService} from '../../../college-management/service/college-management.service';
import {DepartmentService} from '../../../department-management/service/department.service';
import {AcademicYearService} from '../../../academic-year-management/service/academic-year.service';
import {AcademicTermService} from '../../../academic-term-management/service/academic-term.service';
import {CourseManagementService} from '../../../course-management/service/course-management.service';
import {StudentModel} from '../../../shared/model/student-management/student-model';
import {PageRequest} from '../../../shared/model/page-request';
import {Subscription} from 'rxjs';
import {SelectionModel} from '@angular/cdk/collections';
import {StudentManagementService} from '../../../student-management/service/student-management.service';
import {StudentRequestModel} from '../../../shared/model/student-management/student-request-model';
import {SectionRequestModel} from '../../../shared/model/section-management/section-request-model';
import {SectionManagementService} from '../../../section-management/service/sectionManagement.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {Sort} from '@angular/material/sort';
import {Constants} from '../../../shared/constants';

@Component({
   selector: 'app-studentEnrollment-add',
   templateUrl: './add-student-enrollment.component.html',
   styleUrls: ['./add-student-enrollment.component.css']
})
export class AddStudentEnrollmentComponent implements OnInit {

   constructor(private studentEnrollmentManagementService: StudentEnrollmentManagementService,
               private snackBar: MatSnackBar,
               private route: Router,
               private collegeManagementService: CollegeManagementService,
               private departmentService: DepartmentService,
               private academicYearService: AcademicYearService,
               private academicTermService: AcademicTermService,
               private majorService: StudentEnrollmentManagementService,
               private studyTypeService: StudentEnrollmentManagementService,
               private courseService: CourseManagementService,
               private sectionService: SectionManagementService,
               private studentService: StudentManagementService,
               http: HttpClient) {
      this.httpClient = http;
   }

   private httpClient: HttpClient;
   studentEnrollment = new StudentEnrollmentModel();
   colleges: CollegeModel[];
   departments: DepartmentModel[];
   academicYears: AcademicYear[];
   academicTerms: AcademicTermModel[];
   majors: MajorModel[];
   studyTypes: StudyTypeModel[];
   courses: CourseModel[];
   sections: SectionModel[];
   sectionRequestModel = new SectionRequestModel();
   students: StudentModel[];
   studentFilterModel: StudentRequestModel = new StudentRequestModel();
   levels: string[] = Constants.LEVELS;
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
   @ViewChild('sectionSelect', {static: true}) sectionSelect: MatSelect;
   @ViewChild('levelSelect', {static: true}) levelSelect: MatSelect;

   @ViewChild('paginator') paginator: MatPaginator;
   tableData = new PageRequest<StudentModel>();
   displayedColumns: string[] = ['select', 'No.', 'university_id', 'name_en', 'Level'];
   dataSource = new MatTableDataSource<StudentModel>(this.tableData.data);
   selection = new SelectionModel<StudentModel>(true, []);
   pageIndex = 0;
   defaultPgeSize = 10;

   isAllSelected(): any {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
   }

   masterToggle(): any {
      this.isAllSelected() ?
         this.selection.clear() :
         this.dataSource.data.forEach(row => this.selection.select(row));
   }

   select(row: StudentModel): any {
      this.selection.select(row);
      console.log(this.selection.selected);
   }

   pop(row: StudentModel): any {
      this.selection.deselect(row);
      console.log(this.selection.selected);
   }

   selectAll(): any {
      this.tableData.data.forEach(row => this.selection.select(row));
      console.log(this.selection.selected);
   }

   clearAll(): any {
      this.selection.clear();
      console.log('cleared' + this.selection.selected);
   }

   ngOnInit(): void {
      this.subscriptions();
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
            sectionMenu: new FormControl(undefined, Validators.required)
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
            this.studentFilterModel.collegeId = this.collegeSelect.value.id;
            this.studentService.searchStudents(0, 100, this.studentFilterModel).subscribe(Response => {
               this.tableData = Response;
            });
            console.log(this.studentFilterModel);
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
            this.studentFilterModel.departmentId = this.departmentSelect.value.id;
            this.studentService.searchStudents(0, 100, this.studentFilterModel).subscribe(Response => {
               this.tableData = Response;
            });
         } else {
            this.courseSelect.setDisabledState(this.isDisabled);
            this.majorSelect.setDisabledState(this.isDisabled);
         }
      });

      this.courseSelect.valueChange.subscribe(value => {
         if (this.courseSelect.value !== undefined) {
            this.sectionSelect.setDisabledState(!this.isDisabled);
            this.sectionRequestModel.filterCourse = this.courseSelect.value.id;
            console.log(this.courseSelect.value.id);
            this.sectionService.searchSections(0, 500, this.sectionRequestModel)
               .subscribe(Response => {
                  this.sections = Response.data;
                  console.log(this.sections);
               });
         } else {
            this.sectionSelect.setDisabledState(this.isDisabled);
         }
      });

      this.levelSelect.valueChange.subscribe(value => {
         this.studentFilterModel.level = this.levelSelect.value;
         this.studentService.searchStudents(0, 100, this.studentFilterModel).subscribe(Response => {
            this.tableData = Response;
         });
      });
   }

   add(): void {
      if (this.form.valid) {
         console.log(this.form.get('academicYearMenu')?.value);
         this.studentEnrollment.academicYearDTO = new AcademicYear();
         this.studentEnrollment.academicYearDTO.id = this.form.get('academicYearMenu')?.value;
         this.studentEnrollment.academicTermDTO = new AcademicTermModel();
         this.studentEnrollment.academicTermDTO.id = this.form.get('academicTermMenu')?.value;
         this.studentEnrollment.collegeDTO = new CollegeModel();
         this.studentEnrollment.collegeDTO = this.form.get('collegeMenu')?.value;
         this.studentEnrollment.departmentDTO = new DepartmentModel();
         this.studentEnrollment.departmentDTO = this.form.get('departmentMenu')?.value;
         this.studentEnrollment.majorDTO = new MajorModel();
         this.studentEnrollment.majorDTO = this.form.get('majorMenu')?.value;
         this.studentEnrollment.studyTypeDTO = new StudyTypeModel();
         this.studentEnrollment.studyTypeDTO = this.form.get('studyTypeMenu')?.value;
         this.studentEnrollment.courseDTO = new CourseModel();
         this.studentEnrollment.courseDTO = this.form.get('courseMenu')?.value;
         this.studentEnrollment.sectionDTO = new SectionModel();
         this.studentEnrollment.sectionDTO = this.form.get('sectionMenu')?.value;
         console.log(this.studentEnrollment);
      }
      this.students = this.selection.selected;
      console.log(this.students);
      const available = this.form.get('sectionMenu')?.value.capacity - this.form.get('sectionMenu')?.value.numberOfStudents;
      if (this.students.length > available) {
         this.snackBar.open('Failed To Enroll Students, section"s capacity is FULL', undefined, {duration: 5000});
         return;
      }
      if (this.students.length === 0) {
         this.snackBar.open('Failed To Enroll Students, Add at least one student!', undefined, {duration: 5000});
         return;
      }
      this.studentEnrollmentManagementService.addStudentEnrollment(this.studentEnrollment, this.students).subscribe((Response) => {
            this.snackBar.open('Student Enrolled Successfully', undefined, {
               duration: 2000,
               panelClass: 'successSnackBar'
            });
            this.route.navigate(['/studentEnrollments-management', 'studentEnrollment-list']);
         }, error => {
            console.log(this.studentEnrollment);
            const formControl = this.form.get(error.error.field);
            this.errorMessage = error.error.message;
            console.log(error.error.field + ' field ' + this.errorMessage);
            if (error.error.field === 'exists') {
               // console.log(error.error.field + ' field ');
               this.snackBar.open(this.errorMessage, undefined, {duration: 5000});
            } else {
               if (formControl) {
                  formControl.setErrors({
                     serverError: true
                  });
               }
               this.snackBar.open('Failed To Enroll Student', undefined, {duration: 2000});
            }

         }
      );
   }

   cancel(): void {
      this.route.navigate(['/studentEnrollments-management', 'studentEnrollment-list']);
   }

   pageChangeEvent(event: PageEvent): void {
      this.studentService.searchStudents(event.pageIndex, event.pageSize, this.studentFilterModel)
         .subscribe(value => {
            this.tableData = value;
         });
   }

   private subscriptions(): Subscription[] {
      const subscriptions = [];
      subscriptions.push(this.initialDataSubscription());
      subscriptions.push(this.filterEventSubscription());
      return subscriptions;
   }

   private filterEventSubscription(): Subscription {
      return this.studentService.studentFilterEvent
         .subscribe(value => {
            this.studentFilterModel = value;
            this.studentService.searchStudents
            (0, 500, this.studentFilterModel)
               .subscribe(filteredData => {
                  this.tableData = filteredData;
               });
         });
   }

   private initialDataSubscription(): Subscription {
      const filter = new StudentRequestModel();

      return this.studentService
         .searchStudents(0, 500, filter).subscribe(value => {
            this.tableData = value;
         });
   }

   sortEvent($event: Sort): void {
      this.studentFilterModel = this.studentService
         .constructStudentRequestObject($event, this.studentFilterModel);
      this.studentService.searchStudents(this.paginator
         .pageIndex, this.paginator.pageSize, this.studentFilterModel).subscribe(value => {
         this.tableData = value;
      });
   }

   applyFilter(): void {
      this.studentService.studentFilterEvent.next(this.studentFilterModel);
   }

}

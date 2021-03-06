import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {CollegeModel} from '../../../shared/model/college-management/college-model';
import {DepartmentModel} from '../../../shared/model/department-management/department-model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CollegeManagementService} from '../../../college-management/service/college-management.service';
import {MatSelect} from '@angular/material/select';
import {DepartmentService} from '../../../department-management/service/department.service';
import {AcademicYear} from '../../../shared/model/academicYear-Management/academic-year';
import {AcademicTermModel} from '../../../shared/model/academicTerm-management/academic-term-model';
import {CourseModel} from '../../../shared/model/course-management/course-model';
import {Router} from '@angular/router';
import {AcademicYearService} from '../../../academic-year-management/service/academic-year.service';
import {AcademicTermService} from '../../../academic-term-management/service/academic-term.service';
import {CourseManagementService} from '../../../course-management/service/course-management.service';
import {TimetableModel} from '../../../shared/model/timetable-management/timetable-model';
import {FacultyMemberModel} from '../../../shared/model/facultyMember-management/facultyMember-model';
import {LectureTypeModel} from '../../../shared/model/lectureType-model';
import {BuildingModel} from '../../../shared/model/building-management/building-model';
import {ClassroomModel} from '../../../shared/model/classroom-management/classroom-model';
import {TimetableManagementService} from '../../service/timetable-management.service';
import {
   FacultyMemberManagementService
} from '../../../facultyMember-management/service/facultyMember-management.service';
import {BuildingManagementService} from '../../../building-management/service/building-management.service';
import {ClassroomManagementService} from '../../../classroom-management/service/classroom-management.service';
import {Constants} from '../../../shared/constants';

@Component({
   selector: 'app-section-timetable-edit',
   templateUrl: './edit-section-timetable.component.html',
   styleUrls: ['./edit-section-timetable.component.css']
})
export class EditSectionTimetableComponent implements OnInit {

   timetable = new TimetableModel();
   colleges: CollegeModel[];
   college = new CollegeModel();
   departments: DepartmentModel[];
   department = new DepartmentModel();
   academicYears: AcademicYear[];
   academicYear = new AcademicYear();
   academicTerms: AcademicTermModel[];
   academicTerm = new AcademicTermModel();
   facultyMember = new FacultyMemberModel();
   facultyMembers: FacultyMemberModel[];
   courses: CourseModel[];
   course = new CourseModel();
   lectureType = new LectureTypeModel();
   lectureTypes: LectureTypeModel[];
   building = new BuildingModel();
   buildings: BuildingModel[];
   classroom = new ClassroomModel();
   classrooms: ClassroomModel[];
   day: string;
   days: string[] = Constants.Days;
   startTime: string;
   endTime: string;
   errorMessage: string;
   form: FormGroup;

   @ViewChild('collegeSelect', {static: true}) collegeSelect: MatSelect;
   @ViewChild('departmentSelect', {static: true}) departmentSelect: MatSelect;
   @ViewChild('academicYearSelect', {static: true}) academicYearSelect: MatSelect;
   @ViewChild('academicTermSelect', {static: true}) academicTermSelect: MatSelect;
   @ViewChild('facultyMemberSelect', {static: true}) facultyMemberSelect: MatSelect;
   @ViewChild('courseSelect', {static: true}) courseSelect: MatSelect;
   @ViewChild('lectureTypeSelect', {static: true}) lectureTypeSelect: MatSelect;
   @ViewChild('buildingSelect', {static: true}) buildingSelect: MatSelect;
   @ViewChild('classroomSelect', {static: true}) classroomSelect: MatSelect;
   @ViewChild('daySelect', {static: true}) daySelect: MatSelect;

   constructor(@Inject(MAT_DIALOG_DATA) public data: TimetableModel,
               private timetableManagementService: TimetableManagementService,
               private snackBar: MatSnackBar,
               private route: Router,
               private collegeManagementService: CollegeManagementService,
               private departmentService: DepartmentService,
               private academicYearService: AcademicYearService,
               private academicTermService: AcademicTermService,
               private facultyMemberService: FacultyMemberManagementService,
               private courseService: CourseManagementService,
               private lectureTypeService: TimetableManagementService,
               private buildingService: BuildingManagementService,
               private classroomService: ClassroomManagementService) {
   }

   ngOnInit(): void {
      this.timetable = this.data;
      console.log(this.timetable);
      this.form = new FormGroup({
            facultyMemberMenu: new FormControl(this.data.facultyMemberDTO.id, Validators.required),
            lectureTypeMenu: new FormControl(this.data.lectureTypeDTO.id, Validators.required),
            buildingMenu: new FormControl(this.data.buildingDTO.id, Validators.required),
            classroomMenu: new FormControl(this.data.classroomDTO.id, Validators.required),
            dayMenu: new FormControl(this.data.day, Validators.required),
            startTime: new FormControl(this.data.startTime, Validators.required),
            endTime: new FormControl(this.data.endTime, Validators.required)
         }
      );
      console.log(this.data);

      this.academicYear = this.data.academicYearDTO;
      this.academicTerm = this.data.academicTermDTO;
      this.college = this.data.collegeDTO;
      this.department = this.data.departmentDTO;
      this.facultyMember = this.data.facultyMemberDTO;
      this.course = this.data.courseDTO;
      this.lectureType = this.data.lectureTypeDTO;
      this.building = this.data.buildingDTO;
      this.classroom = this.data.classroomDTO;
      this.day = this.data.day;
      this.startTime = this.data.startTime;
      this.endTime = this.data.endTime;

      this.academicYears = AcademicYearService.yearsList;
      this.academicTerms = this.academicTermService.getAcademicTermsByAcademicYears(this.academicYear.id);

      this.collegeManagementService.getAllColleges().subscribe(Response => {
         this.colleges = Response;
      });
      this.buildingService.getBuildingsByCollegeId(this.college.id).subscribe(value => {
         this.buildings = value;
      });
      this.classroomService.getClassroomsByBuilding(this.building.id).subscribe(value => {
         this.classrooms = value;
      });
      this.departments = this.departmentService.getDepartmentsByCollege(this.college.id);
      this.facultyMemberService.getFacultyMembersByCollege(this.college.id).subscribe(value => {
         this.facultyMembers = value;
      });
      this.courseService.getCoursesByDepartment(this.department.id).subscribe(value => {
         this.courses = value;
      });
      this.lectureTypeService.getAllLectureTypes().subscribe(Response => {
         this.lectureTypes = Response;
      });
   }

   ngAfterViewInit(): void {
      this.buildingSelect.valueChange.subscribe(_ => {
         if (this.buildingSelect.value !== undefined) {
            this.classroomSelect.setDisabledState(false);
            this.classroomService.getClassroomsByBuilding(this.buildingSelect.value).subscribe(value => {
               this.classrooms = value;
            });
         } else {
            this.classroomSelect.setDisabledState(true);
         }
      });
   }

   update(): void {
      if (this.form.valid) {
         this.timetable.facultyMemberDTO.id = this.form.get('facultyMemberMenu')?.value;
         this.timetable.lectureTypeDTO.id = this.form.get('lectureTypeMenu')?.value;
         this.timetable.buildingDTO.id = this.form.get('buildingMenu')?.value;
         this.timetable.classroomDTO.id = this.form.get('classroomMenu')?.value;
         this.timetable.day = this.form.get('dayMenu')?.value;
         this.timetable.startTime = this.form.get('startTime')?.value;
         this.timetable.endTime = this.form.get('endTime')?.value;
         console.log(this.timetable);
      }
      if (this.form.get('startTime')?.value > this.form.get('endTime')?.value) {
         this.snackBar.open('End Time must be greater than Start Time!', undefined, {duration: 3500});
         return;
      }
      this.timetableManagementService.timetableUpdateEvent.next(this.timetable);
   }

   cancel(): void {
      this.timetableManagementService.timetableUpdateEvent.next(this.timetable);
   }
}

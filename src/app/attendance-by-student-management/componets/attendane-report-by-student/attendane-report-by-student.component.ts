import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AttendaneReportByLectureService } from 'src/app/attendance-by-lecture-management/service/attendane-report-by-lecture.service';
import { AttendanceReportByStudentManagementModel } from 'src/app/shared/model/attendanceReportByStudent-management/attendance-report-by-Student-management-model';
import { AttendanceStudentReportRequestModel } from 'src/app/shared/model/attendanceReportByStudent-management/attendance-Studentreport-request-model';
import { AttendaneReportByStudentService } from '../../service/attendane-report-by-student.service';

@Component({
  selector: 'app-attendane-report-by-student',
  templateUrl: './attendane-report-by-student.component.html',
  styleUrls: ['./attendane-report-by-student.component.css']
})
export class AttendaneReportByStudentComponent implements OnInit {
  dataSource: MatTableDataSource<AttendanceReportByStudentManagementModel>;
  tableData: AttendanceReportByStudentManagementModel[];
  attendanceStudentReportRequest :AttendanceStudentReportRequestModel=new AttendanceStudentReportRequestModel();
  displayedColumns = ['nameOfStudent', 'absentLecture','rate','statues', 'Actions'];
  pageIndex = 1;
  defaultPageSize = 10;
  subscriptionsList: Subscription[] = [];
  attendanceReportBystudent = new AttendanceReportByStudentManagementModel();
  attendanceReport : AttendanceReportByStudentManagementModel[];
  subscription: Subscription;
  searchValue: string;
  filterValue: null;
  sectionId:string|null;
  student: AttendanceReportByStudentManagementModel;
  CoursName:string|null;
  SectionName:string|null;
  numberOflectures :number;
  totalLectures:number;
  statues:string;
  totalRate=0;
  attendanceRate:number;
  numberOfStudents:number;
  

  @ViewChild(MatPaginator, {static: false})
  set paginator(value: MatPaginator) {
    if (this.dataSource) {
      this.dataSource.paginator = value;
    }
  }

  @ViewChild(MatSort, {static: false})
  set sort(value: MatSort) {
    if (this.dataSource) {
      this.dataSource.sort = value;
    }
  }
  constructor(private lectureReportService : AttendaneReportByLectureService,
    private studentReportService : AttendaneReportByStudentService,
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    public dialog: MatDialog) { }
  ngOnInit(): void {
    // @ts-ignore

    // this.subscriptions();
  }
  ngAfterViewInit():void{
    this.dataSource=new MatTableDataSource<AttendanceReportByStudentManagementModel>();
    this.subscriptions();
  }
  private subscriptions(): Subscription[] {
    this.subscriptionsList.push(this.filterEventSubscription());
   return this.subscriptionsList;
  }
  private filterEventSubscription(): Subscription {
    return this.studentReportService.attendanceReportByStudentFilterEvent
    .subscribe(value => {
      this.attendanceStudentReportRequest = value;
      this.sectionId=String(this.attendanceStudentReportRequest.filterSection) ;

      this.studentReportService
        .getStudentReport(this.attendanceStudentReportRequest.filterSection)
        .subscribe(filteredData => {
          this.tableData = filteredData;
          console.log(filteredData);
          this.dataSource.data=this.tableData;
          this.numberOflectures=filteredData[0].numberOfLecture
          this.totalRate=0;
          for (let i = 0; i < filteredData.length; i++) {
            
            
          
          if(filteredData[i].rate>=25){
          filteredData[i].statues="Banned"
          }
          else if(filteredData[i].rate>=15 && filteredData[i].rate<25){
            filteredData[i].statues="Alert"
          }
          else if(filteredData[i].rate<15){
            filteredData[i].statues="Allowed"
          }
           this.totalRate+=filteredData[i].rate;
           
        }
        this.numberOfStudents=filteredData.length;
        console.log('Rate'+this.totalRate)
        this.attendanceRate = this.totalRate / this.numberOfStudents;
            console.log('Rate'+ this.attendanceRate)
        });
        this.lectureReportService.getsection(this.attendanceStudentReportRequest.filterSection).subscribe(data=>{
          this.CoursName=data.courseDTO.nameEn;
          this.SectionName=data.sectionNumber;
          this.totalLectures=data.exercisesLectures+data.practicalLectures+data.theoreticalLectures
          console.log('Total Lectures'+this.totalLectures)
        });
    });
  }
  
  details(student : AttendanceReportByStudentManagementModel):void
  {
this.router.navigateByUrl(`/attendancereportsbystudent-management/attendane-details-by-student/${this.sectionId}/${student.idOfStudent}
/${student.nameOfStudent}/${this.CoursName}/${this.SectionName}`)
// this.router.navigateByUrl(`/attendancereportsbystudent-management/attendane-details-by-student/
// ${1}/${1}`)

  }

}

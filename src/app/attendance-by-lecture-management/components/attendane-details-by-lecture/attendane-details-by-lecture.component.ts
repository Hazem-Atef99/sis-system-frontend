import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Time } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { EditStatuesComponent } from 'src/app/attendance-by-lecture-management/components/edit-statues/edit-statues.component';
import { AttendanceReportByLectureManagementModel } from 'src/app/shared/model/attendanceReportByLecture-management/attendance-report-by-lecture-management-model';
import { AttendanceReportRequestModel } from 'src/app/shared/model/attendanceReportByLecture-management/attendance-report-request-model';
import { AttendanceDetailsModel } from 'src/app/shared/model/student-attendance/attendanceDetails-model';
import { StudentModel } from 'src/app/shared/model/student-management/student-model';
import { AttendaneReportByLectureService } from '../../service/attendane-report-by-lecture.service';

@Component({
  selector: 'app-attendane-details-by-lecture',
  templateUrl: './attendane-details-by-lecture.component.html',
  styleUrls: ['./attendane-details-by-lecture.component.css']
})
export class AttendaneDetailsByLectureComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  tableData: AttendanceDetailsModel[];
  attendancceReportRequest :AttendanceReportRequestModel=new AttendanceReportRequestModel();
  displayedColumns = ['universityId', 'nameAr','attendanceStatus', 'Actions'];
  universityId: number[]=[];
  nameAr: string[]=[];
  attendanceStatus: string[]=[];
  dataPur:any[] = [];
  pageIndex = 1;
  defaultPageSize = 10;
  lectureId=0;
  coursename='';
  date:string;
  from:Time;
  to:Time;
//  colors = [{ attendanceStatus: "absent", color: "red" }, { attendanceStatus: "present", color: "green" }]
  isSmallScreen : boolean;
  subscriptionsList: Subscription[] = [];
  attendanceReportByLecture = new AttendanceReportByLectureManagementModel();
  attendanceReport : AttendanceReportByLectureManagementModel[];
  attendaceReportModdel=new AttendanceDetailsModel();
  subscription:Subscription;
  attendanceDetails:AttendanceDetailsModel;
  data: AttendanceReportByLectureManagementModel;
  @ViewChild(MatPaginator, {static: false})
  set paginator(value: MatPaginator) {
    if (this.dataSource) {
      this.dataSource.paginator = value;
    }
  } 
  
  // @ViewChild(MatTable,{static:true}) table: MatTable<any>;

  @ViewChild(MatSort, {static: false})
  set sort(value: MatSort) {
    if (this.dataSource) {
      this.dataSource.sort = value;
    }
  }
  constructor(private lectureReportService : AttendaneReportByLectureService,
    private snackBar: MatSnackBar,
    private router: Router,
    public dialog: MatDialog,
    private changeDetectorRef:ChangeDetectorRef,
    private breakpointObserver: BreakpointObserver,
    ) { }

  ngOnInit(): void {
    // this.dataSource = new MatTableDataSource<any>();
    // this.Subscription();
    
}
ngAfterViewInit(): void {
  this.dataSource = new MatTableDataSource<any>();
  this.Subscription();
}

private Subscription():Subscription[]{
  // this.subscriptionsList.push(this.initialDataSubscription());
  this.subscriptionsList.push(this.filterEventSubscription());
  return this.subscriptionsList;
}
private filterEventSubscription(): Subscription{
  return this.lectureReportService.attendanceDetailsByLectureFilterEvent.subscribe(
    value=>{this.attendancceReportRequest=value;
      this.lectureId=this.attendancceReportRequest.lectureId;
      console.log(this.attendancceReportRequest.lectureId);
      return this.lectureReportService.getStudentAttendanceReport
      (this.attendancceReportRequest.lectureId).subscribe(Report=>{
         this.tableData=Report.attendanceDetailsDTOs;
          this.dataSource.data=this.tableData;
          console.log(this.tableData)
     } ) }
   );
}

private initialDataSubscription() : Subscription{
  return this.lectureReportService.getStudentAttendanceReport(this.attendancceReportRequest.lectureId).subscribe(Report=>
    {
      console.log(this.attendancceReportRequest.lectureId);
        this.tableData=Report.attendanceDetailsDTOs;
        this.dataSource.data=this.tableData;
        console.log(this.tableData)   
      
     
     
    })
}
edit(details : AttendanceDetailsModel){
  if (this.isSmallScreen) {
    this.router.navigateByUrl('/attendancereportsbylecture-management/edit-status', {state: details}).then(_ => console.log());
  } else {
    this.dialog.open(EditStatuesComponent, {data: details});
    this.lectureReportService.closeSaveEvent.subscribe(e => {
      this.dialog.closeAll();
      if (e !== 'Cancel') {
        this.snackBar.open('Attendance Statues Edited Successfully', undefined, {duration: 4000, panelClass: 'successSnackBar'});
        console.log('here');
         this.filterEventSubscription();
      }
      },
     error => {
      this.snackBar.open('Attendance Statues Editing Failed', undefined, {duration: 4000, panelClass: 'failedSnackBar'});
    });
  }
}

// ngOnDestroy(): void {
// this.lectureReportService.attendanceDetailsByLectureFilterEvent.unsubscribe();
// }
}

import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {PageRequest} from '../../shared/model/page-request';
import {HttpClient} from '@angular/common/http';
import {PageQueryUtil} from '../../shared/model/page-query';
import {Sort} from '@angular/material/sort';
import {Constants} from '../../shared/constants';
import {MessageResponse} from '../../shared/model/message-response';
import {MajorModel} from '../../shared/model/major-management/major-model';
import {StudyTypeModel} from '../../shared/model/studyType-model';
import {StudentModel} from '../../shared/model/student-management/student-model';
import {StudentArray} from '../../shared/model/studentEnrollment-management/student-array';
import {
   StudentEnrollmentRequestModel
} from '../../shared/model/studentEnrollment-management/student-enrollment-request-model';
import {StudentEnrollmentModel} from '../../shared/model/studentEnrollment-management/student-enrollment-model';
import {RoleModel} from '../../shared/model/security/role-model';

@Injectable({
   providedIn: 'root'
})
export class StudentEnrollmentManagementService {

   static majorsList: MajorModel[];
   studentEnrollmentFilterEvent: Subject<StudentEnrollmentRequestModel> = new Subject<StudentEnrollmentRequestModel>();
   studentEnrollmentDeleteEvent: Subject<any> = new Subject<any>();
   studentEnrollmentCloseUpdateEvent: Subject<any> = new Subject<any>();

   constructor(private httpClient: HttpClient) {
   }

   public searchStudentEnrollments(pageNumber: number, pageSize: number, studentEnrollmentRequestModel: StudentEnrollmentRequestModel):
      Observable<PageRequest<StudentEnrollmentModel>> {
      console.log(pageNumber, pageSize);
      return this.httpClient.post<PageRequest<StudentEnrollmentModel>>
      (Constants.searchStudentEnrollmentUrl + (pageNumber + 1) + '/' + pageSize, studentEnrollmentRequestModel);
   }

   // tslint:disable-next-line:max-line-length
   constructStudentEnrollmentRequestObject(sort: Sort, studentEnrollmentRequestModel: StudentEnrollmentRequestModel): StudentEnrollmentRequestModel {
      if (sort.direction === 'asc') {
         studentEnrollmentRequestModel.sortDirection = Constants.ASC;
      } else if (sort.direction === 'desc') {
         studentEnrollmentRequestModel.sortDirection = Constants.DESC;
      } else {
         studentEnrollmentRequestModel.sortDirection = null;
      }
      studentEnrollmentRequestModel.sortBy = sort.active;
      return studentEnrollmentRequestModel;
   }

   addStudentEnrollment(studentEnrollmentModel: StudentEnrollmentModel, students: StudentModel[]): Observable<MessageResponse> {
      const studentArray = new StudentArray();
      studentArray.studentEnrollmentDTO = studentEnrollmentModel;
      studentArray.studentDTOS = students;
      console.log(studentEnrollmentModel);
      students.forEach(value => {
         value.user.role = new RoleModel();
      });
      return this.httpClient.post<MessageResponse>(Constants.saveStudentEnrollmentUrl, studentArray);
   }

   updateStudentEnrollment(studentEnrollmentModel: StudentEnrollmentModel): Observable<MessageResponse> {
      studentEnrollmentModel.studentDTO.user.role = new RoleModel();
      return this.httpClient.post<MessageResponse>(Constants.updateStudentEnrollmentUrl, studentEnrollmentModel);
   }

   deleteStudentEnrollment(id: number): Observable<MessageResponse> {
      return this.httpClient.get<MessageResponse>(Constants.deleteStudentEnrollmentUrl + id);
   }

   public getAllStudyTypes():
      Observable<StudyTypeModel[]> {
      return this.httpClient.get <StudyTypeModel[]>(Constants.allStudyTypesUrl);
   }

   getMajorsByDepartment(departmentId: number): Observable<MajorModel[]> {
      return this.httpClient.get<MajorModel[]>(Constants.majorsByDepartmentIdUrl + departmentId);
   }

}

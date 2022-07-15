import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {AcademicYear} from 'src/app/shared/model/academicYear-Management/academic-year';
import {MessageResponse} from 'src/app/shared/model/message-response';
import {Constants} from '../../shared/constants';
import {DepartmentModel} from "../../shared/model/department-management/department-model";

@Injectable({
  providedIn: 'root'
})
export class AcademicYearService {
  closeSaveEvent: Subject<any> = new Subject();
  academicYearDeleteEvent: Subject<any> = new Subject<any>();
  academicYearFilterEvent: Subject<any[]> = new Subject<any[]>();


  constructor(private http: HttpClient) {
  }

  // readonly baseUrl ='http://localhost:8080/api/academicYears/delete'
  // addUrl='http://localhost:8080/api/academicYears/update'

  public postAcademicYear(Academicyear: AcademicYear): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(Constants.addAcademicYears, Academicyear);
  }


  public deleteAcademic(id: number): Observable<MessageResponse> {
    return this.http.delete<MessageResponse>(`${Constants.deleteAcademicYears}/${id}`);
  }


  public getAcademicYears():
    Observable<AcademicYear[]> {
    return this.http.get<AcademicYear[]>(Constants.getAcademicYears);
  }
   public static get yearsList(): AcademicYear[]{
      // @ts-ignore
      return JSON.parse(localStorage.getItem(Constants.YEARS_LIST));
   }
   public static set yearsList(academicYears: AcademicYear[]){
      // @ts-ignore
      localStorage.setItem(Constants.YEARS_LIST, JSON.stringify(academicYears));
   }
}

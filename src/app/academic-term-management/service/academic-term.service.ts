import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {AcademicTermModel} from 'src/app/shared/model/academicTerm-management/academic-term-model';
import {AcademicTermRequestModel} from 'src/app/shared/model/academicTerm-management/academic-term-request-model';
import { MessageResponse } from 'src/app/shared/model/message-response';
import {Constants} from '../../shared/constants';

@Injectable({
  providedIn: 'root'
})
export class AcademicTermService {
  academicTermFilterEvent: Subject<any> = new Subject<any>();
  academicTermDeleteEvent: Subject<any> = new Subject<any>();
  academicTermSaveEvent: Subject<AcademicTermModel> = new Subject<AcademicTermModel>();
  closeSaveEvent: Subject<any> = new Subject();

  constructor(private http: HttpClient) {
  }



  public postAcademicTerm(academicTerm: AcademicTermModel):Observable<MessageResponse> {
    return this.http.post <MessageResponse>(Constants.addAcademicTerms, academicTerm);
  }

  deleteAcademicTerm(id: number) {
    return this.http.get(`${Constants.deleteAcademicTerms}/${id}`);
  }


  public getAcademicTerms():
    Observable<AcademicTermModel[]> {
    return this.http.get<AcademicTermModel[]>(Constants.getAcademicTerms);
  }

  constructAcademicTermRequestObject(academicTermRequestModel: AcademicTermRequestModel): AcademicTermRequestModel {
    return academicTermRequestModel;
  }

  getAcademicTermsByAcademicYears(yearId: number): AcademicTermModel[] {
    return AcademicTermService.academicTermsList.filter(value => {
      return (value.academicYearDTO?.id === yearId);
    });
  }
    getCurrentTerm(): Observable<AcademicTermModel>{
      return this.http.get<AcademicTermModel>(Constants.getCurrentTerm);
   }
   public static get academicTermsList(): AcademicTermModel[]{
      // @ts-ignore
      return JSON.parse(localStorage.getItem(Constants.TERMS_LIST));
   }
   public static set academicTermsList(academicTermModels: AcademicTermModel[]){
      // @ts-ignore
      localStorage.setItem(Constants.TERMS_LIST, JSON.stringify(academicTermModels));

   }
   public static get currentTerm(): AcademicTermModel{
      // @ts-ignore
      return JSON.parse(localStorage.getItem(Constants.CURRENT_TERM));
   }
   // public static getCurrent():AcademicTermModel[]{
   //    // @ts-ignore
   //    return JSON.parse(localStorage.getItem(Constants.TERMS_LIST)).sort((a:AcademicTermModel,b:AcademicTermModel)=>{
   //        new Date(a.end_date) - new Date(b.end_date)
   //    });
   // }
}

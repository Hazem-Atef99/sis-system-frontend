import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {Constants} from '../../shared/constants';
import {MessageResponse} from '../../shared/model/message-response';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  public updateProfilePictureEvent: Subject<string> = new Subject<string>();

  constructor(private http: HttpClient) {
  }

  public uploadProfilePicture(event: any, email: string, id: string): Observable<MessageResponse> {
    const file: File = event.files.pop();
    const formData = new FormData();
    formData.append('file', file, file.name.replaceAll('-', ''));
    formData.append('email', email);
    formData.append('userID', id);
    return this.http.post<MessageResponse>(Constants.uploadProfilePicture, formData);
  }
}

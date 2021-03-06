import {Component, OnDestroy, OnInit} from '@angular/core';
import {PageEvent} from '@angular/material/paginator';
import {CollegeManagementService} from '../../service/college-management.service';
import {Subscription} from 'rxjs';
import {GeneralSearchRequest} from '../../../shared/model/general-search-request';
import {PageRequest} from '../../../shared/model/page-request';
import {CollegeModel} from '../../../shared/model/college-management/college-model';
import {BsModalService} from 'ngx-bootstrap/modal';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SaveCollegeComponent} from '../save-college/save-college.component';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Router} from '@angular/router';
import {ConfirmationService, MessageService, PrimeNGConfig} from 'primeng/api';
import {LoadDataEvent} from '../../../shared/model/load-data-event';
import {Constants} from '../../../shared/constants';

@Component({
   selector: 'app-colleges-list',
   templateUrl: './colleges-list.component.html',
   styleUrls: ['./colleges-list.component.css'],
   providers: [MessageService, ConfirmationService]
})
export class CollegesListComponent implements OnInit, OnDestroy {

   tableData: PageRequest<CollegeModel>;
   collegeRequestModel: GeneralSearchRequest = new GeneralSearchRequest();
   displayedColumns = ['id', 'nameEn', 'nameAr', 'code', 'Actions'];
   pageIndex = 0;
   pageSize = 5;
   subscriptionsList: Subscription[] = [];
   isSmallScreen: boolean;
   collegeModel = new CollegeModel();
   loading = true;
   firstTime = true;

   constructor(private messageService: MessageService, private confirmationService: ConfirmationService,
               private collegeManagementService: CollegeManagementService,
               private modalService: BsModalService,
               private breakpointObserver: BreakpointObserver,
               private snackBar: MatSnackBar,
               private router: Router, private primengConfig: PrimeNGConfig) {
   }

   ngOnInit(): void {
      this.subscriptionsList = this.subscriptions();
      this.primengConfig.ripple = true;
   }


   pageChangeEvent(event: PageEvent): void {
      this.collegeManagementService.getCollegePage(event.pageIndex, event.pageSize, this.collegeRequestModel)
         .subscribe(value => {
            this.tableData = value;
         });
   }

   addCollege(): void {
      if (this.isSmallScreen) {
         this.router.navigateByUrl('/colleges-management/create-college', {state: new CollegeModel()}).then(_ => console.log());
      } else {
         const initialState = {
            collegeModel: new CollegeModel()
         };
         this.modalService.show(SaveCollegeComponent, {initialState, class: 'modal-lg'});
      }
   }

   updateCollege(college: CollegeModel): void {
      if (this.isSmallScreen) {
         this.router.navigateByUrl('/colleges-management/create-college', {state: college}).then(_ => console.log());
      } else {
         const initialState = {
            collegeModel: college
         };
         this.modalService.show(SaveCollegeComponent, {initialState, class: 'modal-lg'});
      }
   }


   viewCollege(row: CollegeModel): void {

   }

   deleteCollege(id: number): void {
      this.confirmationService.confirm({
         message: 'Delete College',
         header: '',
         accept: () => {
            this.collegeManagementService.deleteCollege(id).subscribe(_ => {
               this.messageService.add({severity: 'success', summary: 'Success', detail: 'College Deleted'});
               this.loading = true;
               this.collegeManagementService.getCollegePage(this.pageIndex, this.pageSize, this.collegeRequestModel).subscribe(value => {
                  this.tableData = value;
                  this.loading = false;
               });
            }, _ => {
               this.messageService.add({severity: 'error', summary: 'Error', detail: 'Deletion Failed'});
            });
         },
         reject: () => {
         }
      });
   }

   saveCollege(): Subscription {
      return this.collegeManagementService.collegeSaveEvent.subscribe(value => {
         this.collegeManagementService.saveCollege(value).subscribe(data => {
            this.paginate(null);
            console.log(data);
            this.messageService.add({severity: 'success', summary: 'Success', detail: data.message});
         }, error => {
            console.log(error);
            this.messageService.add({severity: 'error', summary: 'Error', detail: 'Operation Failed'});
         });
      });
   }

   private subscriptions(): Subscription[] {
      this.subscriptionsList.push(this.initialDataSubscription());
      this.subscriptionsList.push(this.filterEventSubscription());
      this.subscriptionsList.push(this.breakpointObserver.observe(Breakpoints.Handset).subscribe(value => {
         this.isSmallScreen = value.matches;
      }));
      this.subscriptionsList.push(this.saveCollege());
      return this.subscriptionsList;
   }

   loadData(event: LoadDataEvent): void {
      this.loading = true;
      this.collegeRequestModel.sortBy = event.sortField !== undefined ? event.sortField : this.collegeRequestModel.sortBy;
      this.collegeRequestModel.sortDirection = event.sortOrder === 1 ? Constants.ASC : Constants.DESC;
      if (this.firstTime) {
         this.loading = false;
         this.firstTime = false;
      } else {
         this.collegeManagementService.getCollegePage(
            this.pageIndex, this.pageSize, this.collegeRequestModel).subscribe(value => {
            this.loading = false;
            this.tableData = value;
         });
      }
   }

   paginate(page: any): void {
      this.loading = true;
      if (page === null) {
         this.collegeManagementService.getCollegePage(this.pageIndex, this.pageSize, this.collegeRequestModel).subscribe(value => {
            this.loading = false;
            this.tableData = value;
         });
      } else {
         this.pageIndex = page.page;
         this.pageSize = page.rows;
         this.collegeManagementService.getCollegePage(this.pageIndex, this.pageSize, this.collegeRequestModel).subscribe(value => {
            this.loading = false;
            this.tableData = value;
         });
      }
   }

   ngOnDestroy(): void {
      this.subscriptionsList.forEach(sub => sub.unsubscribe());
   }

   private filterEventSubscription(): Subscription {
      return this.collegeManagementService.collegeFilterEvent
         .subscribe(value => {
            this.collegeRequestModel = value;
            this.collegeManagementService
               .getCollegePage(0, this.pageSize, this.collegeRequestModel)
               .subscribe(filteredData => {
                  this.tableData = filteredData;
               });
         });
   }

   private initialDataSubscription(): Subscription {
      this.collegeRequestModel = new GeneralSearchRequest();
      this.loading = true;
      return this.collegeManagementService
         .getCollegePage(0, this.pageSize, this.collegeRequestModel)
         .subscribe(value => {
            this.tableData = value;
            this.loading = false;
         });
   }
}


import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ClassroomManagementService} from '../../service/classroom-management.service';
import {BuildingModel} from '../../../shared/model/building-management/building-model';
import {BuildingManagementService} from '../../../building-management/service/building-management.service';
import {MatSelect} from '@angular/material/select';
import {DepartmentModel} from '../../../shared/model/department-management/department-model';
import {CollegeModel} from '../../../shared/model/college-management/college-model';
import {CollegeManagementService} from '../../../college-management/service/college-management.service';

@Component({
   selector: 'app-classroom-filter',
   templateUrl: './classroom-filter.component.html',
   styleUrls: ['./classroom-filter.component.css']
})
export class ClassroomFilterComponent implements OnInit, AfterViewInit {
   searchValue: string;
   filterCollege: undefined;
   filterBuilding?: undefined;
   collegeSelectValue: undefined;
   buildingSelectValue: undefined;
   buildings: BuildingModel[];
   departments: DepartmentModel[];
   colleges: CollegeModel[];
   @ViewChild('buildingSelect', {static: true}) buildingSelect: MatSelect;
   @ViewChild('collegeSelect', {static: true}) collegeSelect: MatSelect;

   constructor(private classroomManagementService: ClassroomManagementService,
               private buildingManagementService: BuildingManagementService,
               private collegeService: CollegeManagementService) {
   }

   ngOnInit(): void {
      this.searchValue = '';
      this.buildingSelectValue = this.collegeSelectValue = undefined;
      this.collegeService.getAllColleges().subscribe(Response => {
         this.colleges = Response;
      });
      this.buildingManagementService.getBuildings().subscribe(Response => {
         this.buildings = Response;
         console.log(Response);
      });
   }

   applyFilter(): void {
      this.classroomManagementService.classroomFilterEvent.next([this.searchValue, this.filterCollege, this.filterBuilding]);
   }

   resetFilter(): void {
      // this.classroomRequestModel = new ClassroomRequestModel(1, 10);
      this.searchValue = '';
      this.filterBuilding = this.filterCollege = undefined;
      this.collegeSelectValue = this.buildingSelectValue = undefined;
      this.buildingSelect.setDisabledState(true);
      this.buildingSelect.value = undefined;
      this.classroomManagementService.classroomFilterEvent.next(['', undefined, undefined]);
   }

   ngAfterViewInit(): void {
      this.collegeSelect.valueChange.subscribe(value => {
         if (this.collegeSelect.value !== undefined) {
            this.buildingSelect.setDisabledState(false);
            this.buildingManagementService.getBuildingsByCollegeId(this.collegeSelect.value).subscribe(value1 => {
               this.buildings = value1;
            });
         } else {
            this.buildingSelect.setDisabledState(true);
            this.buildingSelect.value = undefined;
            this.filterBuilding = undefined;
            this.buildingSelectValue = undefined;
         }
         this.filterCollege = value;
         this.collegeSelectValue = value;
         this.classroomManagementService.classroomFilterEvent.next([this.searchValue, value, this.filterBuilding]);
      });
      this.buildingSelect.valueChange.subscribe(value => {
         this.filterBuilding = value;
         this.buildingSelectValue = value;
         this.classroomManagementService.classroomFilterEvent.next([this.searchValue, this.filterCollege, value]);
      });
   }
}

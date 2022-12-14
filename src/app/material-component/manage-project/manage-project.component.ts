import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { ProjectComponent } from '../dialog/project/project.component';

@Component({
  selector: 'app-manage-project',
  templateUrl: './manage-project.component.html',
  styleUrls: ['./manage-project.component.scss']
})
export class ManageProjectComponent implements OnInit {

  displayedColumns: string[]= ['name','address','endDate','status','image','edit'];
  dataSource: any;
  responseMessage: any;


  constructor(
    private projectService: ProjectService,
     private dialog: MatDialog,
      private snackbarService: SnackbarService,
       private router: Router
    ) { }

  ngOnInit(): void {
    this.tableData();
  }

  tableData(){
    this.projectService.getProjects().subscribe((response: any)=>{
      console.log(response);
      this.dataSource= new MatTableDataSource(response);
    },(error: any)=>{
      if(error.error?.message){
        this.responseMessage=error.error?.message;
      }else {
        this.responseMessage= GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }

  applyFilter(event: Event){
    const filterValue= (event.target as HTMLInputElement).value;
    this.dataSource.filter= filterValue.trim().toLowerCase();
  }

  handleAddAction(){
    const dialogConfig= new MatDialogConfig();
    dialogConfig.data= {
      action: 'Add'
    }
    dialogConfig.width="700px";
    const dialogRef= this.dialog.open(ProjectComponent,dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    });
    const sub= dialogRef.componentInstance.onAddProject.subscribe((response)=>{
      this.tableData();
    })
  }

  handleEditAction(values: any){
    const dialogConfig= new MatDialogConfig();
    dialogConfig.data= {
      action: 'Edit',
      data: values
    }
    dialogConfig.width="700px";
    const dialogRef= this.dialog.open(ProjectComponent,dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    });
    const sub= dialogRef.componentInstance.onEdditProject.subscribe((response)=>{
      this.tableData();
    })
  }



}

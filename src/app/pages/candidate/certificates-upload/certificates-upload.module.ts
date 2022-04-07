import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CertificatesUploadPageRoutingModule } from './certificates-upload-routing.module';

import { CertificatesUploadPage } from './certificates-upload.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CertificatesUploadPageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule
  ],
  declarations: [CertificatesUploadPage]
})
export class CertificatesUploadPageModule {}

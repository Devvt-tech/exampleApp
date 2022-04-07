import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileFormPageRoutingModule } from './profile-form-routing.module';

import { ProfileFormPage } from './profile-form.page';
import { Camera } from '@ionic-native/camera/ngx';
import { MediaCapture } from '@ionic-native/media-capture/ngx';
import { File } from '@ionic-native/file/ngx';
import { ComponentsModule } from 'src/app/components/components.module';
import { Crop } from '@ionic-native/crop/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    ProfileFormPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ProfileFormPage],
  providers: [
    Camera,
    MediaCapture,
    File,
    Crop
  ]
})
export class ProfileFormPageModule {}

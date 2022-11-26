import { NgModule } from '@angular/core';
import {
  TuiAlertModule,
  TuiButtonModule,
  TuiDataListModule,
  TuiDialogModule, TuiErrorModule, TuiFormatNumberPipeModule, TuiFormatPhonePipeModule,
  TuiHostedDropdownModule,
  TuiRootModule, TuiScrollbarModule, TuiSvgModule, TuiTextfieldControllerModule
} from '@taiga-ui/core';
import {TuiTableModule, TuiTablePaginationModule} from '@taiga-ui/addon-table';
import {
  TuiComboBoxModule,
  TuiDataListDropdownManagerModule, TuiDataListWrapperModule,
  TuiFieldErrorPipeModule, TuiFilterByInputPipeModule, TuiInputCountModule, TuiInputDateModule,
  TuiInputModule, TuiInputNumberModule, TuiInputPhoneModule,
  TuiSelectModule, TuiStringifyContentPipeModule, TuiTextAreaModule, TuiToggleModule
} from '@taiga-ui/kit';

import {TuiActiveZoneModule, TuiLetModule, TuiValidatorModule} from '@taiga-ui/cdk';

const taigaModules = [
  TuiRootModule,
  TuiDialogModule,
  TuiAlertModule,
  TuiTableModule,
  TuiHostedDropdownModule,
  TuiButtonModule,
  TuiDataListDropdownManagerModule,
  TuiActiveZoneModule,
  TuiDataListModule,
  TuiLetModule,
  TuiInputModule,
  TuiValidatorModule,
  TuiSvgModule,
  TuiFieldErrorPipeModule,
  TuiErrorModule,
  TuiSelectModule,
  TuiScrollbarModule,
  TuiInputDateModule,
  TuiTablePaginationModule,
  TuiDataListWrapperModule,
  TuiTextfieldControllerModule,
  TuiComboBoxModule,
  TuiFilterByInputPipeModule,
  TuiStringifyContentPipeModule,
  TuiInputPhoneModule,
  TuiToggleModule,
  TuiTextAreaModule,
  TuiInputCountModule,
  TuiFormatNumberPipeModule,
  TuiInputNumberModule,
  TuiFormatPhonePipeModule
];

@NgModule({
  imports: [
    ...taigaModules
  ],
  exports: [
    ...taigaModules
  ]
})
export class TaigaModule { }

import { Directive, Input, Output, EventEmitter, HostListener, Injector } from '@angular/core';
import { ColorPickerComponent } from './color-picker.component';
import * as i0 from "@angular/core";
import * as i1 from "./color-picker.service";
// Caretaker note: we have still left the `typeof` condition in order to avoid
// creating a breaking change for projects that still use the View Engine.
// The `ngDevMode` is always available when Ivy is enabled.
// This will be evaluated during compilation into `const NG_DEV_MODE = false`,
// thus Terser will be able to tree-shake `console.warn` calls.
const NG_DEV_MODE = typeof ngDevMode === 'undefined' || !!ngDevMode;
export class ColorPickerDirective {
    constructor(injector, cfr, appRef, vcRef, elRef, _service) {
        this.injector = injector;
        this.cfr = cfr;
        this.appRef = appRef;
        this.vcRef = vcRef;
        this.elRef = elRef;
        this._service = _service;
        this.dialogCreated = false;
        this.ignoreChanges = false;
        this.viewAttachedToAppRef = false;
        this.cpWidth = '272px';
        this.cpHeight = 'auto';
        this.cpToggle = false;
        this.cpDisabled = false;
        this.cpIgnoredElements = [];
        this.cpFallbackColor = '';
        this.cpColorMode = 'color';
        this.cpCmykEnabled = false;
        this.cpOutputFormat = 'auto';
        this.cpAlphaChannel = 'disabled';
        this.cpDisableInput = false;
        this.cpDialogDisplay = 'popup';
        this.cpSaveClickOutside = true;
        this.cpCloseClickOutside = true;
        this.cpUseRootViewContainer = false;
        this.cpPosition = 'auto';
        this.cpPositionOffset = '0%';
        this.cpPositionRelativeToArrow = false;
        this.cpOKButton = false;
        this.cpOKButtonText = 'OK';
        this.cpOKButtonClass = 'cp-ok-button-class';
        this.cpCancelButton = false;
        this.cpCancelButtonText = 'Cancel';
        this.cpCancelButtonClass = 'cp-cancel-button-class';
        this.cpEyeDropper = false;
        this.cpPresetLabel = 'Preset colors';
        this.cpPresetColorsClass = 'cp-preset-colors-class';
        this.cpMaxPresetColorsLength = 6;
        this.cpPresetEmptyMessage = 'No colors added';
        this.cpPresetEmptyMessageClass = 'preset-empty-message';
        this.cpAddColorButton = false;
        this.cpAddColorButtonText = 'Add color';
        this.cpAddColorButtonClass = 'cp-add-color-button-class';
        this.cpRemoveColorButtonClass = 'cp-remove-color-button-class';
        this.headerName = 'Edit Color';
        this.saveBtnTxt = 'Save';
        this.cancelBtnTxt = 'Cancel';
        this.cpInputChange = new EventEmitter(true);
        this.cpToggleChange = new EventEmitter(true);
        this.cpSliderChange = new EventEmitter(true);
        this.cpSliderDragEnd = new EventEmitter(true);
        this.cpSliderDragStart = new EventEmitter(true);
        this.colorPickerOpen = new EventEmitter(true);
        this.colorPickerClose = new EventEmitter(true);
        this.colorPickerCancel = new EventEmitter(true);
        this.colorPickerSelect = new EventEmitter(true);
        this.colorPickerChange = new EventEmitter(false);
        this.cpCmykColorChange = new EventEmitter(true);
        this.cpPresetColorsChange = new EventEmitter(true);
    }
    handleClick() {
        this.inputFocus();
    }
    handleFocus() {
        this.inputFocus();
    }
    handleInput(event) {
        this.inputChange(event);
    }
    ngOnInit() {
        this.colorPicker = this.colorPicker || this.cpFallbackColor || 'rgba(0, 0, 0, 1)';
    }
    ngOnDestroy() {
        if (this.cmpRef != null) {
            if (this.viewAttachedToAppRef) {
                this.appRef.detachView(this.cmpRef.hostView);
            }
            this.cmpRef.destroy();
            this.cmpRef = null;
            this.dialog = null;
        }
    }
    ngOnChanges(changes) {
        if (changes.cpToggle && !this.cpDisabled) {
            if (changes.cpToggle.currentValue) {
                this.openDialog();
            }
            else if (!changes.cpToggle.currentValue) {
                this.closeDialog();
            }
        }
        if (changes.colorPicker) {
            if (this.dialog && !this.ignoreChanges) {
                if (this.cpDialogDisplay === 'inline') {
                    this.dialog.setInitialColor(changes.colorPicker.currentValue);
                }
                this.dialog.setColorFromString(changes.colorPicker.currentValue, false);
                if (this.cpUseRootViewContainer && this.cpDialogDisplay !== 'inline') {
                    this.cmpRef.changeDetectorRef.detectChanges();
                }
            }
            this.ignoreChanges = false;
        }
        if (changes.cpPresetLabel || changes.cpPresetColors) {
            if (this.dialog) {
                this.dialog.setPresetConfig(this.cpPresetLabel, this.cpPresetColors);
            }
        }
    }
    openDialog() {
        if (!this.dialogCreated) {
            let vcRef = this.vcRef;
            this.dialogCreated = true;
            this.viewAttachedToAppRef = false;
            if (this.cpUseRootViewContainer && this.cpDialogDisplay !== 'inline') {
                const classOfRootComponent = this.appRef.componentTypes[0];
                const appInstance = this.injector.get(classOfRootComponent, Injector.NULL);
                if (appInstance !== Injector.NULL) {
                    vcRef = appInstance.vcRef || appInstance.viewContainerRef || this.vcRef;
                    if (NG_DEV_MODE && vcRef === this.vcRef) {
                        console.warn('You are using cpUseRootViewContainer, ' +
                            'but the root component is not exposing viewContainerRef!' +
                            'Please expose it by adding \'public vcRef: ViewContainerRef\' to the constructor.');
                    }
                }
                else {
                    this.viewAttachedToAppRef = true;
                }
            }
            const compFactory = this.cfr.resolveComponentFactory(ColorPickerComponent);
            if (this.viewAttachedToAppRef) {
                this.cmpRef = compFactory.create(this.injector);
                this.appRef.attachView(this.cmpRef.hostView);
                document.body.appendChild(this.cmpRef.hostView.rootNodes[0]);
            }
            else {
                const injector = Injector.create({
                    providers: [],
                    // We shouldn't use `vcRef.parentInjector` since it's been deprecated long time ago and might be removed
                    // in newer Angular versions: https://github.com/angular/angular/pull/25174.
                    parent: vcRef.injector,
                });
                this.cmpRef = vcRef.createComponent(compFactory, 0, injector, []);
            }
            this.cmpRef.instance.setupDialog(this, this.elRef, this.colorPicker, this.cpWidth, this.cpHeight, this.cpDialogDisplay, this.cpFallbackColor, this.cpColorMode, this.cpCmykEnabled, this.cpAlphaChannel, this.cpOutputFormat, this.cpDisableInput, this.cpIgnoredElements, this.cpSaveClickOutside, this.cpCloseClickOutside, this.cpUseRootViewContainer, this.cpPosition, this.cpPositionOffset, this.cpPositionRelativeToArrow, this.cpPresetLabel, this.cpPresetColors, this.cpPresetColorsClass, this.cpMaxPresetColorsLength, this.cpPresetEmptyMessage, this.cpPresetEmptyMessageClass, this.cpOKButton, this.cpOKButtonClass, this.cpOKButtonText, this.cpCancelButton, this.cpCancelButtonClass, this.cpCancelButtonText, this.cpAddColorButton, this.cpAddColorButtonClass, this.cpAddColorButtonText, this.cpRemoveColorButtonClass, this.cpEyeDropper, this.elRef, this.cpExtraTemplate, this.headerName, this.saveBtnTxt, this.cancelBtnTxt);
            this.dialog = this.cmpRef.instance;
            if (this.vcRef !== vcRef) {
                this.cmpRef.changeDetectorRef.detectChanges();
            }
        }
        else if (this.dialog) {
            this.dialog.openDialog(this.colorPicker);
        }
    }
    closeDialog() {
        if (this.dialog && this.cpDialogDisplay === 'popup') {
            this.dialog.closeDialog();
        }
    }
    cmykChanged(value) {
        this.cpCmykColorChange.emit(value);
    }
    stateChanged(state) {
        this.cpToggleChange.emit(state);
        if (state) {
            this.colorPickerOpen.emit(this.colorPicker);
        }
        else {
            this.colorPickerClose.emit(this.colorPicker);
        }
    }
    colorChanged(value, ignore = true) {
        this.ignoreChanges = ignore;
        this.colorPickerChange.emit(value);
    }
    colorSelected(value) {
        this.colorPickerSelect.emit(value);
    }
    colorCanceled() {
        this.colorPickerCancel.emit();
    }
    inputFocus() {
        const element = this.elRef.nativeElement;
        const ignored = this.cpIgnoredElements.filter((item) => item === element);
        if (!this.cpDisabled && !ignored.length) {
            if (typeof document !== 'undefined' && element === document.activeElement) {
                this.openDialog();
            }
            else if (!this.dialog || !this.dialog.show) {
                this.openDialog();
            }
            else {
                this.closeDialog();
            }
        }
    }
    inputChange(event) {
        if (this.dialog) {
            this.dialog.setColorFromString(event.target.value, true);
        }
        else {
            this.colorPicker = event.target.value;
            this.colorPickerChange.emit(this.colorPicker);
        }
    }
    inputChanged(event) {
        this.cpInputChange.emit(event);
    }
    sliderChanged(event) {
        this.cpSliderChange.emit(event);
    }
    sliderDragEnd(event) {
        this.cpSliderDragEnd.emit(event);
    }
    sliderDragStart(event) {
        this.cpSliderDragStart.emit(event);
    }
    presetColorsChanged(value) {
        this.cpPresetColorsChange.emit(value);
    }
}
ColorPickerDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: ColorPickerDirective, deps: [{ token: i0.Injector }, { token: i0.ComponentFactoryResolver }, { token: i0.ApplicationRef }, { token: i0.ViewContainerRef }, { token: i0.ElementRef }, { token: i1.ColorPickerService }], target: i0.ɵɵFactoryTarget.Directive });
ColorPickerDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.4.0", type: ColorPickerDirective, selector: "[colorPicker]", inputs: { colorPicker: "colorPicker", cpWidth: "cpWidth", cpHeight: "cpHeight", cpToggle: "cpToggle", cpDisabled: "cpDisabled", cpIgnoredElements: "cpIgnoredElements", cpFallbackColor: "cpFallbackColor", cpColorMode: "cpColorMode", cpCmykEnabled: "cpCmykEnabled", cpOutputFormat: "cpOutputFormat", cpAlphaChannel: "cpAlphaChannel", cpDisableInput: "cpDisableInput", cpDialogDisplay: "cpDialogDisplay", cpSaveClickOutside: "cpSaveClickOutside", cpCloseClickOutside: "cpCloseClickOutside", cpUseRootViewContainer: "cpUseRootViewContainer", cpPosition: "cpPosition", cpPositionOffset: "cpPositionOffset", cpPositionRelativeToArrow: "cpPositionRelativeToArrow", cpOKButton: "cpOKButton", cpOKButtonText: "cpOKButtonText", cpOKButtonClass: "cpOKButtonClass", cpCancelButton: "cpCancelButton", cpCancelButtonText: "cpCancelButtonText", cpCancelButtonClass: "cpCancelButtonClass", cpEyeDropper: "cpEyeDropper", cpPresetLabel: "cpPresetLabel", cpPresetColors: "cpPresetColors", cpPresetColorsClass: "cpPresetColorsClass", cpMaxPresetColorsLength: "cpMaxPresetColorsLength", cpPresetEmptyMessage: "cpPresetEmptyMessage", cpPresetEmptyMessageClass: "cpPresetEmptyMessageClass", cpAddColorButton: "cpAddColorButton", cpAddColorButtonText: "cpAddColorButtonText", cpAddColorButtonClass: "cpAddColorButtonClass", cpRemoveColorButtonClass: "cpRemoveColorButtonClass", headerName: "headerName", saveBtnTxt: "saveBtnTxt", cancelBtnTxt: "cancelBtnTxt", cpExtraTemplate: "cpExtraTemplate" }, outputs: { cpInputChange: "cpInputChange", cpToggleChange: "cpToggleChange", cpSliderChange: "cpSliderChange", cpSliderDragEnd: "cpSliderDragEnd", cpSliderDragStart: "cpSliderDragStart", colorPickerOpen: "colorPickerOpen", colorPickerClose: "colorPickerClose", colorPickerCancel: "colorPickerCancel", colorPickerSelect: "colorPickerSelect", colorPickerChange: "colorPickerChange", cpCmykColorChange: "cpCmykColorChange", cpPresetColorsChange: "cpPresetColorsChange" }, host: { listeners: { "click": "handleClick()", "focus": "handleFocus()", "input": "handleInput($event)" } }, exportAs: ["ngxColorPicker"], usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: ColorPickerDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[colorPicker]',
                    exportAs: 'ngxColorPicker'
                }]
        }], ctorParameters: function () { return [{ type: i0.Injector }, { type: i0.ComponentFactoryResolver }, { type: i0.ApplicationRef }, { type: i0.ViewContainerRef }, { type: i0.ElementRef }, { type: i1.ColorPickerService }]; }, propDecorators: { colorPicker: [{
                type: Input
            }], cpWidth: [{
                type: Input
            }], cpHeight: [{
                type: Input
            }], cpToggle: [{
                type: Input
            }], cpDisabled: [{
                type: Input
            }], cpIgnoredElements: [{
                type: Input
            }], cpFallbackColor: [{
                type: Input
            }], cpColorMode: [{
                type: Input
            }], cpCmykEnabled: [{
                type: Input
            }], cpOutputFormat: [{
                type: Input
            }], cpAlphaChannel: [{
                type: Input
            }], cpDisableInput: [{
                type: Input
            }], cpDialogDisplay: [{
                type: Input
            }], cpSaveClickOutside: [{
                type: Input
            }], cpCloseClickOutside: [{
                type: Input
            }], cpUseRootViewContainer: [{
                type: Input
            }], cpPosition: [{
                type: Input
            }], cpPositionOffset: [{
                type: Input
            }], cpPositionRelativeToArrow: [{
                type: Input
            }], cpOKButton: [{
                type: Input
            }], cpOKButtonText: [{
                type: Input
            }], cpOKButtonClass: [{
                type: Input
            }], cpCancelButton: [{
                type: Input
            }], cpCancelButtonText: [{
                type: Input
            }], cpCancelButtonClass: [{
                type: Input
            }], cpEyeDropper: [{
                type: Input
            }], cpPresetLabel: [{
                type: Input
            }], cpPresetColors: [{
                type: Input
            }], cpPresetColorsClass: [{
                type: Input
            }], cpMaxPresetColorsLength: [{
                type: Input
            }], cpPresetEmptyMessage: [{
                type: Input
            }], cpPresetEmptyMessageClass: [{
                type: Input
            }], cpAddColorButton: [{
                type: Input
            }], cpAddColorButtonText: [{
                type: Input
            }], cpAddColorButtonClass: [{
                type: Input
            }], cpRemoveColorButtonClass: [{
                type: Input
            }], headerName: [{
                type: Input,
                args: ['headerName']
            }], saveBtnTxt: [{
                type: Input,
                args: ['saveBtnTxt']
            }], cancelBtnTxt: [{
                type: Input,
                args: ['cancelBtnTxt']
            }], cpExtraTemplate: [{
                type: Input
            }], cpInputChange: [{
                type: Output
            }], cpToggleChange: [{
                type: Output
            }], cpSliderChange: [{
                type: Output
            }], cpSliderDragEnd: [{
                type: Output
            }], cpSliderDragStart: [{
                type: Output
            }], colorPickerOpen: [{
                type: Output
            }], colorPickerClose: [{
                type: Output
            }], colorPickerCancel: [{
                type: Output
            }], colorPickerSelect: [{
                type: Output
            }], colorPickerChange: [{
                type: Output
            }], cpCmykColorChange: [{
                type: Output
            }], cpPresetColorsChange: [{
                type: Output
            }], handleClick: [{
                type: HostListener,
                args: ['click']
            }], handleFocus: [{
                type: HostListener,
                args: ['focus']
            }], handleInput: [{
                type: HostListener,
                args: ['input', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3ItcGlja2VyLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2xpYi9zcmMvbGliL2NvbG9yLXBpY2tlci5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBd0IsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQ25FLFlBQVksRUFDWixRQUFRLEVBQWtFLE1BQU0sZUFBZSxDQUFDO0FBR2xHLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDBCQUEwQixDQUFDOzs7QUFJaEUsOEVBQThFO0FBQzlFLDBFQUEwRTtBQUMxRSwyREFBMkQ7QUFDM0QsOEVBQThFO0FBQzlFLCtEQUErRDtBQUMvRCxNQUFNLFdBQVcsR0FBRyxPQUFPLFNBQVMsS0FBSyxXQUFXLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQztBQU1wRSxNQUFNLE9BQU8sb0JBQW9CO0lBcUcvQixZQUFvQixRQUFrQixFQUFVLEdBQTZCLEVBQ25FLE1BQXNCLEVBQVUsS0FBdUIsRUFBVSxLQUFpQixFQUNsRixRQUE0QjtRQUZsQixhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQVUsUUFBRyxHQUFILEdBQUcsQ0FBMEI7UUFDbkUsV0FBTSxHQUFOLE1BQU0sQ0FBZ0I7UUFBVSxVQUFLLEdBQUwsS0FBSyxDQUFrQjtRQUFVLFVBQUssR0FBTCxLQUFLLENBQVk7UUFDbEYsYUFBUSxHQUFSLFFBQVEsQ0FBb0I7UUFwRzlCLGtCQUFhLEdBQVksS0FBSyxDQUFDO1FBQy9CLGtCQUFhLEdBQVksS0FBSyxDQUFDO1FBRy9CLHlCQUFvQixHQUFZLEtBQUssQ0FBQztRQUlyQyxZQUFPLEdBQVcsT0FBTyxDQUFDO1FBQzFCLGFBQVEsR0FBVyxNQUFNLENBQUM7UUFFMUIsYUFBUSxHQUFZLEtBQUssQ0FBQztRQUMxQixlQUFVLEdBQVksS0FBSyxDQUFDO1FBRTVCLHNCQUFpQixHQUFRLEVBQUUsQ0FB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bUJBQW1CO3NCQUEzQixLQUFLO2dCQUNHLHVCQUF1QjtzQkFBL0IsS0FBSztnQkFFRyxvQkFBb0I7c0JBQTVCLEtBQUs7Z0JBQ0cseUJBQXlCO3NCQUFqQyxLQUFLO2dCQUVHLGdCQUFnQjtzQkFBeEIsS0FBSztnQkFDRyxvQkFBb0I7c0JBQTVCLEtBQUs7Z0JBQ0cscUJBQXFCO3NCQUE3QixLQUFLO2dCQUVHLHdCQUF3QjtzQkFBaEMsS0FBSztnQkFDZSxVQUFVO3NCQUE5QixLQUFLO3VCQUFDLFlBQVk7Z0JBQ0ksVUFBVTtzQkFBOUIsS0FBSzt1QkFBQyxZQUFZO2dCQUNJLFlBQVk7c0JBQWxDLEtBQUs7dUJBQUMsY0FBYztnQkFFZCxlQUFlO3NCQUF2QixLQUFLO2dCQUVJLGFBQWE7c0JBQXRCLE1BQU07Z0JBRUcsY0FBYztzQkFBdkIsTUFBTTtnQkFFRyxjQUFjO3NCQUF2QixNQUFNO2dCQUNHLGVBQWU7c0JBQXhCLE1BQU07Z0JBQ0csaUJBQWlCO3NCQUExQixNQUFNO2dCQUVHLGVBQWU7c0JBQXhCLE1BQU07Z0JBQ0csZ0JBQWdCO3NCQUF6QixNQUFNO2dCQUVHLGlCQUFpQjtzQkFBMUIsTUFBTTtnQkFDRyxpQkFBaUI7c0JBQTFCLE1BQU07Z0JBQ0csaUJBQWlCO3NCQUExQixNQUFNO2dCQUVHLGlCQUFpQjtzQkFBMUIsTUFBTTtnQkFFRyxvQkFBb0I7c0JBQTdCLE1BQU07Z0JBRWdCLFdBQVc7c0JBQWpDLFlBQVk7dUJBQUMsT0FBTztnQkFJRSxXQUFXO3NCQUFqQyxZQUFZO3VCQUFDLE9BQU87Z0JBSWMsV0FBVztzQkFBN0MsWUFBWTt1QkFBQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIE9uQ2hhbmdlcywgT25EZXN0cm95LCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsXHJcbiAgSG9zdExpc3RlbmVyLCBBcHBsaWNhdGlvblJlZiwgQ29tcG9uZW50UmVmLCBFbGVtZW50UmVmLCBWaWV3Q29udGFpbmVyUmVmLFxyXG4gIEluamVjdG9yLCBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsIEVtYmVkZGVkVmlld1JlZiwgVGVtcGxhdGVSZWYsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuaW1wb3J0IHsgQ29sb3JQaWNrZXJTZXJ2aWNlIH0gZnJvbSAnLi9jb2xvci1waWNrZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IENvbG9yUGlja2VyQ29tcG9uZW50IH0gZnJvbSAnLi9jb2xvci1waWNrZXIuY29tcG9uZW50JztcclxuXHJcbmltcG9ydCB7IEFscGhhQ2hhbm5lbCwgQ29sb3JNb2RlLCBPdXRwdXRGb3JtYXQgfSBmcm9tICcuL2hlbHBlcnMnO1xyXG5cclxuLy8gQ2FyZXRha2VyIG5vdGU6IHdlIGhhdmUgc3RpbGwgbGVmdCB0aGUgYHR5cGVvZmAgY29uZGl0aW9uIGluIG9yZGVyIHRvIGF2b2lkXHJcbi8vIGNyZWF0aW5nIGEgYnJlYWtpbmcgY2hhbmdlIGZvciBwcm9qZWN0cyB0aGF0IHN0aWxsIHVzZSB0aGUgVmlldyBFbmdpbmUuXHJcbi8vIFRoZSBgbmdEZXZNb2RlYCBpcyBhbHdheXMgYXZhaWxhYmxlIHdoZW4gSXZ5IGlzIGVuYWJsZWQuXHJcbi8vIFRoaXMgd2lsbCBiZSBldmFsdWF0ZWQgZHVyaW5nIGNvbXBpbGF0aW9uIGludG8gYGNvbnN0IE5HX0RFVl9NT0RFID0gZmFsc2VgLFxyXG4vLyB0aHVzIFRlcnNlciB3aWxsIGJlIGFibGUgdG8gdHJlZS1zaGFrZSBgY29uc29sZS53YXJuYCBjYWxscy5cclxuY29uc3QgTkdfREVWX01PREUgPSB0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCAhIW5nRGV2TW9kZTtcclxuXHJcbkBEaXJlY3RpdmUoe1xyXG4gIHNlbGVjdG9yOiAnW2NvbG9yUGlja2VyXScsXHJcbiAgZXhwb3J0QXM6ICduZ3hDb2xvclBpY2tlcidcclxufSlcclxuZXhwb3J0IGNsYXNzIENvbG9yUGlja2VyRGlyZWN0aXZlIGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XHJcbiAgcHJpdmF0ZSBkaWFsb2c6IGFueTtcclxuXHJcbiAgcHJpdmF0ZSBkaWFsb2dDcmVhdGVkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgcHJpdmF0ZSBpZ25vcmVDaGFuZ2VzOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gIHByaXZhdGUgY21wUmVmOiBDb21wb25lbnRSZWY8Q29sb3JQaWNrZXJDb21wb25lbnQ+O1xyXG4gIHByaXZhdGUgdmlld0F0dGFjaGVkVG9BcHBSZWY6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgQElucHV0KCkgY29sb3JQaWNrZXI6IHN0cmluZztcclxuXHJcbiAgQElucHV0KCkgY3BXaWR0aDogc3RyaW5nID0gJzI3MnB4JztcclxuICBASW5wdXQoKSBjcEhlaWdodDogc3RyaW5nID0gJ2F1dG8nO1xyXG5cclxuICBASW5wdXQoKSBjcFRvZ2dsZTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIEBJbnB1dCgpIGNwRGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgQElucHV0KCkgY3BJZ25vcmVkRWxlbWVudHM6IGFueSA9IFtdO1xyXG5cclxuICBASW5wdXQoKSBjcEZhbGxiYWNrQ29sb3I6IHN0cmluZyA9ICcnO1xyXG5cclxuICBASW5wdXQoKSBjcENvbG9yTW9kZTogQ29sb3JNb2RlID0gJ2NvbG9yJztcclxuXHJcbiAgQElucHV0KCkgY3BDbXlrRW5hYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICBASW5wdXQoKSBjcE91dHB1dEZvcm1hdDogT3V0cHV0Rm9ybWF0ID0gJ2F1dG8nO1xyXG4gIEBJbnB1dCgpIGNwQWxwaGFDaGFubmVsOiBBbHBoYUNoYW5uZWwgPSAnZGlzYWJsZWQnO1xyXG5cclxuICBASW5wdXQoKSBjcERpc2FibGVJbnB1dDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICBASW5wdXQoKSBjcERpYWxvZ0Rpc3BsYXk6IHN0cmluZyA9ICdwb3B1cCc7XHJcblxyXG4gIEBJbnB1dCgpIGNwU2F2ZUNsaWNrT3V0c2lkZTogYm9vbGVhbiA9IHRydWU7XHJcbiAgQElucHV0KCkgY3BDbG9zZUNsaWNrT3V0c2lkZTogYm9vbGVhbiA9IHRydWU7XHJcblxyXG4gIEBJbnB1dCgpIGNwVXNlUm9vdFZpZXdDb250YWluZXI6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgQElucHV0KCkgY3BQb3NpdGlvbjogc3RyaW5nID0gJ2F1dG8nO1xyXG4gIEBJbnB1dCgpIGNwUG9zaXRpb25PZmZzZXQ6IHN0cmluZyA9ICcwJSc7XHJcbiAgQElucHV0KCkgY3BQb3NpdGlvblJlbGF0aXZlVG9BcnJvdzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICBASW5wdXQoKSBjcE9LQnV0dG9uOiBib29sZWFuID0gZmFsc2U7XHJcbiAgQElucHV0KCkgY3BPS0J1dHRvblRleHQ6IHN0cmluZyA9ICdPSyc7XHJcbiAgQElucHV0KCkgY3BPS0J1dHRvbkNsYXNzOiBzdHJpbmcgPSAnY3Atb2stYnV0dG9uLWNsYXNzJztcclxuXHJcbiAgQElucHV0KCkgY3BDYW5jZWxCdXR0b246IGJvb2xlYW4gPSBmYWxzZTtcclxuICBASW5wdXQoKSBjcENhbmNlbEJ1dHRvblRleHQ6IHN0cmluZyA9ICdDYW5jZWwnO1xyXG4gIEBJbnB1dCgpIGNwQ2FuY2VsQnV0dG9uQ2xhc3M6IHN0cmluZyA9ICdjcC1jYW5jZWwtYnV0dG9uLWNsYXNzJztcclxuXHJcbiAgQElucHV0KCkgY3BFeWVEcm9wcGVyOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gIEBJbnB1dCgpIGNwUHJlc2V0TGFiZWw6IHN0cmluZyA9ICdQcmVzZXQgY29sb3JzJztcclxuICBASW5wdXQoKSBjcFByZXNldENvbG9yczogc3RyaW5nW107XHJcbiAgQElucHV0KCkgY3BQcmVzZXRDb2xvcnNDbGFzczogc3RyaW5nID0gJ2NwLXByZXNldC1jb2xvcnMtY2xhc3MnO1xyXG4gIEBJbnB1dCgpIGNwTWF4UHJlc2V0Q29sb3JzTGVuZ3RoOiBudW1iZXIgPSA2O1xyXG5cclxuICBASW5wdXQoKSBjcFByZXNldEVtcHR5TWVzc2FnZTogc3RyaW5nID0gJ05vIGNvbG9ycyBhZGRlZCc7XHJcbiAgQElucHV0KCkgY3BQcmVzZXRFbXB0eU1lc3NhZ2VDbGFzczogc3RyaW5nID0gJ3ByZXNldC1lbXB0eS1tZXNzYWdlJztcclxuXHJcbiAgQElucHV0KCkgY3BBZGRDb2xvckJ1dHRvbjogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIEBJbnB1dCgpIGNwQWRkQ29sb3JCdXR0b25UZXh0OiBzdHJpbmcgPSAnQWRkIGNvbG9yJztcclxuICBASW5wdXQoKSBjcEFkZENvbG9yQnV0dG9uQ2xhc3M6IHN0cmluZyA9ICdjcC1hZGQtY29sb3ItYnV0dG9uLWNsYXNzJztcclxuXHJcbiAgQElucHV0KCkgY3BSZW1vdmVDb2xvckJ1dHRvbkNsYXNzOiBzdHJpbmcgPSAnY3AtcmVtb3ZlLWNvbG9yLWJ1dHRvbi1jbGFzcyc7XHJcbiAgQElucHV0KCdoZWFkZXJOYW1lJykgaGVhZGVyTmFtZTpzdHJpbmcgPSAnRWRpdCBDb2xvcic7XHJcbiAgICBASW5wdXQoJ3NhdmVCdG5UeHQnKSBzYXZlQnRuVHh0OiBzdHJpbmcgPSAnU2F2ZSc7XHJcbiAgICBASW5wdXQoJ2NhbmNlbEJ0blR4dCcpIGNhbmNlbEJ0blR4dDogc3RyaW5nID0gJ0NhbmNlbCc7XHJcblxyXG4gIEBJbnB1dCgpIGNwRXh0cmFUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuXHJcbiAgQE91dHB1dCgpIGNwSW5wdXRDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPHtpbnB1dDogc3RyaW5nLCB2YWx1ZTogbnVtYmVyIHwgc3RyaW5nLCBjb2xvcjogc3RyaW5nfT4odHJ1ZSk7XHJcblxyXG4gIEBPdXRwdXQoKSBjcFRvZ2dsZUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4odHJ1ZSk7XHJcblxyXG4gIEBPdXRwdXQoKSBjcFNsaWRlckNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8e3NsaWRlcjogc3RyaW5nLCB2YWx1ZTogc3RyaW5nIHwgbnVtYmVyLCBjb2xvcjogc3RyaW5nfT4odHJ1ZSk7XHJcbiAgQE91dHB1dCgpIGNwU2xpZGVyRHJhZ0VuZCA9IG5ldyBFdmVudEVtaXR0ZXI8e3NsaWRlcjogc3RyaW5nLCBjb2xvcjogc3RyaW5nfT4odHJ1ZSk7XHJcbiAgQE91dHB1dCgpIGNwU2xpZGVyRHJhZ1N0YXJ0ID0gbmV3IEV2ZW50RW1pdHRlcjx7c2xpZGVyOiBzdHJpbmcsIGNvbG9yOiBzdHJpbmd9Pih0cnVlKTtcclxuXHJcbiAgQE91dHB1dCgpIGNvbG9yUGlja2VyT3BlbiA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPih0cnVlKTtcclxuICBAT3V0cHV0KCkgY29sb3JQaWNrZXJDbG9zZSA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPih0cnVlKTtcclxuXHJcbiAgQE91dHB1dCgpIGNvbG9yUGlja2VyQ2FuY2VsID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KHRydWUpO1xyXG4gIEBPdXRwdXQoKSBjb2xvclBpY2tlclNlbGVjdCA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPih0cnVlKTtcclxuICBAT3V0cHV0KCkgY29sb3JQaWNrZXJDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oZmFsc2UpO1xyXG5cclxuICBAT3V0cHV0KCkgY3BDbXlrQ29sb3JDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4odHJ1ZSk7XHJcblxyXG4gIEBPdXRwdXQoKSBjcFByZXNldENvbG9yc0NoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8YW55Pih0cnVlKTtcclxuXHJcbiAgQEhvc3RMaXN0ZW5lcignY2xpY2snKSBoYW5kbGVDbGljaygpOiB2b2lkIHtcclxuICAgIHRoaXMuaW5wdXRGb2N1cygpO1xyXG4gIH1cclxuXHJcbiAgQEhvc3RMaXN0ZW5lcignZm9jdXMnKSBoYW5kbGVGb2N1cygpOiB2b2lkIHtcclxuICAgIHRoaXMuaW5wdXRGb2N1cygpO1xyXG4gIH1cclxuXHJcbiAgQEhvc3RMaXN0ZW5lcignaW5wdXQnLCBbJyRldmVudCddKSBoYW5kbGVJbnB1dChldmVudDogYW55KTogdm9pZCB7XHJcbiAgICB0aGlzLmlucHV0Q2hhbmdlKGV2ZW50KTtcclxuICB9XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgaW5qZWN0b3I6IEluamVjdG9yLCBwcml2YXRlIGNmcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxyXG4gICAgcHJpdmF0ZSBhcHBSZWY6IEFwcGxpY2F0aW9uUmVmLCBwcml2YXRlIHZjUmVmOiBWaWV3Q29udGFpbmVyUmVmLCBwcml2YXRlIGVsUmVmOiBFbGVtZW50UmVmLFxyXG4gICAgcHJpdmF0ZSBfc2VydmljZTogQ29sb3JQaWNrZXJTZXJ2aWNlKSB7fVxyXG5cclxuICAgIG5nT25Jbml0KCkge1xyXG4gICAgICB0aGlzLmNvbG9yUGlja2VyID0gdGhpcy5jb2xvclBpY2tlciB8fCB0aGlzLmNwRmFsbGJhY2tDb2xvciB8fCAncmdiYSgwLCAwLCAwLCAxKSc7XHJcbiAgfVxyXG5cclxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLmNtcFJlZiAhPSBudWxsKSB7XHJcbiAgICAgIGlmICh0aGlzLnZpZXdBdHRhY2hlZFRvQXBwUmVmKSB7XHJcbiAgICAgICAgdGhpcy5hcHBSZWYuZGV0YWNoVmlldyh0aGlzLmNtcFJlZi5ob3N0Vmlldyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuY21wUmVmLmRlc3Ryb3koKTtcclxuXHJcbiAgICAgIHRoaXMuY21wUmVmID0gbnVsbDtcclxuICAgICAgdGhpcy5kaWFsb2cgPSBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogYW55KTogdm9pZCB7XHJcbiAgICBpZiAoY2hhbmdlcy5jcFRvZ2dsZSAmJiAhdGhpcy5jcERpc2FibGVkKSB7XHJcbiAgICAgIGlmIChjaGFuZ2VzLmNwVG9nZ2xlLmN1cnJlbnRWYWx1ZSkge1xyXG4gICAgICAgIHRoaXMub3BlbkRpYWxvZygpO1xyXG4gICAgICB9IGVsc2UgaWYgKCFjaGFuZ2VzLmNwVG9nZ2xlLmN1cnJlbnRWYWx1ZSkge1xyXG4gICAgICAgIHRoaXMuY2xvc2VEaWFsb2coKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChjaGFuZ2VzLmNvbG9yUGlja2VyKSB7XHJcbiAgICAgIGlmICh0aGlzLmRpYWxvZyAmJiAhdGhpcy5pZ25vcmVDaGFuZ2VzKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY3BEaWFsb2dEaXNwbGF5ID09PSAnaW5saW5lJykge1xyXG4gICAgICAgICAgdGhpcy5kaWFsb2cuc2V0SW5pdGlhbENvbG9yKGNoYW5nZXMuY29sb3JQaWNrZXIuY3VycmVudFZhbHVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZGlhbG9nLnNldENvbG9yRnJvbVN0cmluZyhjaGFuZ2VzLmNvbG9yUGlja2VyLmN1cnJlbnRWYWx1ZSwgZmFsc2UpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5jcFVzZVJvb3RWaWV3Q29udGFpbmVyICYmIHRoaXMuY3BEaWFsb2dEaXNwbGF5ICE9PSAnaW5saW5lJykge1xyXG4gICAgICAgICAgdGhpcy5jbXBSZWYuY2hhbmdlRGV0ZWN0b3JSZWYuZGV0ZWN0Q2hhbmdlcygpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5pZ25vcmVDaGFuZ2VzID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGNoYW5nZXMuY3BQcmVzZXRMYWJlbCB8fCBjaGFuZ2VzLmNwUHJlc2V0Q29sb3JzKSB7XHJcbiAgICAgIGlmICh0aGlzLmRpYWxvZykge1xyXG4gICAgICAgIHRoaXMuZGlhbG9nLnNldFByZXNldENvbmZpZyh0aGlzLmNwUHJlc2V0TGFiZWwsIHRoaXMuY3BQcmVzZXRDb2xvcnMpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgb3BlbkRpYWxvZygpOiB2b2lkIHtcclxuICAgIGlmICghdGhpcy5kaWFsb2dDcmVhdGVkKSB7XHJcbiAgICAgIGxldCB2Y1JlZiA9IHRoaXMudmNSZWY7XHJcblxyXG4gICAgICB0aGlzLmRpYWxvZ0NyZWF0ZWQgPSB0cnVlO1xyXG4gICAgICB0aGlzLnZpZXdBdHRhY2hlZFRvQXBwUmVmID0gZmFsc2U7XHJcblxyXG4gICAgICBpZiAodGhpcy5jcFVzZVJvb3RWaWV3Q29udGFpbmVyICYmIHRoaXMuY3BEaWFsb2dEaXNwbGF5ICE9PSAnaW5saW5lJykge1xyXG4gICAgICAgIGNvbnN0IGNsYXNzT2ZSb290Q29tcG9uZW50ID0gdGhpcy5hcHBSZWYuY29tcG9uZW50VHlwZXNbMF07XHJcbiAgICAgICAgY29uc3QgYXBwSW5zdGFuY2UgPSB0aGlzLmluamVjdG9yLmdldChjbGFzc09mUm9vdENvbXBvbmVudCwgSW5qZWN0b3IuTlVMTCk7XHJcblxyXG4gICAgICAgIGlmIChhcHBJbnN0YW5jZSAhPT0gSW5qZWN0b3IuTlVMTCkge1xyXG4gICAgICAgICAgdmNSZWYgPSBhcHBJbnN0YW5jZS52Y1JlZiB8fCBhcHBJbnN0YW5jZS52aWV3Q29udGFpbmVyUmVmIHx8IHRoaXMudmNSZWY7XHJcblxyXG4gICAgICAgICAgaWYgKE5HX0RFVl9NT0RFICYmIHZjUmVmID09PSB0aGlzLnZjUmVmKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignWW91IGFyZSB1c2luZyBjcFVzZVJvb3RWaWV3Q29udGFpbmVyLCAnICtcclxuICAgICAgICAgICAgICAnYnV0IHRoZSByb290IGNvbXBvbmVudCBpcyBub3QgZXhwb3Npbmcgdmlld0NvbnRhaW5lclJlZiEnICtcclxuICAgICAgICAgICAgICAnUGxlYXNlIGV4cG9zZSBpdCBieSBhZGRpbmcgXFwncHVibGljIHZjUmVmOiBWaWV3Q29udGFpbmVyUmVmXFwnIHRvIHRoZSBjb25zdHJ1Y3Rvci4nKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy52aWV3QXR0YWNoZWRUb0FwcFJlZiA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCBjb21wRmFjdG9yeSA9IHRoaXMuY2ZyLnJlc29sdmVDb21wb25lbnRGYWN0b3J5KENvbG9yUGlja2VyQ29tcG9uZW50KTtcclxuXHJcbiAgICAgIGlmICh0aGlzLnZpZXdBdHRhY2hlZFRvQXBwUmVmKSB7XHJcbiAgICAgICAgdGhpcy5jbXBSZWYgPSBjb21wRmFjdG9yeS5jcmVhdGUodGhpcy5pbmplY3Rvcik7XHJcbiAgICAgICAgdGhpcy5hcHBSZWYuYXR0YWNoVmlldyh0aGlzLmNtcFJlZi5ob3N0Vmlldyk7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCgodGhpcy5jbXBSZWYuaG9zdFZpZXcgYXMgRW1iZWRkZWRWaWV3UmVmPGFueT4pLnJvb3ROb2Rlc1swXSBhcyBIVE1MRWxlbWVudCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc3QgaW5qZWN0b3IgPSBJbmplY3Rvci5jcmVhdGUoe1xyXG4gICAgICAgICAgcHJvdmlkZXJzOiBbXSxcclxuICAgICAgICAgIC8vIFdlIHNob3VsZG4ndCB1c2UgYHZjUmVmLnBhcmVudEluamVjdG9yYCBzaW5jZSBpdCdzIGJlZW4gZGVwcmVjYXRlZCBsb25nIHRpbWUgYWdvIGFuZCBtaWdodCBiZSByZW1vdmVkXHJcbiAgICAgICAgICAvLyBpbiBuZXdlciBBbmd1bGFyIHZlcnNpb25zOiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL3B1bGwvMjUxNzQuXHJcbiAgICAgICAgICBwYXJlbnQ6IHZjUmVmLmluamVjdG9yLFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmNtcFJlZiA9IHZjUmVmLmNyZWF0ZUNvbXBvbmVudChjb21wRmFjdG9yeSwgMCwgaW5qZWN0b3IsIFtdKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5jbXBSZWYuaW5zdGFuY2Uuc2V0dXBEaWFsb2codGhpcywgdGhpcy5lbFJlZiwgdGhpcy5jb2xvclBpY2tlcixcclxuICAgICAgICB0aGlzLmNwV2lkdGgsIHRoaXMuY3BIZWlnaHQsIHRoaXMuY3BEaWFsb2dEaXNwbGF5LCB0aGlzLmNwRmFsbGJhY2tDb2xvciwgdGhpcy5jcENvbG9yTW9kZSxcclxuICAgICAgICB0aGlzLmNwQ215a0VuYWJsZWQsIHRoaXMuY3BBbHBoYUNoYW5uZWwsIHRoaXMuY3BPdXRwdXRGb3JtYXQsIHRoaXMuY3BEaXNhYmxlSW5wdXQsXHJcbiAgICAgICAgdGhpcy5jcElnbm9yZWRFbGVtZW50cywgdGhpcy5jcFNhdmVDbGlja091dHNpZGUsIHRoaXMuY3BDbG9zZUNsaWNrT3V0c2lkZSxcclxuICAgICAgICB0aGlzLmNwVXNlUm9vdFZpZXdDb250YWluZXIsIHRoaXMuY3BQb3NpdGlvbiwgdGhpcy5jcFBvc2l0aW9uT2Zmc2V0LFxyXG4gICAgICAgIHRoaXMuY3BQb3NpdGlvblJlbGF0aXZlVG9BcnJvdywgdGhpcy5jcFByZXNldExhYmVsLCB0aGlzLmNwUHJlc2V0Q29sb3JzLFxyXG4gICAgICAgIHRoaXMuY3BQcmVzZXRDb2xvcnNDbGFzcywgdGhpcy5jcE1heFByZXNldENvbG9yc0xlbmd0aCwgdGhpcy5jcFByZXNldEVtcHR5TWVzc2FnZSxcclxuICAgICAgICB0aGlzLmNwUHJlc2V0RW1wdHlNZXNzYWdlQ2xhc3MsIHRoaXMuY3BPS0J1dHRvbiwgdGhpcy5jcE9LQnV0dG9uQ2xhc3MsXHJcbiAgICAgICAgdGhpcy5jcE9LQnV0dG9uVGV4dCwgdGhpcy5jcENhbmNlbEJ1dHRvbiwgdGhpcy5jcENhbmNlbEJ1dHRvbkNsYXNzLFxyXG4gICAgICAgIHRoaXMuY3BDYW5jZWxCdXR0b25UZXh0LCB0aGlzLmNwQWRkQ29sb3JCdXR0b24sIHRoaXMuY3BBZGRDb2xvckJ1dHRvbkNsYXNzLFxyXG4gICAgICAgIHRoaXMuY3BBZGRDb2xvckJ1dHRvblRleHQsIHRoaXMuY3BSZW1vdmVDb2xvckJ1dHRvbkNsYXNzLCB0aGlzLmNwRXllRHJvcHBlciwgdGhpcy5lbFJlZixcclxuICAgICAgICB0aGlzLmNwRXh0cmFUZW1wbGF0ZSx0aGlzLmhlYWRlck5hbWUsdGhpcy5zYXZlQnRuVHh0LHRoaXMuY2FuY2VsQnRuVHh0KTtcclxuXHJcbiAgICAgIHRoaXMuZGlhbG9nID0gdGhpcy5jbXBSZWYuaW5zdGFuY2U7XHJcblxyXG4gICAgICBpZiAodGhpcy52Y1JlZiAhPT0gdmNSZWYpIHtcclxuICAgICAgICB0aGlzLmNtcFJlZi5jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAodGhpcy5kaWFsb2cpIHtcclxuICAgICAgdGhpcy5kaWFsb2cub3BlbkRpYWxvZyh0aGlzLmNvbG9yUGlja2VyKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBjbG9zZURpYWxvZygpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLmRpYWxvZyAmJiB0aGlzLmNwRGlhbG9nRGlzcGxheSA9PT0gJ3BvcHVwJykge1xyXG4gICAgICB0aGlzLmRpYWxvZy5jbG9zZURpYWxvZygpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIGNteWtDaGFuZ2VkKHZhbHVlOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIHRoaXMuY3BDbXlrQ29sb3JDaGFuZ2UuZW1pdCh2YWx1ZSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc3RhdGVDaGFuZ2VkKHN0YXRlOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICB0aGlzLmNwVG9nZ2xlQ2hhbmdlLmVtaXQoc3RhdGUpO1xyXG5cclxuICAgIGlmIChzdGF0ZSkge1xyXG4gICAgICB0aGlzLmNvbG9yUGlja2VyT3Blbi5lbWl0KHRoaXMuY29sb3JQaWNrZXIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5jb2xvclBpY2tlckNsb3NlLmVtaXQodGhpcy5jb2xvclBpY2tlcik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgY29sb3JDaGFuZ2VkKHZhbHVlOiBzdHJpbmcsIGlnbm9yZTogYm9vbGVhbiA9IHRydWUpOiB2b2lkIHtcclxuICAgIHRoaXMuaWdub3JlQ2hhbmdlcyA9IGlnbm9yZTtcclxuXHJcbiAgICB0aGlzLmNvbG9yUGlja2VyQ2hhbmdlLmVtaXQodmFsdWUpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGNvbG9yU2VsZWN0ZWQodmFsdWU6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgdGhpcy5jb2xvclBpY2tlclNlbGVjdC5lbWl0KHZhbHVlKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBjb2xvckNhbmNlbGVkKCk6IHZvaWQge1xyXG4gICAgdGhpcy5jb2xvclBpY2tlckNhbmNlbC5lbWl0KCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgaW5wdXRGb2N1cygpOiB2b2lkIHtcclxuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQ7XHJcblxyXG4gICAgY29uc3QgaWdub3JlZCA9IHRoaXMuY3BJZ25vcmVkRWxlbWVudHMuZmlsdGVyKChpdGVtOiBhbnkpID0+IGl0ZW0gPT09IGVsZW1lbnQpO1xyXG5cclxuICAgIGlmICghdGhpcy5jcERpc2FibGVkICYmICFpZ25vcmVkLmxlbmd0aCkge1xyXG4gICAgICBpZiAodHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJyAmJiBlbGVtZW50ID09PSBkb2N1bWVudC5hY3RpdmVFbGVtZW50KSB7XHJcbiAgICAgICAgdGhpcy5vcGVuRGlhbG9nKCk7XHJcbiAgICAgIH0gZWxzZSBpZiAoIXRoaXMuZGlhbG9nIHx8ICF0aGlzLmRpYWxvZy5zaG93KSB7XHJcbiAgICAgICAgdGhpcy5vcGVuRGlhbG9nKCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5jbG9zZURpYWxvZygpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgaW5wdXRDaGFuZ2UoZXZlbnQ6IGFueSk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMuZGlhbG9nKSB7XHJcbiAgICAgIHRoaXMuZGlhbG9nLnNldENvbG9yRnJvbVN0cmluZyhldmVudC50YXJnZXQudmFsdWUsIHRydWUpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5jb2xvclBpY2tlciA9IGV2ZW50LnRhcmdldC52YWx1ZTtcclxuXHJcbiAgICAgIHRoaXMuY29sb3JQaWNrZXJDaGFuZ2UuZW1pdCh0aGlzLmNvbG9yUGlja2VyKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBpbnB1dENoYW5nZWQoZXZlbnQ6IGFueSk6IHZvaWQge1xyXG4gICAgdGhpcy5jcElucHV0Q2hhbmdlLmVtaXQoZXZlbnQpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHNsaWRlckNoYW5nZWQoZXZlbnQ6IGFueSk6IHZvaWQge1xyXG4gICAgdGhpcy5jcFNsaWRlckNoYW5nZS5lbWl0KGV2ZW50KTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzbGlkZXJEcmFnRW5kKGV2ZW50OiB7IHNsaWRlcjogc3RyaW5nLCBjb2xvcjogc3RyaW5nIH0pOiB2b2lkIHtcclxuICAgIHRoaXMuY3BTbGlkZXJEcmFnRW5kLmVtaXQoZXZlbnQpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHNsaWRlckRyYWdTdGFydChldmVudDogeyBzbGlkZXI6IHN0cmluZywgY29sb3I6IHN0cmluZyB9KTogdm9pZCB7XHJcbiAgICB0aGlzLmNwU2xpZGVyRHJhZ1N0YXJ0LmVtaXQoZXZlbnQpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHByZXNldENvbG9yc0NoYW5nZWQodmFsdWU6IGFueVtdKTogdm9pZCB7XHJcbiAgICB0aGlzLmNwUHJlc2V0Q29sb3JzQ2hhbmdlLmVtaXQodmFsdWUpO1xyXG4gIH1cclxufVxyXG4iXX0=
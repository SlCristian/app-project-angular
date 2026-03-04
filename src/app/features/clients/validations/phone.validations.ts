
import { AbstractControl, ValidationErrors } from "@angular/forms";

export function phoneValidator(control:AbstractControl):ValidationErrors | null{

const phone=control.value;
if(!phone) return null;

const phoneInvalid=!(phone.startsWith('9'));

return phoneInvalid? {InvalidPhone:true}:null;

}

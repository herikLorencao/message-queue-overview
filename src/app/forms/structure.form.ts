import {Validators} from "@angular/forms";

export const structureForm = {
  producersCount: [null, Validators.required],
  consumersCount: [null, Validators.required],
  consumerExecutionTimeSeconds: [null, Validators.min(1)]
}

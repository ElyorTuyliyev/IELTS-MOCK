#### 0.1.0 (2026-05-15)

##### New Features

- add `DateDisplay` and `DateInput` shared components for consistent date formatting and native date fields
- persist student exam progress in session storage (navigation, answers, listening state) with debounced saves and restore on reload
- block editing exams and removing enrolled students when an exam is archived

##### Improvements

- restore blank, choice, and drag-drop answers from saved session on exam player load
- improve exam player part-tab layout (flex, wrapping chips, stable scrollbar gutter)
- centralize ISO ↔ date-input conversion utilities used by exam forms

##### Other Changes

- tighten `tsconfig.app.json` compiler options

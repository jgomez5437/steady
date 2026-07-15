interface PatientDetailsFormProps {
  name: string;
  dob: string;
  maxDob: string;
  rememberDetails: boolean;
  onNameChange: (value: string) => void;
  onDobChange: (value: string) => void;
  onRememberDetailsChange: (value: boolean) => void;
}

export function PatientDetailsForm({
  name,
  dob,
  maxDob,
  rememberDetails,
  onNameChange,
  onDobChange,
  onRememberDetailsChange,
}: PatientDetailsFormProps) {
  return (
    <form className="reading-form" onSubmit={(e) => e.preventDefault()}>
      <div className="field grow">
        <label htmlFor="patientName">Patient name</label>
        <input
          type="text"
          id="patientName"
          placeholder="Full name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
        />
      </div>
      <div className="field">
        <label htmlFor="patientDob">Date of birth</label>
        <input
          type="date"
          id="patientDob"
          max={maxDob}
          value={dob}
          onChange={(e) => onDobChange(e.target.value)}
        />
      </div>
      <div className="checkbox-row">
        <label className="checkbox-label" htmlFor="rememberPatientDetails">
          <input
            type="checkbox"
            id="rememberPatientDetails"
            checked={rememberDetails}
            onChange={(e) => onRememberDetailsChange(e.target.checked)}
          />
          Remember my name and date of birth on this device
        </label>
        <p className="checkbox-hint">Saved only in this browser, never sent to our servers.</p>
      </div>
    </form>
  );
}
